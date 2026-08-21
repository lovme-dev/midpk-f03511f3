import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import type { Plugin } from "vite";
import { COUNTRY_DATA, getGameSEOConfig } from "./src/utils/gameSeoConfigs";
import { buildCountryPageContent } from "./src/utils/prerenderSeoContent";
import type { PrerenderContent, GameSlug } from "./src/utils/prerenderSeoContent";

// Plugin to make CSS non-render-blocking
const asyncCssPlugin = (): Plugin => ({
  name: 'async-css',
  apply: 'build',
  transformIndexHtml(html) {
    // Transform stylesheet links to load asynchronously
    return html.replace(
      /<link([^>]*rel=["']stylesheet["'][^>]*)>/gi,
      '<link$1 media="print" onload="this.media=\'all\'; this.onload=null;">'
    );
  },
});
// Sitemap x-default URL replacements - redirect URLs → final destination URLs
// This prevents Google "Page with redirect" errors
// CRITICAL: All redirect URLs must be replaced with their FINAL destination URLs
const SITEMAP_REPLACEMENTS = [
  // PUBG Mobile - redirect URL to final URL (180+ occurrences per sitemap)
  { from: 'href="https://www.midasbuy.com.pk/pubg-mobile"', to: 'href="https://www.midasbuy.com.pk/midasbuy/us/buy/pubgm"' },
  // Home page - root "/" to /midasbuy/us (180+ occurrences)
  // Match x-default with trailing /" to avoid matching country-specific URLs
  { from: 'hreflang="x-default" href="https://www.midasbuy.com.pk/"', to: 'hreflang="x-default" href="https://www.midasbuy.com.pk/midasbuy/us/buy/pubgm"' }
];

const SITEMAP_FILES = [
  'public/sitemap_countries_pubg.xml'
];

// Function to fix sitemaps - can be called at build time or directly
const fixSitemapFiles = (files: string[], isDistFolder = false) => {
  let totalReplacements = 0;

  for (const file of files) {
    const filePath = path.resolve(isDistFolder ? file.replace('public/', 'dist/') : file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ⏭️  ${filePath}: Not found (skipped)`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;
    
    for (const { from, to } of SITEMAP_REPLACEMENTS) {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        fileReplacements += matches.length;
        content = content.replace(regex, to);
      }
    }
    
    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ ${file}: ${fileReplacements} URLs fixed`);
      totalReplacements += fileReplacements;
    } else {
      console.log(`  ⏭️  ${file}: Already fixed`);
    }
  }

  return totalReplacements;
};

// Remove build-time <lastmod> values. They were derived from the build date, not
// from a real page-specific content change, so Google ignores (or distrusts) them.
const stripSitemapLastmod = (files: string[], isDistFolder = false) => {
  let updated = 0;

  const allFiles = [...files, 'public/sitemap.xml', 'public/sitemap_static.xml'];

  for (const file of allFiles) {
    const filePath = path.resolve(isDistFolder ? file.replace('public/', 'dist/') : file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/[ \t]*<lastmod>[^<]*<\/lastmod>\r?\n?/g, '');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      updated++;
    }
  }

  if (updated > 0) console.log(`🧹 Removed build-date <lastmod> from ${updated} sitemap files`);
};


const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const upsertHeadTag = (html: string, regex: RegExp, replacement: string) => {
  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }

  return html.replace('</head>', `  ${replacement}\n</head>`);
};

const buildPrerenderBody = ({
  title,
  heading,
  description,
  bullets,
}: {
  title: string;
  heading: string;
  description: string;
  bullets: string[];
}) => `
  <main style="min-height:100vh;background:#13182B;color:#F8FAFC;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px 16px;">
    <section style="max-width:960px;margin:0 auto;background:rgba(19,24,43,.92);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:32px;box-shadow:0 30px 80px rgba(0,0,0,.28);">
      <p style="display:inline-block;margin:0 0 12px;padding:6px 12px;border-radius:999px;background:rgba(255,184,0,.14);color:#FFD166;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Midasbuy</p>
      <h1 style="margin:0 0 16px;font-size:clamp(28px,4vw,44px);line-height:1.1;">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 24px;font-size:18px;line-height:1.7;color:rgba(248,250,252,.82);">${escapeHtml(description)}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:0 0 24px;">
        ${bullets.map((bullet) => `<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px;font-size:15px;line-height:1.6;color:rgba(248,250,252,.88);">${escapeHtml(bullet)}</div>`).join('')}
      </div>
      <p style="margin:0;font-size:14px;line-height:1.7;color:rgba(248,250,252,.62);">${escapeHtml(title)}</p>
    </section>
  </main>`;

// Rich, per-URL unique body for country/game pages. Every page gets its own H1,
// its own H2 set, local facts, FAQs and internal links so Google has both unique
// content and a crawl path into the long tail.
const buildRichCountryBody = (content: PrerenderContent, canonicalUrl: string) => `
  <main style="min-height:100vh;background:#13182B;color:#F8FAFC;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px 16px;">
    <article style="max-width:960px;margin:0 auto;">
      <h1 style="margin:0 0 16px;font-size:clamp(26px,4vw,42px);line-height:1.15;">${escapeHtml(content.h1)}</h1>
      <p style="margin:0 0 28px;font-size:17px;line-height:1.75;color:rgba(248,250,252,.85);">${escapeHtml(content.intro)}</p>
      ${content.sections
        .map(
          (section) => `<section style="margin:0 0 28px;">
        <h2 style="margin:0 0 12px;font-size:clamp(19px,2.6vw,26px);line-height:1.25;">${escapeHtml(section.h2)}</h2>
        ${section.paragraphs.map((p) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.75;color:rgba(248,250,252,.8);">${escapeHtml(p)}</p>`).join('')}
        ${section.bullets && section.bullets.length ? `<ul style="margin:0;padding-left:20px;">${section.bullets.map((b) => `<li style="margin:0 0 6px;font-size:15px;line-height:1.65;color:rgba(248,250,252,.78);">${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
      </section>`,
        )
        .join('')}
      <section style="margin:0 0 28px;">
        <h2 style="margin:0 0 12px;font-size:clamp(19px,2.6vw,26px);">Frequently Asked Questions</h2>
        ${content.faqs
          .map(
            (faq) => `<div style="margin:0 0 14px;">
          <h3 style="margin:0 0 6px;font-size:16px;line-height:1.4;">${escapeHtml(faq.q)}</h3>
          <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(248,250,252,.78);">${escapeHtml(faq.a)}</p>
        </div>`,
          )
          .join('')}
      </section>
      <nav style="margin:0 0 20px;">
        <h2 style="margin:0 0 12px;font-size:clamp(19px,2.6vw,26px);">Related Midasbuy Pages</h2>
        <ul style="margin:0;padding-left:20px;">
          ${content.relatedLinks.map((link) => `<li style="margin:0 0 6px;font-size:15px;"><a href="${escapeHtml(link.href)}" style="color:#7DD3FC;">${escapeHtml(link.label)}</a></li>`).join('')}
        </ul>
      </nav>
      <p style="margin:0;font-size:13px;line-height:1.7;color:rgba(248,250,252,.5);">${escapeHtml(content.keywordLine)}</p>
      <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    </article>
  </main>`;

const faqJsonLd = (content: PrerenderContent) =>
  `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  })}</script>`;


const createPrerenderedHtml = ({
  template,
  lang,
  title,
  description,
  canonicalUrl,
  body,
  extraHead = '',
}: {
  template: string;
  lang: string;
  title: string;
  description: string;
  canonicalUrl: string;
  body: string;
  extraHead?: string;
}) => {
  let html = template;

  html = html.replace(/<html\s+lang="[^"]*">/i, `<html lang="${escapeHtml(lang)}">`);
  html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(title)}</title>`);
  html = upsertHeadTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}">`);
  html = upsertHeadTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}">`);
  html = upsertHeadTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}">`);
  html = upsertHeadTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}">`);
  html = upsertHeadTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}">`);
  html = upsertHeadTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`);
  html = upsertHeadTag(html, /<link\s+[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`);
  if (extraHead) html = html.replace('</head>', `  ${extraHead}\n</head>`);
  html = html.replace(/<div id="root"[^>]*><\/div>/i, `<div id="root">${body}</div>`);

  return html;
};


const countryPrerenderPlugin = (): Plugin => ({
  name: 'country-prerender',
  apply: 'build',
  closeBundle() {
    const distIndexPath = path.resolve('dist/index.html');
    if (!fs.existsSync(distIndexPath)) return;

    const template = fs.readFileSync(distIndexPath, 'utf8');
    const baseUrl = 'https://www.midasbuy.com.pk';
    const countryEntries = Object.entries(COUNTRY_DATA);
    const allCodes = countryEntries.map(([code]) => code);

    for (const [code, country] of countryEntries) {
      const lowerCode = code.toLowerCase();

      // Only the PUBG Mobile store is prerendered; the country root redirects to it.
      const gameRoutes: Array<{ slug: Exclude<GameSlug, 'home'>; seoSlug: string | null }> = [
        { slug: 'pubgm', seoSlug: 'pubgm' },
      ];

      for (const game of gameRoutes) {
        const gameContent = buildCountryPageContent(code, country, game.slug, allCodes);
        const gamePath = `/midasbuy/${lowerCode}/buy/${game.slug}`;
        const gameTitle = `${gameContent.h1} | Midasbuy`.slice(0, 65);
        const gameDescription = gameContent.intro.slice(0, 158);
        const gameBody = buildRichCountryBody(gameContent, `${baseUrl}${gamePath}`);

        const gameHtml = createPrerenderedHtml({
          template,
          lang: country.language || 'en',
          title: gameTitle,
          description: gameDescription,
          canonicalUrl: `${baseUrl}${gamePath}`,
          body: gameBody,
          extraHead: faqJsonLd(gameContent),
        });

        const gameDir = path.resolve(`dist/midasbuy/${lowerCode}/buy/${game.slug}`);
        fs.mkdirSync(gameDir, { recursive: true });
        fs.writeFileSync(path.join(gameDir, 'index.html'), gameHtml, 'utf8');
        // Flat .html so /midasbuy/{cc}/buy/{game} is served directly without SPA fallback
        fs.mkdirSync(path.resolve(`dist/midasbuy/${lowerCode}/buy`), { recursive: true });
        fs.writeFileSync(path.resolve(`dist/midasbuy/${lowerCode}/buy/${game.slug}.html`), gameHtml, 'utf8');
      }

      // Section sub-routes (WOW / Redeem / Shop / Events) get their own indexable page
      const countryName = country.countryName || code;
      const currency = country.currency || '';
      const sections: Array<{ slug: string; title: string; description: string; heading: string; bullets: string[] }> = [
        {
          slug: 'wow',
          title: `PUBG Mobile WOW UC Vouchers ${countryName} | Midasbuy`,
          description: `Buy PUBG Mobile WOW UC vouchers in ${countryName} at discounted ${currency} prices with instant delivery and secure payment.`,
          heading: `PUBG Mobile WOW UC Vouchers in ${countryName}`,
          bullets: [
            `WOW UC vouchers for PUBG Mobile players in ${countryName}`,
            `Exclusive WOW bonus UC on every voucher pack`,
            `Pay in ${currency} with cards and local payment channels`,
            `Instant delivery to your PUBG Mobile player ID`,
          ],
        },
        {
          slug: 'redeem',
          title: `Redeem PUBG Mobile UC Code ${countryName} | Midasbuy`,
          description: `Redeem your PUBG Mobile UC voucher code in ${countryName}. Enter the redemption code and get UC credited to your player ID instantly.`,
          heading: `Redeem PUBG Mobile UC Codes in ${countryName}`,
          bullets: [
            `Redeem official PUBG Mobile UC voucher codes`,
            `Codes are credited directly to your player ID`,
            `Free to use for every player in ${countryName}`,
            `24/7 support if a redemption code fails`,
          ],
        },
        {
          slug: 'shop',
          title: `PUBG Mobile Shop ${countryName} - Crates & Bundles | Midasbuy`,
          description: `Shop PUBG Mobile items, crates, popularity and bundles in ${countryName} at official Midasbuy prices in ${currency}.`,
          heading: `PUBG Mobile Shop in ${countryName}`,
          bullets: [
            `Royal Pass, crates, popularity and bundles`,
            `Official Midasbuy prices in ${currency}`,
            `Instant delivery after payment`,
            `Secure checkout with local payment methods`,
          ],
        },
        {
          slug: 'events',
          title: `PUBG Mobile Events & UC Offers ${countryName} | Midasbuy`,
          description: `Latest PUBG Mobile events, promotions and limited-time UC offers in ${countryName}. Claim bonus rewards before they expire.`,
          heading: `PUBG Mobile Events & Offers in ${countryName}`,
          bullets: [
            `Limited-time UC discounts and bonus events`,
            `Seasonal PUBG Mobile promotions for ${countryName}`,
            `Extra rewards on selected UC packs`,
            `Updated regularly - check back often`,
          ],
        },
      ];

      for (const section of sections) {
        const sectionPath = `/midasbuy/${lowerCode}/buy/pubgm/${section.slug}`;
        const sectionBody = buildPrerenderBody({
          title: section.title,
          heading: section.heading,
          description: section.description,
          bullets: [...section.bullets, `Main UC store: ${baseUrl}/midasbuy/${lowerCode}/buy/pubgm`],
        });
        const sectionHtml = createPrerenderedHtml({
          template,
          lang: country.language || 'en',
          title: section.title,
          description: section.description,
          canonicalUrl: `${baseUrl}${sectionPath}`,
          body: sectionBody,
        });
        const sectionDir = path.resolve(`dist/midasbuy/${lowerCode}/buy/pubgm/${section.slug}`);
        fs.mkdirSync(sectionDir, { recursive: true });
        fs.writeFileSync(path.join(sectionDir, 'index.html'), sectionHtml, 'utf8');
        fs.writeFileSync(path.resolve(`dist/midasbuy/${lowerCode}/buy/pubgm/${section.slug}.html`), sectionHtml, 'utf8');
      }
    }



    // Prerender static info pages with unique titles/descriptions
    const staticPages: Array<{ path: string; title: string; description: string; heading: string }> = [
      { path: '/about-midasbuy', title: 'About Midasbuy - Official Gaming Top-Up Store | Midasbuy', description: 'Learn about Midasbuy, the official global gaming top-up store for PUBG Mobile UC, Free Fire Diamonds and more.', heading: 'About Midasbuy' },
      { path: '/cookie-policy', title: 'Cookie Policy | Midasbuy', description: 'Read the Midasbuy cookie policy to understand how we use cookies on our gaming top-up store.', heading: 'Cookie Policy' },
      { path: '/customer-reviews', title: 'Customer Reviews | Midasbuy', description: 'Read genuine customer reviews and ratings for Midasbuy gaming top-up services worldwide.', heading: 'Customer Reviews' },
      { path: '/help-center', title: 'Help Center - Support & FAQs | Midasbuy', description: 'Get help with PUBG UC top-ups, Free Fire diamonds, payments and order issues at the Midasbuy Help Center.', heading: 'Help Center' },
      { path: '/privacy-policy', title: 'Privacy Policy | Midasbuy', description: 'Read the Midasbuy privacy policy to understand how we protect your personal data.', heading: 'Privacy Policy' },
      { path: '/security', title: 'Security - Safe Gaming Top-Ups | Midasbuy', description: 'Learn how Midasbuy keeps your payments and personal data secure during gaming top-ups.', heading: 'Security at Midasbuy' },
      { path: '/pubg-accounts', title: 'PUBG Mobile Accounts for Sale | Midasbuy', description: 'Browse verified PUBG Mobile accounts available on Midasbuy with secure delivery.', heading: 'PUBG Mobile Accounts' },
    ];

    for (const page of staticPages) {
      const body = buildPrerenderBody({
        title: page.title,
        heading: page.heading,
        description: page.description,
        bullets: [`Canonical URL: ${baseUrl}${page.path}`, `Trusted by millions of gamers worldwide`, `Secure payments and instant delivery`],
      });
      const html = createPrerenderedHtml({
        template,
        lang: 'en',
        title: page.title,
        description: page.description,
        canonicalUrl: `${baseUrl}${page.path}`,
        body,
      });
      const dir = path.resolve(`dist${page.path}`);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
      // Flat .html so static pages serve without SPA fallback on Lovable hosting
      fs.writeFileSync(path.resolve(`dist${page.path}.html`), html, 'utf8');
    }

    // ---- Country hub page: the crawl path Google was missing ----
    const gameList: Array<{ slug: string; label: string }> = [
      { slug: 'pubgm', label: 'PUBG Mobile UC' },
    ];

    const hubRows = countryEntries
      .map(([code, country]) => {
        const cc = code.toLowerCase();
        const links = gameList
          .map((g) => `<a href="/midasbuy/${cc}/buy/${g.slug}" style="color:#7DD3FC;margin-right:10px;font-size:13px;">${escapeHtml(g.label)}</a>`)
          .join('');
        return `<li style="margin:0 0 10px;font-size:15px;"><a href="/midasbuy/${cc}/buy/pubgm" style="color:#FFD166;font-weight:600;">Midasbuy ${escapeHtml(country.name)}</a><br>${links}</li>`;
      })
      .join('');

    const hubTitle = 'All Countries — Midasbuy Game Top-Up Store Directory';
    const hubDescription = `Browse Midasbuy top-up stores for ${countryEntries.length} countries: PUBG Mobile UC, Free Fire Diamonds, Roblox Robux, Valorant Points and PUBG car skins in local currency.`;
    const hubBody = `
  <main style="min-height:100vh;background:#13182B;color:#F8FAFC;font-family:system-ui,-apple-system,sans-serif;padding:32px 16px;">
    <article style="max-width:1100px;margin:0 auto;">
      <h1 style="margin:0 0 16px;font-size:clamp(26px,4vw,42px);">Midasbuy Country Directory</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.75;color:rgba(248,250,252,.85);">${escapeHtml(hubDescription)}</p>
      <ul style="margin:0;padding-left:20px;columns:2;column-gap:32px;">${hubRows}</ul>
    </article>
  </main>`;
    const hubHtml = createPrerenderedHtml({
      template,
      lang: 'en',
      title: hubTitle,
      description: hubDescription,
      canonicalUrl: `${baseUrl}/countries`,
      body: hubBody,
    });
    fs.mkdirSync(path.resolve('dist/countries'), { recursive: true });
    fs.writeFileSync(path.resolve('dist/countries/index.html'), hubHtml, 'utf8');
    fs.writeFileSync(path.resolve('dist/countries.html'), hubHtml, 'utf8');

    // ---- Static crawlable footer on the homepage shell (outside #root so React never removes it) ----
    const topMarkets = countryEntries.slice(0, 40);
    const srOnly = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    const footerNav = `<footer id="seo-country-nav" aria-hidden="true" style="${srOnly}">
      <h2>Midasbuy Stores by Country</h2>
      <p>${topMarkets.map(([code, c]) => `<a href="/midasbuy/${code.toLowerCase()}/buy/pubgm">${escapeHtml(c.name)}</a>`).join(' ')}</p>
      <p><a href="/countries">View all ${countryEntries.length} country stores</a></p>
    </footer>`;
    const homeShell = fs.readFileSync(distIndexPath, 'utf8');
    if (!homeShell.includes('id="seo-country-nav"')) {
      fs.writeFileSync(distIndexPath, homeShell.replace('</body>', `${footerNav}\n</body>`), 'utf8');
    }

    console.log(`🕷️ Generated prerendered HTML for ${countryEntries.length} countries × PUBG route + ${staticPages.length} static pages + BGMI + /countries hub`);
  }
});


// Fix source files immediately when config is loaded (during dev start)
console.log('🔧 Fixing sitemap x-default URLs in source files...');
fixSitemapFiles(SITEMAP_FILES);
stripSitemapLastmod(SITEMAP_FILES);

// Plugin to fix sitemap x-default URLs and dates at build time
const sitemapFixPlugin = (): Plugin => ({
  name: 'sitemap-fix',
  apply: 'build',
  closeBundle() {
    console.log('🔧 Fixing sitemap x-default URLs in dist folder...');
    
    // Fix dist folder files
    const distFiles = SITEMAP_FILES.map(f => f.replace('public/', 'dist/'));
    const distReplacements = fixSitemapFiles(distFiles.map(f => f.replace('dist/', 'public/')), true);
    
    // Drop build-date lastmod in dist
    stripSitemapLastmod(SITEMAP_FILES, true);
    
    console.log(`🎉 Sitemap fix complete: ${distReplacements} x-default URLs updated in dist`);
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    asyncCssPlugin(),
    sitemapFixPlugin(),
    countryPrerenderPlugin(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: false,
        includeAssets: ['favicon.png', 'pwa-icon-192.png', 'pwa-icon-512.png'],
        manifest: {
          name: 'Midasbuy - Official Gaming Store',
          short_name: 'Midasbuy',
          description: 'Official Midasbuy - Buy PUBG Mobile UC, Free Fire Diamonds & more with instant delivery',
          theme_color: '#050505',
          background_color: '#050505',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/pwa-icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        injectionPoint: undefined
      }
    })
  ].filter(Boolean),
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime.js"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
