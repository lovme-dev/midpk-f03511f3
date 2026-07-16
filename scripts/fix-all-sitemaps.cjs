#!/usr/bin/env node
/**
 * COMPREHENSIVE SITEMAP X-DEFAULT URL FIX SCRIPT
 * 
 * This script fixes ALL x-default hreflang URLs in sitemap files
 * to point to final destination URLs instead of redirect URLs.
 * 
 * Fixes:
 * - /pubg-mobile → /midasbuy/us/buy/pubgm
 * - /free-fire → /midasbuy/us/buy/freefire
 * - /roblox → /midasbuy/us/buy/roblox
 * - /valorant → /midasbuy/us/buy/valorant
 * - /car-purchase → /midasbuy/us/buy/car
 * - / → /midasbuy/us (home page)
 * 
 * Usage: node scripts/fix-all-sitemaps.cjs
 */

const fs = require('fs');
const path = require('path');

// All redirect URL replacements
const REPLACEMENTS = [
  // PUBG Mobile
  { 
    pattern: /href="https:\/\/www\.middasbuy\.com\/pubg-mobile"/g, 
    replacement: 'href="https://www.middasbuy.com/midasbuy/us/buy/pubgm"' 
  },
  // Free Fire
  { 
    pattern: /href="https:\/\/www\.middasbuy\.com\/free-fire"/g, 
    replacement: 'href="https://www.middasbuy.com/midasbuy/us/buy/freefire"' 
  },
  // Roblox
  { 
    pattern: /href="https:\/\/www\.middasbuy\.com\/roblox"/g, 
    replacement: 'href="https://www.middasbuy.com/midasbuy/us/buy/roblox"' 
  },
  // Valorant
  { 
    pattern: /href="https:\/\/www\.middasbuy\.com\/valorant"/g, 
    replacement: 'href="https://www.middasbuy.com/midasbuy/us/buy/valorant"' 
  },
  // Car Purchase
  { 
    pattern: /href="https:\/\/www\.middasbuy\.com\/car-purchase"/g, 
    replacement: 'href="https://www.middasbuy.com/midasbuy/us/buy/car"' 
  },
  // Home page - root "/" to /midasbuy/us
  { 
    pattern: /hreflang="x-default" href="https:\/\/www\.middasbuy\.com\/"/g, 
    replacement: 'hreflang="x-default" href="https://www.middasbuy.com/midasbuy/us"' 
  }
];

const SITEMAP_FILES = [
  'public/sitemap_countries_pubg.xml',
  'public/sitemap_countries_freefire.xml',
  'public/sitemap_countries_roblox.xml',
  'public/sitemap_countries_valorant.xml',
  'public/sitemap_countries_car.xml',
  'public/sitemap_countries_home.xml'
];

console.log('🔧 COMPREHENSIVE SITEMAP X-DEFAULT URL FIX');
console.log('=========================================\n');

let grandTotal = 0;

for (const file of SITEMAP_FILES) {
  const filePath = path.resolve(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⏭️  ${file}: Not found (skipped)`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  const originalContent = content;
  
  for (const { pattern, replacement } of REPLACEMENTS) {
    const matches = content.match(pattern);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(pattern, replacement);
    }
  }
  
  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ ${file}: ${fileReplacements} URLs fixed`);
    grandTotal += fileReplacements;
  } else if (content !== originalContent) {
    console.log(`  ⚠️  ${file}: Content changed but no count`);
  } else {
    console.log(`  ⏭️  ${file}: Already fixed (0 changes needed)`);
  }
}

console.log(`\n=========================================`);
console.log(`🎉 TOTAL: ${grandTotal} x-default URLs updated!`);
console.log(`=========================================`);

if (grandTotal > 0) {
  console.log('\n📌 Next steps:');
  console.log('   1. Commit these changes');
  console.log('   2. Publish app to deploy updated sitemaps');
  console.log('   3. Re-submit sitemaps in Google Search Console');
  console.log('   4. Request indexing for important country URLs');
} else {
  console.log('\n✓ All sitemaps are already correctly configured!');
}
