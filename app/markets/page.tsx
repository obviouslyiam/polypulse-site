import type { Metadata } from 'next';
import Link from 'next/link';
import markets from '@/data/markets.json';
import categories from '@/data/categories.json';

export const metadata: Metadata = {
  title: '5,400+ Prediction Markets Analyzed — PolyPulse',
  description:
    'Browse thousands of prediction markets with smart money consensus, alpha scores, and data-driven analysis. Filter by sports, politics, crypto, and more.',
  openGraph: {
    title: '5,400+ Prediction Markets Analyzed — PolyPulse',
    description:
      'Browse thousands of prediction markets with smart money consensus, alpha scores, and data-driven analysis.',
  },
};

type Market = (typeof markets)[number];
type SortKey = 'alpha' | 'volume' | 'edge';

function formatVolume(v: number | null): string {
  if (v == null) return '--';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function alphaColor(score: number | null): string {
  if (score == null) return 'bg-[#1f2937] text-[#9ca3af]';
  if (score >= 80) return 'bg-[#22c55e]/20 text-[#22c55e]';
  if (score >= 60) return 'bg-[#eab308]/20 text-[#eab308]';
  if (score >= 40) return 'bg-[#f97316]/20 text-[#f97316]';
  return 'bg-[#ef4444]/20 text-[#ef4444]';
}

function consensusLabel(dir: string): { text: string; color: string } {
  switch (dir) {
    case 'STRONG_YES':
      return { text: 'Strong YES', color: 'text-[#22c55e]' };
    case 'LEAN_YES':
      return { text: 'Lean YES', color: 'text-[#22c55e]/80' };
    case 'STRONG_NO':
      return { text: 'Strong NO', color: 'text-[#ef4444]' };
    case 'LEAN_NO':
      return { text: 'Lean NO', color: 'text-[#ef4444]/80' };
    default:
      return { text: 'Split', color: 'text-[#9ca3af]' };
  }
}

function sortMarkets(list: Market[], key: SortKey): Market[] {
  return [...list].sort((a, b) => {
    if (key === 'alpha')
      return (b.marketAlphaScore ?? 0) - (a.marketAlphaScore ?? 0);
    if (key === 'volume') return (b.volume ?? 0) - (a.volume ?? 0);
    if (key === 'edge')
      return (b.consensusEdge ?? 0) - (a.consensusEdge ?? 0);
    return 0;
  });
}

function MarketCard({ market }: { market: Market }) {
  const consensus = consensusLabel(market.consensusDirection);

  return (
    <Link
      href={`/markets/${market.slug}`}
      className="block bg-[#111827] border border-[#1f2937] rounded-xl p-5 hover:border-[#8b5cf6]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#8b5cf6]/5"
    >
      <h3 className="text-white font-semibold text-sm leading-snug mb-3 line-clamp-2">
        {market.question}
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[#22c55e] font-mono font-bold text-sm">
            YES {((market.yesPrice ?? 0) * 100).toFixed(0)}%
          </span>
          <span className="text-[#1f2937]">/</span>
          <span className="text-[#ef4444] font-mono font-bold text-sm">
            NO {((market.noPrice ?? 0) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${alphaColor(market.marketAlphaScore)}`}
          >
            {market.marketAlphaScore != null
              ? `Alpha ${market.marketAlphaScore}`
              : 'No Score'}
          </span>
          <span className={`text-xs font-medium ${consensus.color}`}>
            {consensus.text}
          </span>
        </div>
        <span className="text-xs text-[#9ca3af]">
          {formatVolume(market.volume)}
        </span>
      </div>
    </Link>
  );
}

function CategoryTab({
  cat,
  active,
}: {
  cat: { slug: string; name: string; count: number };
  active: boolean;
}) {
  return (
    <Link
      href={active ? '/markets' : `/markets/category/${cat.slug}`}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-[#8b5cf6] text-white'
          : 'bg-[#111827] text-[#9ca3af] border border-[#1f2937] hover:border-[#8b5cf6]/50 hover:text-white'
      }`}
    >
      {cat.name}
      <span
        className={`text-xs ${active ? 'text-white/70' : 'text-[#9ca3af]/60'}`}
      >
        ({cat.count})
      </span>
    </Link>
  );
}

export default function MarketsPage() {
  const sorted = sortMarkets(markets as Market[], 'alpha');
  const topMarkets = sorted.slice(0, 100);

  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-[#9ca3af]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#8b5cf6] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1f2937]">/</span>
                <span className="text-white">Markets</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Prediction Market Analysis
          </h1>
          <p className="text-[#9ca3af] text-lg max-w-2xl">
            {markets.length.toLocaleString()} markets analyzed with smart money
            consensus and alpha scoring. Find where the edge is.
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/markets"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#8b5cf6] text-white whitespace-nowrap"
            >
              All Markets
              <span className="text-xs text-white/70">
                ({markets.length.toLocaleString()})
              </span>
            </Link>
            {(categories as { slug: string; name: string; count: number }[]).map(
              (cat) => (
                <CategoryTab key={cat.slug} cat={cat} active={false} />
              )
            )}
          </div>
        </div>

        {/* Sort indicator */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#9ca3af]">
            Showing top 100 markets by{' '}
            <span className="text-[#8b5cf6] font-medium">Alpha Score</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
            <span>Sort:</span>
            <span className="px-2 py-1 rounded bg-[#8b5cf6]/20 text-[#8b5cf6] font-medium">
              Alpha Score
            </span>
            <span className="px-2 py-1 rounded bg-[#111827] border border-[#1f2937] hover:border-[#8b5cf6]/50 cursor-default">
              Volume
            </span>
            <span className="px-2 py-1 rounded bg-[#111827] border border-[#1f2937] hover:border-[#8b5cf6]/50 cursor-default">
              Edge
            </span>
          </div>
        </div>

        {/* Market grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {topMarkets.map((market) => (
            <MarketCard key={market.slug} market={market} />
          ))}
        </div>

        {/* Category sections with "View All" links */}
        <div className="space-y-10">
          <h2 className="text-2xl font-bold text-white">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(
              categories as { slug: string; name: string; count: number }[]
            ).map((cat) => (
              <Link
                key={cat.slug}
                href={`/markets/category/${cat.slug}`}
                className="block bg-[#111827] border border-[#1f2937] rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-all group"
              >
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#8b5cf6] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[#9ca3af] text-sm mb-4">
                  {cat.count} markets analyzed
                </p>
                <span className="text-[#8b5cf6] text-sm font-medium">
                  View all &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#8b5cf6]/10 to-[#06b6d4]/10 border border-[#1f2937] rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Get Alpha Delivered
          </h2>
          <p className="text-[#9ca3af] mb-6 max-w-lg mx-auto">
            Weekly smart money moves, top-scoring markets, and data-driven
            predictions. No noise.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-[#111827] border border-[#1f2937] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:border-[#8b5cf6] transition-colors"
            />
            <button className="px-6 py-3 bg-[#8b5cf6] text-white font-semibold rounded-lg hover:bg-[#7c3aed] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
