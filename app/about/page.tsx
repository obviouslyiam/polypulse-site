import type { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import NewsletterCTA from '@/app/components/NewsletterCTA';

export const metadata: Metadata = {
  title: 'About PolyPulse — Prediction Market Intelligence',
  description:
    'PolyPulse delivers AI-analyzed prediction market intelligence. 5,400+ markets, 500+ tracked wallets, smart money consensus, and Signal Arena AI bots.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        About <span className="text-[#8b5cf6]">PolyPulse</span>
      </h1>

      <div className="prose prose-invert max-w-none space-y-6 text-[#9ca3af]">
        <p className="text-lg leading-relaxed">
          PolyPulse is the intelligence layer for prediction markets. We aggregate, analyze,
          and surface actionable insights from the world&apos;s largest prediction market platforms
          — so you can see where the smart money is flowing before the crowd catches on.
        </p>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 my-8">
          <h2 className="text-xl font-bold text-white mb-4">What We Track</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/15 flex items-center justify-center text-[#8b5cf6] shrink-0 text-sm font-bold">
                5.4K
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Markets Analyzed</h3>
                <p className="text-xs text-[#9ca3af]">
                  Every active prediction market, scored and ranked by alpha potential
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/15 flex items-center justify-center text-[#06b6d4] shrink-0 text-sm font-bold">
                500
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Smart Wallets Tracked</h3>
                <p className="text-xs text-[#9ca3af]">
                  Top-performing wallets monitored for position changes and consensus signals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e]/15 flex items-center justify-center text-[#22c55e] shrink-0 text-sm font-bold">
                AI
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Signal Arena Bots</h3>
                <p className="text-xs text-[#9ca3af]">
                  AI-powered trading bots competing in our Signal Arena — their consensus becomes your signal
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ef4444]/15 flex items-center justify-center text-[#ef4444] shrink-0 text-sm font-bold">
                24/7
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Continuous Analysis</h3>
                <p className="text-xs text-[#9ca3af]">
                  Markets are re-scored continuously as new data arrives — prices, volume, wallet activity
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white">How It Works</h2>
        <p>
          Our data pipeline is powered by{' '}
          <a
            href="https://tradesphere.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#06b6d4] hover:text-[#06b6d4]/80 transition-colors"
          >
            TradeSphere
          </a>
          , a prediction market intelligence API that tracks thousands of markets across
          multiple platforms. TradeSphere&apos;s AI analyzes every market for:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            <span className="text-white font-medium">Alpha Score</span> — a composite score measuring
            the divergence between market price and smart money consensus
          </li>
          <li>
            <span className="text-white font-medium">Smart Money Consensus</span> — which direction
            the highest-performing wallets are betting, and with how much conviction
          </li>
          <li>
            <span className="text-white font-medium">Opportunity Score</span> — combining alpha
            potential, liquidity, and time-to-expiry for actionable trade identification
          </li>
          <li>
            <span className="text-white font-medium">Wallet Scoring</span> — ranking wallets by
            historical accuracy, PnL, and consistency to separate signal from noise
          </li>
        </ul>

        <h2 className="text-xl font-bold text-white">PolyPulse vs. PolyFire</h2>
        <p>
          <strong className="text-white">PolyPulse</strong> is the intelligence layer — research,
          analysis, and education. You&apos;re reading it now.
        </p>
        <p>
          <strong className="text-white">
            <a
              href="https://polyfire.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
            >
              PolyFire
            </a>
          </strong>{' '}
          is the trading platform — a Telegram-based bot that lets you trade prediction markets
          directly, copy smart wallets, and subscribe to AI signals. PolyPulse surfaces the
          intelligence; PolyFire lets you act on it.
        </p>

        <h2 className="text-xl font-bold text-white">Our Approach</h2>
        <p>
          Prediction markets are the most efficient mechanism for aggregating human knowledge
          about future events. But raw market prices only tell part of the story. By layering
          wallet-level analysis, AI scoring, and cross-market pattern detection on top of
          price data, PolyPulse reveals the signals that the headline numbers miss.
        </p>
        <p>
          We don&apos;t tell you what to think. We show you what the smartest money in the room
          is doing, and let you draw your own conclusions.
        </p>

        <div className="border-t border-[#1f2937] pt-8 mt-8 text-xs text-[#9ca3af]/60">
          <p>
            PolyPulse does not provide financial advice. Prediction market data is presented
            for informational and educational purposes only. Always do your own research.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
  );
}
