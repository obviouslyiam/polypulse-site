import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const dataDir = join(rootDir, 'data');
const publicDir = join(rootDir, 'public');

const SITE_URL = 'https://polypulse.xyz';

function loadJSON(filename) {
  return JSON.parse(readFileSync(join(dataDir, filename), 'utf-8'));
}

const markets = loadJSON('markets.json');
const categories = loadJSON('categories.json');
const wallets = loadJSON('wallets.json');
const guides = loadJSON('guides.json');
const glossary = loadJSON('glossary.json');
const comparisons = loadJSON('comparisons.json');

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/newsletter', priority: '0.7', changefreq: 'monthly' },
  { path: '/markets', priority: '0.9', changefreq: 'daily' },
  { path: '/wallets', priority: '0.8', changefreq: 'daily' },
  { path: '/learn', priority: '0.8', changefreq: 'weekly' },
  { path: '/glossary', priority: '0.8', changefreq: 'monthly' },
  { path: '/compare', priority: '0.8', changefreq: 'weekly' },
];

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const page of staticPages) {
  xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
}

for (const market of markets) {
  xml += `  <url>
    <loc>${SITE_URL}/markets/${market.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
`;
}

const seenWallets = new Set();
for (const wallet of wallets) {
  if (seenWallets.has(wallet.walletAddress)) continue;
  seenWallets.add(wallet.walletAddress);
  xml += `  <url>
    <loc>${SITE_URL}/wallets/${wallet.walletAddress}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
`;
}

for (const cat of categories) {
  xml += `  <url>
    <loc>${SITE_URL}/markets/category/${cat.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

for (const guide of guides) {
  xml += `  <url>
    <loc>${SITE_URL}/learn/${guide.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

for (const term of glossary) {
  xml += `  <url>
    <loc>${SITE_URL}/glossary/${term.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
}

for (const comp of comparisons) {
  xml += `  <url>
    <loc>${SITE_URL}/compare/${comp.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

xml += `</urlset>`;

const totalUrls = staticPages.length + markets.length + seenWallets.size + categories.length + guides.length + glossary.length + comparisons.length;
writeFileSync(join(publicDir, 'sitemap.xml'), xml);
console.log(`Sitemap generated: ${totalUrls} URLs`);

