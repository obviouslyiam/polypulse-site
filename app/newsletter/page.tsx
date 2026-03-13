import type { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import NewsletterCTA from '@/app/components/NewsletterCTA';

export const metadata: Metadata = {
  title: 'PolyPulse Weekly Newsletter — Prediction Market Intelligence',
  description:
    'Subscribe to PolyPulse Weekly for curated prediction market intelligence: market movers, smart money plays, AI bot signals, and category deep dives.',
};

export default function NewsletterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'Newsletter' }]} />

      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          <span className="text-[#8b5cf6]">PolyPulse</span> Weekly
        </h1>
        <p className="text-lg text-[#9ca3af] max-w-2xl mx-auto">
          Prediction market intelligence delivered to your inbox every week.
          The signals that matter, without the noise.
        </p>
      </div>

      {/* What You Get */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/15 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">Market Movers</h3>
          <p className="text-sm text-[#9ca3af]">
            The biggest price swings, volume spikes, and newly listed markets across all
            categories. What moved, why, and what it signals.
          </p>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/15 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#06b6d4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">Smart Money Plays</h3>
          <p className="text-sm text-[#9ca3af]">
            Where the highest-performing wallets are putting their capital. Consensus shifts,
            large position entries, and contrarian bets from proven traders.
          </p>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-[#22c55e]/15 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">AI Bot Signals</h3>
          <p className="text-sm text-[#9ca3af]">
            Insights from our Signal Arena — hundreds of AI trading bots competing in real-time.
            When the bots agree, pay attention.
          </p>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-[#ef4444]/15 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">Category Deep Dives</h3>
          <p className="text-sm text-[#9ca3af]">
            Each week we pick one category — politics, crypto, sports — and go deep. Structural
            analysis, historical patterns, and the markets the algorithms flagged.
          </p>
        </div>
      </div>

      {/* Sample Issue Preview */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 mb-12">
        <div className="text-center mb-6">
          <span className="text-xs font-medium text-[#8b5cf6] bg-[#8b5cf6]/10 px-3 py-1 rounded-full">
            Sample Issue Preview
          </span>
        </div>
        <div className="space-y-4 text-sm text-[#9ca3af]">
          <div className="border-b border-[#1f2937] pb-4">
            <h4 className="text-white font-medium mb-1">This Week&apos;s Top Alpha</h4>
            <p>
              3 markets where smart money consensus diverges sharply from current price.
              Combined alpha score: 290+. Average edge: 34 cents.
            </p>
          </div>
          <div className="border-b border-[#1f2937] pb-4">
            <h4 className="text-white font-medium mb-1">Smart Money Spotlight</h4>
            <p>
              SecondWindCapital added $47K in new positions across 5 political markets this week.
              All NO positions. Current streak: 8 consecutive wins.
            </p>
          </div>
          <div className="border-b border-[#1f2937] pb-4">
            <h4 className="text-white font-medium mb-1">Signal Arena Report</h4>
            <p>
              Bot consensus shifted bearish on crypto markets. 73% of arena bots now hold
              NO positions on Bitcoin $100K by March targets.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Deep Dive: US Politics</h4>
            <p>
              953 active markets. Where the money is flowing ahead of midterms, and 3 markets
              the AI flagged as severely mispriced.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <NewsletterCTA />

      <div className="text-center mt-8">
        <p className="text-xs text-[#9ca3af]/60">
          No spam. No affiliate garbage. Just data-driven market intelligence, once a week.
          Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
