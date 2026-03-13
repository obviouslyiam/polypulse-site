import Link from 'next/link';
import marketsData from '@/data/markets.json';
import statsData from '@/data/stats.json';
import categoriesData from '@/data/categories.json';
import MarketCard from '@/app/components/MarketCard';
import NewsletterCTA from '@/app/components/NewsletterCTA';

interface Market {
  slug: string;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  marketAlphaScore: number;
  consensusDirection: string;
  consensusEdge?: number;
}

const topMarkets = (marketsData as Market[])
  .sort((a, b) => b.marketAlphaScore - a.marketAlphaScore)
  .slice(0, 12);

const categoryIcons: Record<string, string> = {
  sports: '\u26BD',
  'us-politics': '\uD83C\uDDFA\uD83C\uDDF8',
  'world-politics': '\uD83C\uDF0D',
  business: '\uD83D\uDCC8',
  crypto: '\u26D3\uFE0F',
  'pop-culture': '\u2B50',
  science: '\uD83D\uDD2C',
  entertainment: '\uD83C\uDFAC',
  unknown: '\uD83D\uDCC1',
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8b5cf6]/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Prediction Market{' '}
              <span className="text-[#8b5cf6]">Intelligence</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#9ca3af] mb-10 max-w-2xl mx-auto">
              {statsData.totalMarkets.toLocaleString()}+ markets analyzed with AI-powered smart money
              consensus. Track where the sharp money flows before the crowd catches on.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/markets"
                className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
              >
                Explore Markets
              </Link>
              <Link
                href="/newsletter"
                className="border border-[#1f2937] hover:border-[#8b5cf6]/50 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
              >
                Get Weekly Intelligence
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[#1f2937] bg-[#111827]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {statsData.totalMarkets.toLocaleString()}
              </div>
              <div className="text-sm text-[#9ca3af] mt-1">Markets Analyzed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {statsData.totalWallets.toLocaleString()}+
              </div>
              <div className="text-sm text-[#9ca3af] mt-1">Smart Wallets Tracked</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {statsData.categories.length}
              </div>
              <div className="text-sm text-[#9ca3af] mt-1">Categories</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#8b5cf6]">
                {statsData.smartWalletCount.toLocaleString()}
              </div>
              <div className="text-sm text-[#9ca3af] mt-1">Alpha Signals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Top Alpha Markets</h2>
            <p className="text-sm text-[#9ca3af] mt-1">
              Highest alpha score markets with strong smart money consensus
            </p>
          </div>
          <Link
            href="/markets"
            className="text-sm text-[#8b5cf6] hover:text-[#7c3aed] transition-colors hidden sm:block"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topMarkets.map((market) => (
            <MarketCard
              key={market.slug}
              slug={market.slug}
              question={market.question}
              yesPrice={market.yesPrice}
              noPrice={market.noPrice}
              volume={market.volume}
              marketAlphaScore={market.marketAlphaScore}
              consensusDirection={market.consensusDirection}
            />
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/markets"
            className="text-sm text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
          >
            View all markets &rarr;
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Browse by Category</h2>
          <p className="text-sm text-[#9ca3af] mt-1">
            Explore prediction markets across {statsData.categories.length} categories
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(categoriesData as { slug: string; name: string; count: number }[]).map((cat) => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`}>
              <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 hover:border-[#8b5cf6]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#8b5cf6]/5 flex items-center gap-4">
                <span className="text-2xl">{categoryIcons[cat.slug] || '\uD83D\uDCC1'}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">{cat.name}</h3>
                  <p className="text-xs text-[#9ca3af]">
                    {cat.count.toLocaleString()} markets
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-[#9ca3af]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <NewsletterCTA />
      </section>

      {/* Learn Section CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Learn Prediction Markets</h2>
            <p className="text-sm text-[#9ca3af] max-w-lg">
              New to prediction markets? Our guides cover everything from the basics to advanced
              smart money analysis strategies.
            </p>
          </div>
          <Link
            href="/learn"
            className="shrink-0 border border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Start Learning
          </Link>
        </div>
      </section>
    </>
  );
}
