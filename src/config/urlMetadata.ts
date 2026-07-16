/**
 * URL METADATA CONFIGURATION
 *
 * Ye file website ke saare pages ke meta titles, descriptions aur keywords ko manage karti hai.
 * Yahan se easily edit kar sakte hain aur changes automatically live reflect honge.
 *
 * Structure:
 * - url: Page ka path
 * - title: Meta title for SEO
 * - description: Meta description for SEO
 * - keywords: Target keywords array
 */

export interface UrlMetadata {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  priority?: number;
}

// ==================== MAIN PAGES ====================

export const MAIN_PAGES_METADATA: UrlMetadata[] = [
  {
    url: "/",
    title: "Midasbuy Official - #1 PUBG Mobile UC Store | Buy PUBG UC Cheapest Price Worldwide",
    description:
      "⚡ Midasbuy - World's Most Trusted Gaming Store! 🏆 Buy PUBG Mobile UC & Free Fire Diamonds with 60% Discount + Extra 30% VIP Bonus. ✅ Instant 2-Min Delivery | 🔒 100% Safe & Secure | 💰 Lowest Prices Guaranteed | Trusted by 10M+ Gamers Worldwide. Official Midasbuy Store - Your #1 Choice for Gaming Currency!",
    keywords: ["midasbuy", "midasbuy official", "midasbuy store", "midasbuy gaming", "midasbuy pubg", "buy PUBG UC", "PUBG UC midasbuy", "midasbuy PUBG mobile UC", "buy free fire diamonds", "gaming store", "BGMI UC", "midasbuy review", "is midasbuy safe", "midasbuy legit", "official midasbuy website", "midasbuy india", "midasbuy pakistan", "midasbuy cheap UC", "midasbuy instant delivery"],
    priority: 1.0,
  },
  {
    url: "/pubg-mobile",
    title: "Midasbuy PUBG Mobile UC - Buy Cheapest UC Worldwide | Official Unknown Cash Store",
    description:
      "💎 Midasbuy Official PUBG Mobile UC Store! ⚡ Buy Cheapest UC Starting ₹83 | 60% Discount + 30% VIP Bonus | Instant 2-Min Delivery | Royal Pass, Elite Skins & Exclusive Crates. 🔒 100% Safe & Secure | Trusted by 10M+ Players | UPI/PayPal/Cards Accepted. #1 Midasbuy PUBG UC - Get Your Unknown Cash Now!",
    keywords: ["midasbuy pubg mobile uc", "midasbuy PUBG UC", "buy PUBG UC midasbuy", "PUBG Mobile UC midasbuy official", "midasbuy unknown cash", "PUBG UC midasbuy cheap", "midasbuy PUBG store", "buy midasbuy UC", "PUBG Mobile midasbuy", "midasbuy UC India", "midasbuy UC Pakistan", "official midasbuy PUBG", "midasbuy PUBG mobile unknown cash", "cheapest UC midasbuy", "midasbuy instant UC delivery"],
    priority: 1.0,
  },
  {
    url: "/bgmi",
    title: "Midasbuy BGMI UC Official - Buy Battlegrounds Mobile India UC Cheapest Price",
    description:
      "🇮🇳 Midasbuy BGMI Official UC Store! ⚡ Buy Cheapest BGMI Unknown Cash Starting ₹83 | India's #1 BGMI Recharge Platform | 60% Off + VIP 30% Extra | Elite Pass, Gun Skins & Seasonal Rewards. 🔒 Lightning Fast 2-Min Delivery | UPI/PhonePe/Paytm/GPay | 24/7 Support. Official Midasbuy BGMI - Trusted by Million Indians!",
    keywords: ["midasbuy BGMI", "midasbuy BGMI UC", "buy BGMI UC midasbuy", "BGMI midasbuy official", "midasbuy battlegrounds mobile india", "BGMI UC midasbuy India", "midasbuy BGMI unknown cash", "midasbuy BGMI store", "cheap BGMI UC midasbuy", "midasbuy BGMI recharge", "official midasbuy BGMI", "midasbuy BGMI elite pass", "midasbuy BGMI instant delivery", "midasbuy BGMI safe", "best BGMI UC store midasbuy"],
    priority: 1.0,
  },
  {
    url: "/free-fire",
    title: "Midasbuy Free Fire Diamonds Official - Buy FF Diamonds Cheapest Price Worldwide",
    description:
      "💎 Midasbuy Official Free Fire Diamond Store! ⚡ Buy Cheapest FF Diamonds | 60% Discount + 30% VIP Bonus | Instant Delivery | Elite Pass, Chrono, DJ Alok & Legendary Skins. 🔒 100% Secure | Trusted by 10M+ FF Players | UPI/PayPal Accepted. Official Midasbuy Free Fire - #1 Diamond Store Worldwide!",
    keywords: ["midasbuy free fire", "midasbuy free fire diamonds", "buy FF diamonds midasbuy", "free fire midasbuy official", "midasbuy FF diamonds cheap", "midasbuy garena free fire", "midasbuy free fire store", "free fire diamonds midasbuy India", "midasbuy FF top up", "official midasbuy free fire", "midasbuy FF elite pass", "midasbuy free fire instant delivery", "cheapest FF diamonds midasbuy", "midasbuy free fire max diamonds", "best free fire diamond store midasbuy"],
    priority: 1.0,
  },
  {
    url: "/roblox",
    title: "Buy Robux | Cheapest Roblox Robux Top Up | Midasbuy Official Store 2025",
    description:
      "⚡ Buy Roblox Robux at CHEAPEST prices! 💎 Get 55% OFF + Bonus Robux. ✅ Instant 2-min delivery | 🔒 100% Secure | Trusted by 5M+ Roblox players. Official Midasbuy Robux Store - #1 Choice!",
    keywords: ["buy robux", "roblox robux", "cheap robux", "robux top up", "robux recharge", "roblox currency", "midasbuy roblox", "robux purchase", "get robux", "robux online", "cheapest robux", "robux discount", "instant robux", "safe robux", "trusted robux store", "robux pakistan", "robux india", "robux usa", "400 robux", "800 robux", "1700 robux", "4500 robux", "10000 robux", "22500 robux", "50000 robux", "roblox premium", "robux deals", "robux offers", "robux bonus", "roblox game currency"],
    priority: 1.0,
  },
  {
    url: "/valorant",
    title: "Buy Valorant Points | Cheapest VP Top Up | Midasbuy Official Store 2025",
    description:
      "⚡ Buy Valorant Points (VP) at CHEAPEST prices! 💎 Get Exclusive Skins, Battle Pass & Agents. ✅ Instant 2-min delivery | 🔒 100% Secure | Trusted by 3M+ Valorant players. Official Midasbuy VP Store!",
    keywords: ["buy valorant points", "valorant points", "cheap vp", "vp top up", "valorant currency", "midasbuy valorant", "valorant recharge", "get vp", "valorant points online", "cheapest valorant points", "valorant skins", "valorant battle pass", "radianite points", "valorant store", "valorant pakistan", "valorant india", "valorant usa", "riot games valorant", "vp discount", "valorant deals"],
    priority: 1.0,
  },
  {
    url: "/customer-reviews",
    title: "Customer Reviews - 80,000+ Verified Reviews | Midasbuy Official",
    description:
      "⭐ Read 80,000+ verified customer reviews! See why gamers trust Midasbuy for PUBG UC, Free Fire Diamonds & BGMI UC. 4.9 star rating | Real customer feedback | 100% Authentic reviews from verified purchases.",
    keywords: ["midasbuy reviews", "customer reviews", "midasbuy feedback", "is midasbuy legit", "midasbuy ratings", "midasbuy testimonials", "pubg uc reviews", "gaming store reviews", "trusted gaming store", "midasbuy customer experience"],
    priority: 0.85,
  },
  {
    url: "/gaming-shop",
    title: "Gaming Shop - Buy Game Credits & Currency | Midasbuy Official Store",
    description:
      "🎮 One-stop gaming marketplace for all your favorite titles! Browse and purchase gaming currency across multiple platforms including PUBG Mobile, Free Fire, BGMI, and Honor of Kings. Compare prices, find exclusive deals, and get instant credits delivered directly to your game account. Your complete gaming shop experience!",
    keywords: ["gaming shop", "game credits", "buy game currency", "midasbuy shop"],
    priority: 0.9,
  },
  {
    url: "/pubg-accounts",
    title: "Buy PUBG Accounts - Premium Accounts with UC & Skins | Midasbuy",
    description:
      "🎯 Exclusive marketplace for premium PUBG Mobile accounts loaded with UC, legendary skins, and rare collectibles! Purchase high-tier accounts featuring Glacier M416, Pharaoh X-Suit, and maxed-out Royal Pass rewards. Verified ownership transfer with complete account recovery details. Start dominating the battleground today!",
    keywords: ["PUBG accounts", "buy PUBG account", "PUBG premium account", "PUBG account with UC"],
    priority: 0.8,
  },
  {
    url: "/honor-of-kings",
    title: "Honor of Kings - Buy Tokens & Currency | Midasbuy Official",
    description:
      "👑 Official Honor of Kings token and voucher store! Purchase HOK currency to unlock premium heroes, legendary skins, and exclusive battle passes. Fast delivery for global and region-specific accounts. Experience the world's most popular MOBA with unlimited in-game purchases. Competitive pricing for all regions!",
    keywords: ["Honor of Kings", "HOK tokens", "buy Honor of Kings currency"],
    priority: 0.8,
  },
  {
    url: "/blogs",
    title: "Gaming Blogs & Tips - PUBG, Free Fire, BGMI Guides | Midasbuy",
    description:
      "📖 Expert gaming blog with professional tips, strategies, and comprehensive guides! Learn winning tactics for PUBG Mobile, master Free Fire ranked matches, and dominate BGMI battles. Updated weekly with tier lists, meta analysis, weapon stats, and pro player strategies. Level up your gaming skills!",
    keywords: ["gaming blogs", "PUBG tips", "Free Fire guides", "BGMI tricks"],
    priority: 0.7,
  },
  {
    url: "/about-midasbuy",
    title: "About Midasbuy - India's #1 Gaming Credits Store | Our Story",
    description:
      "🏆 Discover the story behind India's leading gaming currency platform! Since 2020, we've served 5 million+ gamers with authentic credits, secure transactions, and unmatched customer service. Learn about our vision to revolutionize mobile gaming commerce in India. Built by gamers, trusted by millions!",
    keywords: ["about midasbuy", "midasbuy story", "trusted gaming store"],
    priority: 0.6,
  },
  {
    url: "/contact-us",
    title: "Contact Us - 24/7 Customer Support | Midasbuy Help",
    description:
      "📞 Reach our dedicated support team anytime, anywhere! Get instant help via WhatsApp, email, or phone with average response time under 5 minutes. Whether you need assistance with orders, payments, or account issues, our customer success team is here to help. Available in Hindi and English!",
    keywords: ["contact midasbuy", "customer support", "help"],
    priority: 0.6,
  },
  {
    url: "/help-center",
    title: "Help Center - FAQs & Support | Midasbuy",
    description:
      "❓ Comprehensive knowledge base with answers to all your questions! Find detailed guides on placing orders, payment methods (UPI, Paytm, PhonePe), delivery times, refund policies, and troubleshooting. Self-service solutions available 24/7. Searchable FAQ database with video tutorials and step-by-step instructions.",
    keywords: ["help center", "support", "FAQs", "midasbuy help"],
    priority: 0.6,
  },
  {
    url: "/partners",
    title: "Partners - Join Midasbuy Partnership Program | Gaming Store Partners",
    description:
      "🤝 Lucrative partnership opportunities for gaming entrepreneurs and retailers! Join our affiliate program with competitive commission rates, dedicated account manager, and marketing support. Earn by promoting gaming credits to your audience. Perfect for YouTubers, streamers, gaming cafes, and digital marketers. Apply today!",
    keywords: ["midasbuy partners", "gaming partnership", "business partnership", "gaming store partner"],
    priority: 0.6,
  },
  {
    url: "/careers",
    title: "Careers - Join Midasbuy Team | Gaming Industry Jobs",
    description:
      "💼 Build your career at India's fastest-growing gaming commerce platform! We're hiring passionate gamers for roles in customer support, marketing, tech development, and operations. Competitive salaries, flexible work arrangements, and amazing gaming perks. Join a team that's revolutionizing mobile gaming in India!",
    keywords: ["midasbuy careers", "gaming jobs", "gaming industry careers", "midasbuy jobs"],
    priority: 0.6,
  },
  {
    url: "/faqs",
    title: "Frequently Asked Questions - Midasbuy FAQs",
    description:
      "💬 Quick answers to commonly asked questions about Midasbuy services! Learn about our ordering process, accepted payment methods, delivery timeframes, refund eligibility, and account security. Simplified explanations for first-time buyers. Find solutions to common issues without waiting for support!",
    keywords: ["FAQs", "frequently asked questions", "midasbuy questions"],
    priority: 0.6,
  },
  {
    url: "/security",
    title: "Security & Safety - 100% Safe Transactions | Midasbuy",
    description:
      "🔒 Enterprise-grade security protecting every transaction! Bank-level 256-bit SSL encryption, PCI-DSS compliant payment processing, and secure account verification. Zero tolerance for fraud. All transactions monitored by advanced fraud detection systems. Your gaming purchases are completely safe with Midasbuy!",
    keywords: ["security", "safe transactions", "secure payments"],
    priority: 0.5,
  },
  {
    url: "/terms-of-service",
    title: "Terms of Service - Midasbuy Terms & Conditions",
    description:
      "📋 Official terms and conditions governing Midasbuy platform usage. Detailed policies on user accounts, purchase agreements, prohibited activities, intellectual property rights, limitation of liability, and dispute resolution. Last updated October 2025. Please review before making purchases.",
    keywords: ["terms of service", "terms and conditions"],
    priority: 0.4,
  },
  {
    url: "/refund-policy",
    title: "Refund Policy - Return & Refund Guidelines | Midasbuy",
    description:
      "↩️ Transparent refund policy with clear eligibility criteria! Understand when refunds apply for failed deliveries, incorrect orders, or technical issues. Step-by-step refund request process with typical processing time of 3-5 business days. Digital goods policy explained in simple terms. Customer satisfaction guaranteed!",
    keywords: ["refund policy", "return policy", "refunds"],
    priority: 0.4,
  },
  {
    url: "/track-orders",
    title: "Track Orders - Order Status & Refund Tracking | Midasbuy Official",
    description:
      "📦 Track your gaming orders in real-time! View PUBG UC, Free Fire Diamonds & BGMI order status. Search orders by Transaction ID. Monitor pending refunds, completed orders, and purchase history. 24/7 live order tracking with instant status updates. Secure order management for all your gaming purchases!",
    keywords: ["track order", "order status", "refund tracking", "midasbuy orders", "PUBG UC order status", "transaction ID search", "gaming order history", "order tracking", "purchase history", "refund status"],
    priority: 0.7,
  },
];

// ==================== PUBG UC PURCHASE PAGES ====================

export const PUBG_PURCHASE_PAGES_METADATA: UrlMetadata[] = [
  {
    url: "/purchase/3697uc",
    title: "Buy 3697 UC PUBG Mobile - ₹2000 | Instant Delivery | Midasbuy",
    description:
      "⚡ Purchase 3697 UC PUBG Mobile at ₹2000! Perfect starter pack for Royal Pass Elite upgrade. Instant 2-minute delivery with secure payments. Popular choice for casual players!",
    keywords: ["3697 UC", "buy 3697 UC PUBG", "PUBG 3697 UC price"],
    priority: 0.8,
  },
  {
    url: "/purchase/7394uc",
    title: "Buy 7394 UC PUBG Mobile - ₹4000 | Instant Delivery | Midasbuy",
    description:
      "💎 Get 7394 UC at ₹4000 - Best value for Elite Pass Plus! Upgrade to Elite Plus tier and unlock exclusive emotes. Fast UPI payment with instant credit.",
    keywords: ["7394 UC", "buy 7394 UC PUBG", "PUBG 7394 UC price"],
    priority: 0.8,
  },
  {
    url: "/purchase/11091uc",
    title: "Buy 11091 UC PUBG Mobile - ₹6000 | Instant Delivery | Midasbuy",
    description:
      "🎯 11091 UC for ₹6000 - Popular choice for serious gamers! Enough for Elite Pass Plus + premium crate openings. Unlock mythic outfits instantly!",
    keywords: ["11091 UC", "buy 11091 UC PUBG", "PUBG 11091 UC price"],
    priority: 0.8,
  },
  {
    url: "/purchase/14788uc",
    title: "Buy 14788 UC PUBG Mobile - ₹8000 | Instant Delivery | Midasbuy",
    description:
      "🏆 Premium 14788 UC at ₹8000! Sufficient for multiple Elite Plus upgrades and mythic lucky draws. Access gun lab weapon skins. Better bulk value!",
    keywords: ["14788 UC", "buy 14788 UC PUBG", "PUBG 14788 UC price"],
    priority: 0.8,
  },
  {
    url: "/purchase/18495uc",
    title: "Buy 18495 UC PUBG Mobile - ₹10000 | Instant Delivery | Midasbuy",
    description:
      "⭐ 18495 UC Mega Pack for ₹10000! Ideal for legendary sets and exclusive collaborations. Perfect for clan leaders. Maximum value with secure delivery!",
    keywords: ["18495 UC", "buy 18495 UC PUBG", "PUBG 18495 UC price"],
    priority: 0.8,
  },
  {
    url: "/purchase/22182uc",
    title: "Buy 22182 UC PUBG Mobile - ₹12000 | Instant Delivery | Midasbuy",
    description:
      "🎮 22182 UC at ₹12000 - Pro player standard! Access all seasonal content including X-Suit collections. Best for streamers and competitive players!",
    keywords: ["22182 UC", "buy 22182 UC PUBG", "PUBG 22182 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/25879uc",
    title: "Buy 25879 UC PUBG Mobile - ₹14000 | Instant Delivery | Midasbuy",
    description:
      "💰 25879 UC for ₹14000 - Heavy investor tier! Complete outfit and gun skin collections from limited events. Perfect for content creators!",
    keywords: ["25879 UC", "buy 25879 UC PUBG", "PUBG 25879 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/29576uc",
    title: "Buy 29576 UC PUBG Mobile - ₹16000 | Instant Delivery | Midasbuy",
    description:
      "🔥 29576 UC Elite Pack at ₹16000! Premium for dedicated collectors. Access every seasonal exclusive including mythic lucky draws. Year-long Elite Plus!",
    keywords: ["29576 UC", "buy 29576 UC PUBG", "PUBG 29576 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/33273uc",
    title: "Buy 33273 UC PUBG Mobile - ₹18000 | Instant Delivery | Midasbuy",
    description:
      "👑 33273 UC Master Pack for ₹18000! Complete every limited draw and collaboration event. YouTubers and streamers premium choice. Bank-secure!",
    keywords: ["33273 UC", "buy 33273 UC PUBG", "PUBG 33273 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/36970uc",
    title: "Buy 36970 UC PUBG Mobile - ₹20000 | Instant Delivery | Midasbuy",
    description:
      "🌟 36970 UC Ultimate Bundle at ₹20000! Flagship package for serious collectors. Annual Elite Plus + special events. Popular for gaming cafes!",
    keywords: ["36970 UC", "buy 36970 UC PUBG", "PUBG 36970 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/40667uc",
    title: "Buy 40667 UC PUBG Mobile - ₹22000 | Instant Delivery | Midasbuy",
    description:
      "💎 40667 UC Premium Bulk for ₹22000! Unlimited access to all cosmetics including X-Suit upgrades. Maximum bulk discount value!",
    keywords: ["40667 UC", "buy 40667 UC PUBG", "PUBG 40667 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/44364uc",
    title: "Buy 44364 UC PUBG Mobile - ₹24000 | Instant Delivery | Midasbuy",
    description:
      "⚡ 44364 UC Mega Bundle at ₹24000! Comprehensive package for multiple accounts. Perfect for esports organizations and content creators!",
    keywords: ["44364 UC", "buy 44364 UC PUBG", "PUBG 44364 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/48061uc",
    title: "Buy 48061 UC PUBG Mobile - ₹26000 | Instant Delivery | Midasbuy",
    description:
      "🎯 48061 UC VIP Pack for ₹26000! Complete every mythic draw and collaboration event. Max out gun lab weapons. Premium streamer choice!",
    keywords: ["48061 UC", "buy 48061 UC PUBG", "PUBG 48061 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/51758uc",
    title: "Buy 51758 UC PUBG Mobile - ₹28000 | Instant Delivery | Midasbuy",
    description:
      "👑 51758 UC Royal Package at ₹28000! Royalty-level investment for complete collections. Access beta exclusives. Ideal for pro esports players!",
    keywords: ["51758 UC", "buy 51758 UC PUBG", "PUBG 51758 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/55455uc",
    title: "Buy 55455 UC PUBG Mobile - ₹30000 | Instant Delivery | Midasbuy",
    description:
      "🏆 55455 UC Champion Pack for ₹30000! Never worry about UC again. Perfect for gaming cafe chains and esports team bulk purchases!",
    keywords: ["55455 UC", "buy 55455 UC PUBG", "PUBG 55455 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/59152uc",
    title: "Buy 59152 UC PUBG Mobile - ₹32000 | Instant Delivery | Midasbuy",
    description:
      "⭐ 59152 UC Platinum Package at ₹32000! Premium bulk for serious PUBG investors. Preferred by YouTube channels for giveaways!",
    keywords: ["59152 UC", "buy 59152 UC PUBG", "PUBG 59152 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/62849uc",
    title: "Buy 62849 UC PUBG Mobile - ₹34000 | Instant Delivery | Midasbuy",
    description:
      "💰 62849 UC Diamond Tier at ₹34000! Complete ownership of every cosmetic. Perfect for gaming organizations managing pro accounts!",
    keywords: ["62849 UC", "buy 62849 UC PUBG", "PUBG 62849 UC price"],
    priority: 0.7,
  },
  {
    url: "/purchase/66946uc",
    title: "Buy 66946 UC PUBG Mobile - ₹36000 | Instant Delivery | Midasbuy",
    description:
      "🌟 66946 UC Ultimate Prestige at ₹36000! Maximum bundle for ultimate collectors. Exclusive tier for esports teams and top influencers!",
    keywords: ["66946 UC", "buy 66946 UC PUBG", "PUBG 66946 UC price"],
    priority: 0.7,
  },
];

// ==================== INTERNATIONAL PAGES ====================

export const INTERNATIONAL_PAGES_METADATA: UrlMetadata[] = [
  {
    url: "/midasbuy/pk/buy/pubgm",
    title: "Buy PUBG Mobile UC Pakistan - Best Prices PKR | Midasbuy PK",
    description:
      "🇵🇰 Pakistan's Premier PUBG UC Store! JazzCash, Easypaisa supported. Instant delivery with Urdu support. Cheapest UC rates in PKR!",
    keywords: ["PUBG UC Pakistan", "buy PUBG UC PKR", "PUBG Mobile Pakistan", "Midasbuy PK", "midasbuy pakistan", "pubg uc pakistan price"],
    priority: 0.95,
  },
  {
    url: "/midasbuy/in/buy/pubgm",
    title: "Buy PUBG Mobile UC India - Cheapest Prices INR | Midasbuy India",
    description:
      "🇮🇳 Bharat's Most Trusted PUBG Recharge! UPI, Paytm, PhonePe, GPay accepted. Starting ₹83. Serving 3M+ Indian players with Hindi/English support!",
    keywords: ["PUBG UC India", "buy PUBG UC INR", "PUBG Mobile India", "Midasbuy India", "midasbuy india", "pubg uc india price"],
    priority: 0.95,
  },
  {
    url: "/midasbuy/us/buy/pubgm",
    title: "Buy PUBG Mobile UC USA - Best Prices USD | Midasbuy US",
    description:
      "🇺🇸 Official PUBG UC Store for American Gamers! PayPal, credit cards accepted. Fast delivery across all US regions. Premium US timezone support!",
    keywords: ["PUBG UC USA", "buy PUBG UC USD", "PUBG Mobile USA", "Midasbuy US", "midasbuy usa", "pubg uc usa price"],
    priority: 0.9,
  },
  {
    url: "/midasbuy/bd/buy/pubgm",
    title: "Buy PUBG Mobile UC Bangladesh - Best Prices BDT | Midasbuy BD",
    description:
      "🇧🇩 Bangladesh's Most Trusted PUBG UC Store! bKash, Nagad supported. Instant delivery. Cheapest UC rates in BDT!",
    keywords: ["PUBG UC Bangladesh", "buy PUBG UC BDT", "PUBG Mobile Bangladesh", "Midasbuy BD", "midasbuy bangladesh"],
    priority: 0.9,
  },
  {
    url: "/midasbuy/ae/buy/pubgm",
    title: "Buy PUBG Mobile UC UAE - Best Prices AED | Midasbuy UAE",
    description:
      "🇦🇪 UAE's Premier PUBG UC Store! Apple Pay, cards supported. Instant delivery. Best UC rates in AED!",
    keywords: ["PUBG UC UAE", "buy PUBG UC AED", "PUBG Mobile UAE", "Midasbuy UAE", "midasbuy dubai"],
    priority: 0.9,
  },
  {
    url: "/midasbuy/sa/buy/pubgm",
    title: "Buy PUBG Mobile UC Saudi Arabia - Best Prices SAR | Midasbuy KSA",
    description:
      "🇸🇦 Saudi Arabia's Trusted PUBG UC Store! STC Pay, mada cards supported. Instant delivery. Best UC rates in SAR!",
    keywords: ["PUBG UC Saudi Arabia", "buy PUBG UC SAR", "PUBG Mobile Saudi", "Midasbuy KSA", "midasbuy saudi"],
    priority: 0.9,
  },
  {
    url: "/midasbuy/tr/buy/pubgm",
    title: "Buy PUBG Mobile UC Turkey - Best Prices TRY | Midasbuy TR",
    description:
      "🇹🇷 Turkey's Best PUBG UC Store! All local payment methods supported. Instant delivery. Cheapest UC rates in TRY!",
    keywords: ["PUBG UC Turkey", "buy PUBG UC TRY", "PUBG Mobile Turkey", "Midasbuy Turkey", "midasbuy türkiye"],
    priority: 0.9,
  },
  {
    url: "/midasbuy/pk/buy/freefire",
    title: "Buy Free Fire Diamonds Pakistan - Best Prices PKR | Midasbuy PK",
    description:
      "🇵🇰 Pakistan's Premier Free Fire Diamond Store! JazzCash, Easypaisa supported. Instant delivery. Cheapest diamond rates in PKR!",
    keywords: ["Free Fire Diamonds Pakistan", "buy FF diamonds PKR", "Free Fire Pakistan", "Midasbuy PK free fire"],
    priority: 0.9,
  },
  {
    url: "/midasbuy/in/buy/freefire",
    title: "Buy Free Fire Diamonds India - Best Prices INR | Midasbuy India",
    description:
      "🇮🇳 India's Most Trusted Free Fire Store! UPI, Paytm, PhonePe accepted. Instant delivery. Cheapest diamond rates in INR!",
    keywords: ["Free Fire Diamonds India", "buy FF diamonds INR", "Free Fire India", "Midasbuy India free fire"],
    priority: 0.9,
  },
  {
    url: "/midasbuy/bd/buy/freefire",
    title: "Buy Free Fire Diamonds Bangladesh - Best Prices BDT | Midasbuy BD",
    description:
      "🇧🇩 Bangladesh's Trusted Free Fire Diamond Store! bKash, Nagad supported. Instant delivery. Best rates in BDT!",
    keywords: ["Free Fire Diamonds Bangladesh", "buy FF diamonds BDT", "Free Fire Bangladesh", "Midasbuy BD free fire"],
    priority: 0.9,
  },
];

// ==================== ALL URLS COMBINED ====================

export const ALL_URL_METADATA: UrlMetadata[] = [
  ...MAIN_PAGES_METADATA,
  ...PUBG_PURCHASE_PAGES_METADATA,
  ...INTERNATIONAL_PAGES_METADATA,
];

// ==================== HELPER FUNCTIONS ====================

/**
 * URL se metadata fetch karne ke liye helper function
 * @param url - Page URL (e.g., '/bgmi' or 'bgmi')
 * @returns UrlMetadata object ya undefined
 */
export const getMetadataByUrl = (url: string): UrlMetadata | undefined => {
  // Normalize URL (remove leading/trailing slashes for comparison)
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  return ALL_URL_METADATA.find((meta) => meta.url === normalizedUrl);
};

/**
 * Keyword se metadata search karne ke liye
 * @param keyword - Search keyword
 * @returns Array of matching UrlMetadata
 */
export const searchMetadataByKeyword = (keyword: string): UrlMetadata[] => {
  const lowerKeyword = keyword.toLowerCase();
  return ALL_URL_METADATA.filter(
    (meta) =>
      meta.title.toLowerCase().includes(lowerKeyword) ||
      meta.description.toLowerCase().includes(lowerKeyword) ||
      meta.keywords.some((k) => k.toLowerCase().includes(lowerKeyword)),
  );
};

/**
 * Priority ke basis par sorted URLs
 * @returns Sorted array of UrlMetadata by priority (highest first)
 */
export const getUrlsByPriority = (): UrlMetadata[] => {
  return [...ALL_URL_METADATA].sort((a, b) => (b.priority || 0) - (a.priority || 0));
};

/**
 * Get all URLs list (for sitemap generation)
 */
export const getAllUrls = (): string[] => {
  return ALL_URL_METADATA.map((meta) => meta.url);
};

/**
 * Get metadata for a specific category
 */
export const getMetadataByCategory = (category: "main" | "purchase" | "international"): UrlMetadata[] => {
  switch (category) {
    case "main":
      return MAIN_PAGES_METADATA;
    case "purchase":
      return PUBG_PURCHASE_PAGES_METADATA;
    case "international":
      return INTERNATIONAL_PAGES_METADATA;
    default:
      return [];
  }
};
