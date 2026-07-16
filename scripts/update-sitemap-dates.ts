/**
 * Script to update all sitemap lastmod dates to today's date.
 * Run this script to bulk-update all sitemap XML files in public/
 * 
 * Usage: This runs automatically as a Vite plugin during build.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = join(process.cwd(), 'public');
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

export function updateSitemapDates() {
  const sitemapFiles = readdirSync(PUBLIC_DIR).filter(f => f.endsWith('.xml'));
  
  sitemapFiles.forEach(file => {
    const filePath = join(PUBLIC_DIR, file);
    let content = readFileSync(filePath, 'utf-8');
    
    // Replace all lastmod dates with today's date
    const updatedContent = content.replace(
      /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
      `<lastmod>${TODAY}</lastmod>`
    );
    
    if (content !== updatedContent) {
      writeFileSync(filePath, updatedContent, 'utf-8');
      console.log(`✅ Updated dates in ${file}`);
    }
  });
}

// Run if called directly
updateSitemapDates();
