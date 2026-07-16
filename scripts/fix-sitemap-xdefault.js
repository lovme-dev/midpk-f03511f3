#!/usr/bin/env node
/**
 * SITEMAP X-DEFAULT URL FIX SCRIPT
 * 
 * This script fixes all x-default hreflang URLs in sitemap files
 * to point to final destination URLs instead of redirect URLs.
 * 
 * This prevents Google "Page with redirect" errors.
 * 
 * Usage: node scripts/fix-sitemap-xdefault.js
 */

const fs = require('fs');
const path = require('path');

// Redirect URLs → Final destination URLs
const REPLACEMENTS = [
  // PUBG Mobile
  { from: 'href="https://www.middasbuy.com/pubg-mobile"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/pubgm"' },
  // Free Fire
  { from: 'href="https://www.middasbuy.com/free-fire"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/freefire"' },
  // Roblox
  { from: 'href="https://www.middasbuy.com/roblox"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/roblox"' },
  // Valorant
  { from: 'href="https://www.middasbuy.com/valorant"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/valorant"' },
  // Car Purchase
  { from: 'href="https://www.middasbuy.com/car-purchase"', to: 'href="https://www.middasbuy.com/midasbuy/us/buy/car"' },
  // Home page
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

console.log('🔧 Fixing sitemap x-default URLs...\n');

let totalReplacements = 0;

for (const file of SITEMAP_FILES) {
  const filePath = path.resolve(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⏭️  ${file}: Not found (skipped)`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  
  for (const { from, to } of REPLACEMENTS) {
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
    console.log(`  ⏭️  ${file}: Already fixed (0 changes)`);
  }
}

console.log(`\n🎉 Total: ${totalReplacements} x-default URLs updated!`);
console.log('\n📌 Next steps:');
console.log('   1. Publish app to apply changes');
console.log('   2. Re-submit sitemap in Google Search Console');
console.log('   3. Request indexing for important country URLs');
