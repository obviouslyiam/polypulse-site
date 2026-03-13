import type { Metadata } from 'next';
import Link from 'next/link';
import markets from '@/data/markets.json';
import categories from '@/data/categories.json';

type Market = (typeof markets)[number];
type Category = (typeof categories)[number];

/* ------------------------------------------------------------------ */
/*  Category descriptions                                              */
/* ------------------------------------------------------------------ */

const categoryDescriptions: Record<string, string> = {
  sports:
    'Live sports prediction markets covering major leagues, tournaments, and matchups. Smart money analysis on game outcomes, player performance, and championship odds.',
  'us-politics':
    'US political prediction markets spanning elections, policy, legislation, and appointments. See where smart money stands on the biggest political questions.',
  unknown:
    'Prediction markets spanning unique topics, niche events, and emerging categories. These markets often offer the largest alpha opportunities due to thinner coverage.',
  business:
    'Markets covering economic indicators, corporate events, earnings, IPOs, and macroeconomic trends. Data-driven analysis of business and economic outcomes.',
  crypto:
    'Cryptocurrency and Web3 prediction markets including price targets, protocol milestones, DeFi events, and regulatory outcomes. Smart money flow analysis from on-chain data.',
  'world-politics':
    'Global political markets covering international relations, elections, conflicts, and policy decisions. Smart money consensus on geopolitical outcomes.',
  'pop-culture':
    'Prediction markets on viral moments, social media milestones, celebrity events, and cultural phenomena. Where smart money meets pop culture.',
  science:
    'Markets on scientific breakthroughs, technology milestones, space exploration, and research outcomes. Data-driven analysis of science and tech predictions.',
  entertainment:
    'Entertainment industry prediction markets covering awards, box office, streaming, and media events. Smart money analysis on entertainment outcomes.',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pct(v: number | null): string {
  if (v == null) return '--';
  return `${(v * 100).toFixed(1)}%`;
}

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

/* ------------------------------------------------------------------ */
/*  Static generation                                                  */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return (categories as Category[]).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === slug);
  if (!cat) return { title: 'Category Not Found — PolyPulse' };

  return {
    title: `${cat.name} Prediction Markets — ${cat.count} Markets Analyzed | PolyPulse`,
    description:
      categoryDescriptions[slug] ??
      `Browse ${cat.count} ${cat.name.toLowerCase()} prediction markets with smart money consensus and alpha scores on PolyPulse.`,
    openGraph: {
      title: `${cat.name} Prediction Markets — PolyPulse`,
      description: `${cat.count} markets analyzed with smart money data and alpha scoring.`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Inline components                                                  */
/* ------------------------------------------------------------------ */

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
        <span className="text-[#22c55e] font-mono font-bold text-sm">
          YES {((market.yesPrice ?? 0) * 100).toFixed(0)}%
        </span>
        <span className="text-[#1f2937]">/</span>
        <span className="text-[#ef4444] font-mono font-bold text-sm">
          NO {((market.noPrice ?? 0) * 100).toFixed(0)}%
        </span>
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

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-[#1f2937] py-5">
      <h3 className="text-white font-semibold text-sm mb-2">{q}</h3>
      <p className="text-[#9ca3af] text-sm leading-relaxed">{a}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === slug);

  if (!cat) {
    return (
      <main className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Category Not Found
          </h1>
          <Link href="/markets" className="text-[#8b5cf6] hover:underline">
            Back to Markets
          </Link>
        </div>
      </main>
    );
  }

  // Get all markets in this category sorted by alpha score
  const categoryMarkets = (markets as Market[])
    .filter((m) => m.category === slug)
    .sort((a, b) => (b.marketAlphaScore ?? 0) - (a.marketAlphaScore ?? 0));

  const avgAlpha =
    categoryMarkets.filter((m) => m.marketAlphaScore != null).length > 0
      ? categoryMarkets
          .filter((m) => m.marketAlphaScore != null)
          .reduce((sum, m) => sum + (m.marketAlphaScore ?? 0), 0) /
        categoryMarkets.filter((m) => m.marketAlphaScore != null).length
      : null;

  const totalVolume = categoryMarkets.reduce(
    (sum, m) => sum + (m.volume ?? 0),
    0
  );

  const description =
    categoryDescriptions[slug] ??
    `Explore ${cat.count} ${cat.name.toLowerCase()} prediction markets with data-driven analysis.`;

  // Category-specific FAQs
  const faqs = [
    {
      q: `How many ${cat.name.toLowerCase()} prediction markets are available?`,
      a: `There are currently ${cat.count} ${cat.name.toLowerCase()} prediction markets being tracked and analyzed on PolyPulse. Each market includes smart money consensus data, alpha scoring, and opportunity assessment.`,
    },
    {
      q: `What is the average alpha score for ${cat.name.toLowerCase()} markets?`,
      a: avgAlpha != null
        ? `The average alpha score across ${cat.name.toLowerCase()} markets is ${avgAlpha.toFixed(1)} out of 100. ${avgAlpha >= 50 ? 'This is above average, suggesting meaningful divergence between market prices and smart money positioning in this category.' : 'Markets in this category tend to be more efficiently priced, with smart money and the broader market more closely aligned.'}`
        : `Alpha score data is limited for this category. As more smart money data is collected, scores will become more comprehensive.`,
    },
    {
      q: `How does smart money analysis work for ${cat.name.toLowerCase()} markets?`,
      a: `PolyPulse tracks thousands of wallets with a demonstrated history of profitable prediction market trades. For ${cat.name.toLowerCase()} markets, we analyze their position direction (YES/NO), size, and timing to generate a consensus signal. When smart money heavily favors one side, it often indicates an edge the broader market hasn't priced in.`,
    },
    {
      q: `What is the best ${cat.name.toLowerCase()} market to trade right now?`,
      a: `Markets are ranked by alpha score, which measures the gap between smart money consensus and current market pricing. The top-ranked ${cat.name.toLowerCase()} markets on this page have the highest alpha scores, indicating the largest potential edge. However, always consider liquidity, time to expiry, and your own analysis before trading.`,
    },
    {
      q: `How often is ${cat.name.toLowerCase()} market data updated?`,
      a: `Market data including prices, volume, smart money positions, and alpha scores are refreshed regularly to reflect the latest on-chain activity. Smart money consensus can shift as new positions are taken, so check back frequently for updated analysis.`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
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
              <Link
                href="/markets"
                className="hover:text-[#8b5cf6] transition-colors"
              >
                Markets
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#1f2937]">/</span>
              <span className="text-white">{cat.name}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {cat.name} Prediction Markets
          </h1>
          <p className="text-[#9ca3af] text-lg max-w-2xl mb-6">
            {description}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl px-5 py-3">
              <p className="text-xs text-[#9ca3af] uppercase tracking-wider">
                Markets
              </p>
              <p className="text-xl font-bold text-white">
                {categoryMarkets.length}
              </p>
            </div>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl px-5 py-3">
              <p className="text-xs text-[#9ca3af] uppercase tracking-wider">
                Avg Alpha Score
              </p>
              <p className="text-xl font-bold text-[#8b5cf6]">
                {avgAlpha != null ? avgAlpha.toFixed(1) : '--'}
              </p>
            </div>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl px-5 py-3">
              <p className="text-xs text-[#9ca3af] uppercase tracking-wider">
                Total Volume
              </p>
              <p className="text-xl font-bold text-white">
                {formatVolume(totalVolume)}
              </p>
            </div>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl px-5 py-3">
              <p className="text-xs text-[#9ca3af] uppercase tracking-wider">
                With Smart Money Data
              </p>
              <p className="text-xl font-bold text-white">
                {categoryMarkets.filter((m) => m.smartMoneyCount > 0).length}
              </p>
            </div>
          </div>
        </div>

        {/* Category navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/markets"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#111827] text-[#9ca3af] border border-[#1f2937] hover:border-[#8b5cf6]/50 hover:text-white transition-all whitespace-nowrap"
            >
              All Markets
            </Link>
            {(categories as Category[]).map((c) => (
              <Link
                key={c.slug}
                href={`/markets/category/${c.slug}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  c.slug === slug
                    ? 'bg-[#8b5cf6] text-white'
                    : 'bg-[#111827] text-[#9ca3af] border border-[#1f2937] hover:border-[#8b5cf6]/50 hover:text-white'
                }`}
              >
                {c.name}
                <span
                  className={`text-xs ${c.slug === slug ? 'text-white/70' : 'text-[#9ca3af]/60'}`}
                >
                  ({c.count})
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sort indicator */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#9ca3af]">
            {categoryMarkets.length} markets sorted by{' '}
            <span className="text-[#8b5cf6] font-medium">Alpha Score</span>
          </p>
        </div>

        {/* Market grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {categoryMarkets.map((market) => (
            <MarketCard key={market.slug} market={market} />
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            {cat.name} Markets FAQ
          </h2>
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl px-6">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#06b6d4]/10 border border-[#1f2937] rounded-2xl p-8 sm:p-12 text-center">
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
