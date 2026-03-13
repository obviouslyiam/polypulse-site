import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const dataDir = join(rootDir, 'data');

const API_URL = 'https://trade-sphere.up.railway.app';
const API_KEY = 'kk9k_2c5df618a8f00ccbd114cf4625214396d56c9ed68db57abe';

mkdirSync(dataDir, { recursive: true });

async function fetchJSON(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'x-api-key': API_KEY }
  });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

async function main() {
  console.log('Fetching TradeSphere data...');

  // Fetch markets
  const marketData = await fetchJSON('/api/alpha-hunter/summary');
  const markets = marketData.markets || [];
  console.log(`Markets: ${markets.length}`);
  writeFileSync(join(dataDir, 'markets.json'), JSON.stringify(markets, null, 2));

  // Fetch top wallets (page through to get more)
  const walletData = await fetchJSON('/api/leaderboard');
  const wallets = walletData.data || [];
  console.log(`Wallets (page 1): ${wallets.length}`);

  // Try to get more wallet pages
  const allWallets = [...wallets];
  for (let page = 2; page <= 10; page++) {
    try {
      const pageData = await fetchJSON(`/api/leaderboard?page=${page}`);
      const pageWallets = pageData.data || [];
      if (pageWallets.length === 0) break;
      allWallets.push(...pageWallets);
      console.log(`Wallets (page ${page}): ${pageWallets.length}`);
    } catch {
      break;
    }
  }
  console.log(`Total wallets: ${allWallets.length}`);
  writeFileSync(join(dataDir, 'wallets.json'), JSON.stringify(allWallets, null, 2));

  // Derive categories
  const categories = {};
  for (const m of markets) {
    const cat = m.category || 'unknown';
    if (!categories[cat]) {
      categories[cat] = { slug: cat, name: formatCategoryName(cat), count: 0, topMarkets: [] };
    }
    categories[cat].count++;
    if (categories[cat].topMarkets.length < 20) {
      categories[cat].topMarkets.push({
        slug: m.slug,
        question: m.question,
        yesPrice: m.yesPrice,
        volume: m.volume,
        alphaScore: m.marketAlphaScore,
        consensus: m.consensusDirection,
        edge: m.consensusEdge
      });
    }
  }
  const categoryList = Object.values(categories).sort((a, b) => b.count - a.count);
  writeFileSync(join(dataDir, 'categories.json'), JSON.stringify(categoryList, null, 2));
  console.log(`Categories: ${categoryList.length}`);

  // Summary stats
  const stats = {
    totalMarkets: markets.length,
    totalWallets: allWallets.length,
    smartWalletCount: marketData.smartWalletCount || 0,
    categories: categoryList.map(c => ({ name: c.name, slug: c.slug, count: c.count })),
    fetchedAt: new Date().toISOString()
  };
  writeFileSync(join(dataDir, 'stats.json'), JSON.stringify(stats, null, 2));

  console.log('Data fetch complete.');
}

function formatCategoryName(slug) {
  const names = {
    'sports': 'Sports',
    'us-politics': 'US Politics',
    'world-politics': 'World Politics',
    'business': 'Business & Economics',
    'crypto': 'Crypto & Web3',
    'pop-culture': 'Pop Culture',
    'science': 'Science & Technology',
    'entertainment': 'Entertainment',
    'unknown': 'Other Markets'
  };
  return names[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

main().catch(err => {
  console.error('Data fetch failed:', err);
  process.exit(1);
});
