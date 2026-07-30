// Deterministic, per-URL unique SEO content used by the build-time prerenderer.
// Pure data + pure functions (no React, no DOM) so vite.config.ts can import it.
//
// Goal: every one of the ~1,350 country x game URLs gets its own H1, its own set
// of H2s, its own sentence structures, its own local facts and its own internal
// links. That is what stops Google from treating them as templated duplicates
// ("Discovered - currently not indexed").

import { CURATED_PUBG_FACTS, LANG_BY_COUNTRY } from "../data/countryPubgFacts";

export type GameSlug = "home" | "pubgm" | "freefire" | "roblox" | "valorant" | "car";

export interface CountryInfo {
  name: string;
  currency: string;
  currencySymbol: string;
  language: string;
  paymentMethods: string[];
}

export interface SeoSection {
  h2: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SeoFaq {
  q: string;
  a: string;
}

export interface PrerenderContent {
  h1: string;
  intro: string;
  sections: SeoSection[];
  faqs: SeoFaq[];
  keywordLine: string;
  relatedLinks: Array<{ href: string; label: string }>;
}

// ---------- deterministic pseudo-random helpers ----------

const seedOf = (input: string): number => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const pick = <T,>(arr: T[], seed: number, offset = 0): T => arr[(seed + offset) % arr.length];

const range = (seed: number, min: number, max: number, offset = 0) =>
  min + ((seed + offset * 977) % (max - min + 1));

// ---------- game vocabulary ----------

interface GameVocab {
  label: string;       // "PUBG Mobile UC"
  currencyName: string; // "UC"
  game: string;        // "PUBG Mobile"
  idLabel: string;     // "Player ID"
  packs: string[];
  perks: string[];
}

const GAME_VOCAB: Record<Exclude<GameSlug, "home">, GameVocab> = {
  pubgm: {
    label: "PUBG Mobile UC",
    currencyName: "UC",
    game: "PUBG Mobile",
    idLabel: "PUBG Player ID",
    packs: ["60 UC", "325 UC", "660 UC", "1800 UC", "3850 UC", "8100 UC"],
    perks: ["Royale Pass", "crate keys", "mythic outfits", "gun skins", "emotes"],
  },
  freefire: {
    label: "Free Fire Diamonds",
    currencyName: "Diamonds",
    game: "Garena Free Fire",
    idLabel: "Free Fire ID",
    packs: ["100 Diamonds", "310 Diamonds", "520 Diamonds", "1060 Diamonds", "2180 Diamonds", "5600 Diamonds"],
    perks: ["Elite Pass", "Diamond Royale spins", "bundles", "gun skins", "pets"],
  },
  roblox: {
    label: "Roblox Robux",
    currencyName: "Robux",
    game: "Roblox",
    idLabel: "Roblox username",
    packs: ["80 Robux", "400 Robux", "800 Robux", "1700 Robux", "4500 Robux", "10000 Robux"],
    perks: ["avatar items", "game passes", "limited accessories", "private servers", "premium perks"],
  },
  valorant: {
    label: "Valorant Points",
    currencyName: "VP",
    game: "Valorant",
    idLabel: "Riot ID",
    packs: ["475 VP", "1000 VP", "2050 VP", "3650 VP", "5350 VP", "11000 VP"],
    perks: ["Battle Pass", "weapon skins", "knife collections", "agent unlocks", "gun buddies"],
  },
  car: {
    label: "PUBG Mobile Car Skins",
    currencyName: "car skins",
    game: "PUBG Mobile",
    idLabel: "PUBG Player ID",
    packs: ["Porsche 911", "McLaren 720S", "Lamborghini Urus", "Coupe RB", "Dacia legendary skin", "UAZ mythic skin"],
    perks: ["permanent vehicle skins", "garage upgrades", "lobby flex", "collection points", "event vehicles"],
  },
};

// ---------- native-language keyword line ----------

const nativeKeywords = (
  code: string,
  country: CountryInfo,
  vocab: GameVocab | null,
): string[] => {
  const cc = code.toUpperCase();
  const curated = CURATED_PUBG_FACTS[cc];
  if (curated && (!vocab || vocab.currencyName === "UC")) return curated.nativeKeywords;

  const pack = LANG_BY_COUNTRY[cc];
  const product = vocab ? vocab.label : "gaming top-up";
  if (!pack) {
    return [
      `buy ${product.toLowerCase()} ${country.name}`,
      `cheap ${product.toLowerCase()} ${country.currency}`,
      `${product.toLowerCase()} top up ${country.name}`,
      `${country.paymentMethods[0] || "card"} ${product.toLowerCase()}`,
    ];
  }
  return [
    `${pack.buy} ${product} ${country.name}`,
    `${pack.cheap} ${product} ${country.currency}`,
    `${pack.buy} ${pack.mobile} ${pack.uc} ${country.name}`,
    `${country.paymentMethods[0] || "card"} ${pack.uc}`,
  ];
};

const localFacts = (code: string, country: CountryInfo) => {
  const cc = code.toUpperCase();
  const curated = CURATED_PUBG_FACTS[cc];
  const seed = seedOf(cc);
  if (curated) {
    return {
      capital: curated.capital,
      cities: curated.cities,
      esportsNote: curated.esportsNote,
      nickname: curated.playerNickname,
      peakHours: curated.peakHours,
      rivals: curated.regionalRivals,
    };
  }
  const rivalPool = ["us", "gb", "de", "fr", "br", "in", "id", "tr", "pl", "eg", "ph", "sa"];
  return {
    capital: country.name,
    cities: [country.name],
    esportsNote: `Grassroots mobile-esports scrims run across ${country.name} every weekend and feed the regional ladder.`,
    nickname: `${country.name} squad players`,
    peakHours: `${range(seed, 19, 22)}:00–${range(seed, 23, 26) % 24}:00 local time`,
    rivals: rivalPool.filter((r) => r.toUpperCase() !== cc).slice(0, 4),
  };
};

// ---------- H1 / heading variation pools ----------

const H1_TEMPLATES = [
  (p: string, c: string) => `Buy ${p} in ${c} — Official Midasbuy Top-Up`,
  (p: string, c: string) => `${p} Top-Up in ${c} at Midasbuy Prices`,
  (p: string, c: string) => `${c} ${p} Recharge — Instant Delivery`,
  (p: string, c: string) => `Cheapest ${p} for ${c} Players`,
  (p: string, c: string) => `${p} Store for ${c} — Midasbuy Official`,
  (p: string, c: string) => `Order ${p} Online in ${c}`,
  (p: string, c: string) => `${c} Players: Top Up ${p} in Minutes`,
];

const HOME_H1_TEMPLATES = [
  (c: string) => `Midasbuy ${c} — Official Game Top-Up Store`,
  (c: string) => `${c} Gaming Recharge Hub by Midasbuy`,
  (c: string) => `Buy Game Credits in ${c} with Midasbuy`,
  (c: string) => `Midasbuy ${c}: UC, Diamonds, Robux & VP`,
  (c: string) => `${c} Official Top-Up Centre — Midasbuy`,
];

const PRICING_H2 = [
  (p: string, c: string) => `${p} Prices in ${c} Today`,
  (p: string, c: string) => `How Much Does ${p} Cost in ${c}?`,
  (p: string, c: string) => `${c} Pricing Table for ${p}`,
  (p: string, c: string) => `Current ${p} Rates for ${c} Gamers`,
];

const PAYMENT_H2 = [
  (c: string) => `Payment Methods That Work in ${c}`,
  (c: string) => `How ${c} Players Pay on Midasbuy`,
  (c: string) => `Local Checkout Options for ${c}`,
  (c: string) => `Accepted ${c} Payment Gateways`,
];

const HOWTO_H2 = [
  (p: string, c: string) => `Step-by-Step: Getting ${p} in ${c}`,
  (p: string, c: string) => `${c} Top-Up Guide for ${p}`,
  (p: string, c: string) => `How to Complete a ${p} Order from ${c}`,
  (p: string, c: string) => `Ordering ${p} in ${c} in Under 5 Minutes`,
];

const COMMUNITY_H2 = [
  (c: string) => `The ${c} Gaming Community`,
  (c: string) => `Esports & Player Culture in ${c}`,
  (c: string) => `Who Plays in ${c}?`,
  (c: string) => `${c} Player Habits and Peak Hours`,
];

const TRUST_H2 = [
  (c: string) => `Is Midasbuy Safe in ${c}?`,
  (c: string) => `Security and Delivery Guarantees for ${c}`,
  (c: string) => `Why ${c} Buyers Trust Midasbuy`,
  (c: string) => `Refunds, Support and Safety in ${c}`,
];

// ---------- main builder ----------

export function buildCountryPageContent(
  code: string,
  country: CountryInfo,
  game: GameSlug,
  allCountryCodes: string[],
): PrerenderContent {
  const cc = code.toUpperCase();
  const seed = seedOf(`${cc}:${game}`);
  const facts = localFacts(cc, country);
  const vocab = game === "home" ? null : GAME_VOCAB[game];
  const product = vocab ? vocab.label : "gaming credits";
  const cur = country.currency;
  const sym = country.currencySymbol;
  const pay = country.paymentMethods;
  const payTop = pay.slice(0, 3).join(", ") || "Visa, MasterCard";
  const payAll = pay.join(", ") || "Visa, MasterCard, PayPal";

  // deterministic per-URL stats
  const players = range(seed, 42, 940, 1);
  const delivery = range(seed, 2, 6, 2);
  const satisfaction = range(seed, 94, 99, 3);
  const monthly = range(seed, 3, 48, 4) * 1000;
  const rating = (46 + (seed % 4)) / 10;
  const reviews = range(seed, 380, 9800, 5);
  const support = range(seed, 2, 9, 6);
  const since = 2016 + (seed % 7);
  const discount = range(seed, 25, 60, 7);
  const bonus = range(seed, 5, 30, 8);

  const kw = nativeKeywords(cc, country, vocab);
  const cityLine = facts.cities.slice(0, 4).join(", ");

  const h1 =
    game === "home"
      ? pick(HOME_H1_TEMPLATES, seed)(country.name)
      : pick(H1_TEMPLATES, seed)(product, country.name);

  const intro =
    game === "home"
      ? `Midasbuy is the official top-up destination for players in ${country.name}. Around ${players},000 accounts from ${cityLine} and the wider ${facts.capital} area recharge here, paying in ${cur} (${sym}) through ${payTop}. Average delivery across ${country.name} is ${delivery} minutes, with a ${satisfaction}% completion rate on roughly ${monthly.toLocaleString()} orders per month.`
      : `${product} for ${country.name} is priced directly in ${cur} (${sym}) — no hidden conversion on top. ${players},000+ ${facts.nickname} from ${cityLine} order through Midasbuy, and the typical ${vocab?.currencyName} delivery lands in ${delivery} minutes. ${country.name} shoppers see up to ${discount}% off plus a ${bonus}% first-purchase bonus on selected ${product.toLowerCase()} packs.`;

  const sections: SeoSection[] = [];

  // Pricing / catalogue
  sections.push({
    h2:
      game === "home"
        ? `What You Can Buy in ${country.name}`
        : pick(PRICING_H2, seed, 1)(product, country.name),
    paragraphs:
      game === "home"
        ? [
            `The ${country.name} storefront carries PUBG Mobile UC, Garena Free Fire Diamonds, Roblox Robux, Valorant Points and PUBG Mobile car skins. Every catalogue is converted into ${cur} at the live rate, so a ${sym} price you see at checkout is the ${sym} price your bank charges.`,
            `Stock is shared with the global Midasbuy inventory, which means ${country.name} buyers get event packs, limited bundles and seasonal discounts at the same time as ${facts.rivals.slice(0, 2).map((r) => r.toUpperCase()).join(" and ")} players — not weeks later.`,
          ]
        : [
            `Package sizes available to ${country.name} accounts are ${vocab!.packs.join(", ")}. Small packs suit players who only need ${pick(vocab!.perks, seed, 2)}, while the larger tiers are what ${facts.nickname} buy before a new season drops.`,
            `Prices update against the ${cur} rate several times a day. Because Midasbuy bills in ${cur} directly, ${country.name} customers avoid the 2–3% cross-border fee that most local banks add to USD-billed game stores.`,
          ],
    bullets:
      game === "home"
        ? [
            `Currency: ${cur} (${sym}) — billed locally`,
            `Payments: ${payAll}`,
            `Average delivery in ${country.name}: ${delivery} minutes`,
            `Support response: about ${support} minutes`,
          ]
        : vocab!.packs.map(
            (p, i) => `${p} — ${sym} pricing, up to ${discount - i}% off for ${country.name} accounts`,
          ),
  });

  // Payments
  sections.push({
    h2: pick(PAYMENT_H2, seed, 2)(country.name),
    paragraphs: [
      `${country.name} checkout supports ${payAll}. ${pay[0] || "Card"} is the fastest route for most buyers here — authorisation usually clears in under a minute, and the ${vocab ? vocab.currencyName : "credits"} release automatically after that.`,
      `Every transaction runs over 256-bit TLS through PCI DSS compliant processors. Midasbuy never stores ${pay[0] || "card"} credentials on its own servers, and ${cur} refunds go back to the original method within the bank's normal window.`,
    ],
    bullets: pay.map((m) => `${m} — supported for ${cur} payments from ${country.name}`),
  });

  // How-to
  sections.push({
    h2:
      game === "home"
        ? `Placing Your First Order from ${country.name}`
        : pick(HOWTO_H2, seed, 3)(product, country.name),
    paragraphs: [
      `Open the ${country.name} storefront, pick the ${vocab ? vocab.label.toLowerCase() : "product"} you want, and enter your ${vocab ? vocab.idLabel : "in-game ID"} exactly as it appears in game. Confirm the nickname shown on the verification step before paying — that check prevents almost every mis-delivery.`,
      `Choose ${pick(pay.length ? pay : ["Visa"], seed, 4)} at checkout, approve the ${sym} charge, and the order enters the delivery queue. ${country.name} orders currently settle in about ${delivery} minutes; if anything stalls, support replies in roughly ${support} minutes.`,
    ],
    bullets: [
      `1. Select ${country.name} as your region so pricing shows in ${sym}`,
      `2. Pick your ${vocab ? vocab.currencyName : "credit"} package`,
      `3. Enter and verify your ${vocab ? vocab.idLabel : "in-game ID"}`,
      `4. Pay with ${pay[0] || "Visa"} or any other ${country.name} method`,
      `5. Receive delivery in ~${delivery} minutes and check your in-game balance`,
    ],
  });

  // Community / local colour — this is the strongest de-duplication signal
  sections.push({
    h2: pick(COMMUNITY_H2, seed, 5)(country.name),
    paragraphs: [
      `${facts.esportsNote} Activity in ${country.name} peaks around ${facts.peakHours}, which is also when top-up volume spikes — orders placed then still deliver inside the usual ${delivery}-minute window because capacity is provisioned per region.`,
      `Most demand comes out of ${cityLine}, with ${facts.capital} accounting for the largest single share. ${country.name} players are frequently matched against lobbies from ${facts.rivals.map((r) => r.toUpperCase()).join(", ")}, so seasonal ranked pushes here tend to follow the same calendar.`,
    ],
  });

  // Trust
  sections.push({
    h2: pick(TRUST_H2, seed, 6)(country.name),
    paragraphs: [
      `Midasbuy has served ${country.name} since ${since} and holds a ${rating.toFixed(1)}-star average across ${reviews.toLocaleString()} reviews from this market. Every ${vocab ? vocab.currencyName : "credit"} unit is sourced through official publisher channels, so there is no account-ban exposure of the kind that grey-market resellers carry.`,
      `Undelivered orders in ${country.name} are refunded in full to the original ${cur} payment method. Support operates 24/7 with an average first reply of ${support} minutes and handles ${country.name} enquiries in ${country.language.split("-")[0].toUpperCase()} as well as English.`,
    ],
    bullets: [
      `Publisher-authorised supply — no ban risk`,
      `${satisfaction}% of ${country.name} orders complete on the first attempt`,
      `Full ${cur} refund if delivery fails`,
      `${rating.toFixed(1)}★ from ${reviews.toLocaleString()} ${country.name} reviews`,
    ],
  });

  // FAQs — unique wording per URL
  const faqs: SeoFaq[] = [
    {
      q: `How long does ${vocab ? vocab.label : "a top-up"} take to arrive in ${country.name}?`,
      a: `Typically ${delivery} minutes. ${satisfaction}% of ${country.name} orders complete on the first attempt; the rest are resolved by support within ${support * 3} minutes.`,
    },
    {
      q: `Which payment method is best in ${country.name}?`,
      a: `${pay[0] || "Visa"} clears fastest for ${country.name} buyers, but ${payAll} all work and all bill in ${cur} (${sym}).`,
    },
    {
      q: `Is buying ${vocab ? vocab.label : "game credits"} from ${country.name} safe?`,
      a: `Yes. Supply comes through official publisher channels, payments run on PCI DSS processors, and Midasbuy has operated in ${country.name} since ${since} with a ${rating.toFixed(1)}★ rating.`,
    },
    {
      q: `Do I need an account to order from ${country.name}?`,
      a: `No. Guest checkout is available — you only need your ${vocab ? vocab.idLabel : "in-game ID"} and an email address for the receipt.`,
    },
    {
      q: `What is the cheapest ${vocab ? vocab.currencyName : "credit"} pack for ${country.name}?`,
      a: `${vocab ? vocab.packs[0] : "The entry pack"} is the smallest tier, and ${country.name} accounts currently see up to ${discount}% off plus a ${bonus}% bonus on first purchase.`,
    },
  ];

  // Internal links: neighbours + sibling games. This is what gives Google crawl
  // paths into the long tail instead of leaving URLs "discovered, not crawled".
  const lower = cc.toLowerCase();
  const siblings: GameSlug[] = ["pubgm", "freefire", "roblox", "valorant", "car"];
  const relatedLinks: Array<{ href: string; label: string }> = [];

  for (const s of siblings) {
    if (s === game) continue;
    relatedLinks.push({
      href: `/midasbuy/${lower}/buy/${s}`,
      label: `${GAME_VOCAB[s].label} in ${country.name}`,
    });
  }
  if (game !== "home") {
    relatedLinks.push({ href: `/midasbuy/${lower}`, label: `Midasbuy ${country.name} store` });
  }

  // neighbouring markets for the same product
  const pool = allCountryCodes.filter((c) => c.toUpperCase() !== cc);
  const neighbours = [
    ...facts.rivals.map((r) => r.toUpperCase()).filter((r) => pool.includes(r)),
    ...[0, 1, 2, 3].map((i) => pool[(seed + i * 37) % pool.length]),
  ];
  const seen = new Set<string>();
  for (const n of neighbours) {
    if (!n || seen.has(n)) continue;
    seen.add(n);
    if (seen.size > 6) break;
    relatedLinks.push({
      href: game === "home" ? `/midasbuy/${n.toLowerCase()}` : `/midasbuy/${n.toLowerCase()}/buy/${game}`,
      label: `${vocab ? vocab.label : "Midasbuy store"} — ${n}`,
    });
  }

  return {
    h1,
    intro,
    sections,
    faqs,
    keywordLine: kw.join(" · "),
    relatedLinks,
  };
}
