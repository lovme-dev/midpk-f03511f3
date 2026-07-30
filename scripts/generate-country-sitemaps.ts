// Regenerates every country sitemap from COUNTRY_DATA so all country x game URLs
// are submitted to Google. Run: bunx tsx scripts/generate-country-sitemaps.ts
import fs from "fs";
import path from "path";
import { COUNTRY_DATA } from "../src/utils/gameSeoConfigs";

const BASE = "https://www.midasbuy.com.pk";
const codes = Object.keys(COUNTRY_DATA).map((c) => c.toLowerCase());

interface Group {
  file: string;
  build: (cc: string) => string;
  priority: string;
  changefreq: string;
}

const groups: Group[] = [
  { file: "sitemap_countries_home.xml", build: (cc) => `/midasbuy/${cc}`, priority: "0.9", changefreq: "daily" },
  { file: "sitemap_countries_pubg.xml", build: (cc) => `/midasbuy/${cc}/buy/pubgm`, priority: "1.0", changefreq: "daily" },
  { file: "sitemap_countries_freefire.xml", build: (cc) => `/midasbuy/${cc}/buy/freefire`, priority: "0.9", changefreq: "daily" },
  { file: "sitemap_countries_roblox.xml", build: (cc) => `/midasbuy/${cc}/buy/roblox`, priority: "0.8", changefreq: "weekly" },
  { file: "sitemap_countries_valorant.xml", build: (cc) => `/midasbuy/${cc}/buy/valorant`, priority: "0.8", changefreq: "weekly" },
  { file: "sitemap_countries_car.xml", build: (cc) => `/midasbuy/${cc}/buy/car`, priority: "0.7", changefreq: "weekly" },
];

let total = 0;

for (const group of groups) {
  const urls = codes
    .map(
      (cc) => `  <url>
    <loc>${BASE}${group.build(cc)}</loc>
    <changefreq>${group.changefreq}</changefreq>
    <priority>${group.priority}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.resolve("public", group.file), xml, "utf8");
  total += codes.length;
  console.log(`✅ ${group.file}: ${codes.length} URLs`);
}

console.log(`🌍 Total country URLs in sitemaps: ${total}`);
