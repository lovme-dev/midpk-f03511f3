import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import type { Plugin } from "vite";
import { COUNTRY_DATA, getGameSEOConfig } from "./src/utils/gameSeoConfigs";

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
  { from: 'href="https://www.middasbuy.com/pubg-mobile"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/pubgm"' },
  // Free Fire (180+ occurrences)
  { from: 'href="https://www.middasbuy.com/free-fire"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/freefire"' },
  // Roblox (180+ occurrences)
  { from: 'href="https://www.middasbuy.com/roblox"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/roblox"' },
  // Valorant (180+ occurrences)
  { from: 'href="https://www.middasbuy.com/valorant"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/valorant"' },
  // Car Purchase (190+ occurrences)
  { from: 'href="https://www.middasbuy.com/car-purchase"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/car"' },
  // Home page - root "/" to /midasbuy/us (180+ occurrences)
  // Match x-default with trailing /" to avoid matching country-specific URLs
  { from: 'hreflang="x-default" href="https://www.middasbuy.com/"', to: 'hreflang="x-default" href="https://www.middasbuy.com/midasbuy/us"' }
];

const SITEMAP_FILES = [
  'public/sitemap_countries_pubg.xml',
  'public/sitemap_countries_freefire.xml',
  'public/sitemap_countries_roblox.xml',
  'public/sitemap_countries_valorant.xml',
  'public/sitemap_countries_car.xml',
  'public/sitemap_countries_home.xml'
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

// Update sitemap dates to today
const updateSitemapDates = (files: string[], isDistFolder = false) => {
  const today = new Date().toISOString().split('T')[0];
  let updated = 0;
  
  // Also update sitemap.xml index and static
  const allFiles = [...files, 'public/sitemap.xml', 'public/sitemap_static.xml'];
  
  for (const file of allFiles) {
    const filePath = path.resolve(isDistFolder ? file.replace('public/', 'dist/') : file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      updated++;
    }
  }
  
  if (updated > 0) console.log(`📅 Updated dates to ${today} in ${updated} sitemap files`);
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
      <p style="margin:0;font-size:14px;line-height:1.7;color:rgba(248,250,252,.62);">${escapeHtml(title)} — pre-rendered HTML snapshot for search engines before the React app loads.</p>
    </section>
  </main>`;

const createPrerenderedHtml = ({
  template,
  lang,
  title,
  description,
  canonicalUrl,
  body,
}: {
  template: string;
  lang: string;
  title: string;
  description: string;
  canonicalUrl: string;
  body: string;
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
    const baseUrl = 'https://www.middasbuy.com';
    const countryEntries = Object.entries(COUNTRY_DATA);

    for (const [code, country] of countryEntries) {
      const lowerCode = code.toLowerCase();

      const homePath = `/midasbuy/${lowerCode}`;
      const homeTitle = `Tencent's official recharge, top-up and redeem ${country.name} | Midasbuy`;
      const homeDescription = `Midasbuy ${country.name} official store. Buy gaming credits at best prices with fast delivery and secure payment methods.`;
      const homeBody = buildPrerenderBody({
        title: homeTitle,
        heading: `Midasbuy ${country.name} official store`,
        description: `Players in ${country.name} can buy PUBG Mobile UC and other gaming top-ups with ${country.currency} pricing, secure checkout, and fast delivery.`,
        bullets: [
          `Local currency: ${country.currency} (${country.currencySymbol})`,
          `Popular payments: ${country.paymentMethods.slice(0, 3).join(', ')}`,
          `Country storefront URL: ${baseUrl}${homePath}`,
        ],
      });

      const homeHtml = createPrerenderedHtml({
        template,
        lang: country.language || 'en',
        title: homeTitle,
        description: homeDescription,
        canonicalUrl: `${baseUrl}${homePath}`,
        body: homeBody,
      });

      const homeDir = path.resolve(`dist/midasbuy/${lowerCode}`);
      fs.mkdirSync(homeDir, { recursive: true });
      fs.writeFileSync(path.join(homeDir, 'index.html'), homeHtml, 'utf8');
      // Also write flat .html so Cloudflare/Lovable hosting can serve /midasbuy/{cc} without SPA fallback
      fs.mkdirSync(path.resolve('dist/midasbuy'), { recursive: true });
      fs.writeFileSync(path.resolve(`dist/midasbuy/${lowerCode}.html`), homeHtml, 'utf8');

      // Generate prerendered HTML for all 5 game routes per country
      const gameRoutes: Array<{ slug: string; label: string; product: string; seoSlug: string | null }> = [
        { slug: 'pubgm', label: 'PUBG Mobile UC', product: 'PUBG Mobile UC', seoSlug: 'pubgm' },
        { slug: 'freefire', label: 'Free Fire Diamonds', product: 'Free Fire Diamonds', seoSlug: 'freefire' },
        { slug: 'roblox', label: 'Roblox Robux', product: 'Roblox Robux', seoSlug: 'roblox' },
        { slug: 'valorant', label: 'Valorant Points', product: 'Valorant Points', seoSlug: 'valorant' },
        { slug: 'car', label: 'PUBG Car Skins', product: 'PUBG Mobile Car Skins', seoSlug: null },
      ];

      for (const game of gameRoutes) {
        const seoConfig = game.seoSlug
          ? getGameSEOConfig(code, game.seoSlug as 'pubgm' | 'freefire' | 'roblox' | 'valorant')
          : {
              title: `Buy ${game.label} in ${country.name} - Best Prices | Midasbuy`,
              description: `Buy ${game.product} in ${country.name} with instant delivery, ${country.currency} pricing and secure payments at Midasbuy.`,
            };
        const gamePath = `/midasbuy/${lowerCode}/buy/${game.slug}`;
        const gameTitle = `${seoConfig.title} | ${country.name}`;
        const gameDescription = `${seoConfig.description} Available in ${country.name} with ${country.currency} pricing.`;
        const gameBody = buildPrerenderBody({
          title: gameTitle,
          heading: `Buy ${game.label} in ${country.name}`,
          description: `${game.product} players in ${country.name} can top up with instant delivery, ${country.currency} (${country.currencySymbol}) pricing, and trusted local payment methods before the SPA finishes loading.`,
          bullets: [
            `Local currency: ${country.currency} (${country.currencySymbol})`,
            `Top payment methods: ${country.paymentMethods.slice(0, 4).join(', ')}`,
            `Canonical URL: ${baseUrl}${gamePath}`,
            `Country: ${country.name}`,
          ],
        });

        const gameHtml = createPrerenderedHtml({
          template,
          lang: country.language || 'en',
          title: gameTitle,
          description: gameDescription,
          canonicalUrl: `${baseUrl}${gamePath}`,
          body: gameBody,
        });

        const gameDir = path.resolve(`dist/midasbuy/${lowerCode}/buy/${game.slug}`);
        fs.mkdirSync(gameDir, { recursive: true });
        fs.writeFileSync(path.join(gameDir, 'index.html'), gameHtml, 'utf8');
        // Flat .html so /midasbuy/{cc}/buy/{game} is served directly without SPA fallback
        fs.mkdirSync(path.resolve(`dist/midasbuy/${lowerCode}/buy`), { recursive: true });
        fs.writeFileSync(path.resolve(`dist/midasbuy/${lowerCode}/buy/${game.slug}.html`), gameHtml, 'utf8');
      }
    }

    // Prerender India-only BGMI route
    if (COUNTRY_DATA.IN) {
      const inCountry = COUNTRY_DATA.IN;
      const bgmiTitle = `Buy BGMI UC in India - Best Prices & Instant Delivery | Midasbuy India`;
      const bgmiDescription = `Buy BGMI (Battlegrounds Mobile India) UC with instant delivery, INR pricing and secure local payment methods at Midasbuy India.`;
      const bgmiPath = `/midasbuy/in/buy/bgmi`;
      const bgmiBody = buildPrerenderBody({
        title: bgmiTitle,
        heading: `Buy BGMI UC in India`,
        description: `BGMI players in India can top up UC instantly with INR pricing and local payment methods.`,
        bullets: [`Currency: INR (₹)`, `Canonical URL: ${baseUrl}${bgmiPath}`, `Country: India`],
      });
      const bgmiHtml = createPrerenderedHtml({
        template,
        lang: inCountry.language || 'en',
        title: bgmiTitle,
        description: bgmiDescription,
        canonicalUrl: `${baseUrl}${bgmiPath}`,
        body: bgmiBody,
      });
      const bgmiDir = path.resolve(`dist/midasbuy/in/buy/bgmi`);
      fs.mkdirSync(bgmiDir, { recursive: true });
      fs.writeFileSync(path.join(bgmiDir, 'index.html'), bgmiHtml, 'utf8');
      fs.writeFileSync(path.resolve(`dist/midasbuy/in/buy/bgmi.html`), bgmiHtml, 'utf8');
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

    console.log(`🕷️ Generated prerendered HTML for ${countryEntries.length} countries × 6 routes (home + 5 games) + ${staticPages.length} static pages + BGMI`);
  }
});

// Fix source files immediately when config is loaded (during dev start)
console.log('🔧 Fixing sitemap x-default URLs in source files...');
fixSitemapFiles(SITEMAP_FILES);
updateSitemapDates(SITEMAP_FILES);

// Plugin to fix sitemap x-default URLs and dates at build time
const sitemapFixPlugin = (): Plugin => ({
  name: 'sitemap-fix',
  apply: 'build',
  closeBundle() {
    console.log('🔧 Fixing sitemap x-default URLs in dist folder...');
    
    // Fix dist folder files
    const distFiles = SITEMAP_FILES.map(f => f.replace('public/', 'dist/'));
    const distReplacements = fixSitemapFiles(distFiles.map(f => f.replace('dist/', 'public/')), true);
    
    // Update dates in dist
    updateSitemapDates(SITEMAP_FILES, true);
    
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
