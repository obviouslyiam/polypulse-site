import type { Metadata } from 'next';
import Link from 'next/link';
import wallets from '@/data/wallets.json';

interface Wallet {
  rank: number;
  walletAddress: string;
  username: string | null;
  pnl: number;
  volume: number;
  wallet_score: number;
  win_rate: number | null;
  total_resolved_trades: number;
  winning_trades: number;
}

const walletsData = wallets as Wallet[];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getDisplayName(username: string | null, address: string): string {
  if (!username || username.length > 30 || username.includes(address.slice(2, 10))) {
    return truncateAddress(address);
  }
  return username;
}

function formatDollars(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs).toLocaleString('en-US')}`;
  return `${sign}$${abs.toFixed(2)}`;
}

function formatFullDollars(v: number): string {
  const sign = v < 0 ? '-' : '';
  return `${sign}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(v: number | null): string {
  if (v === null) return 'N/A';
  return `${(v * 100).toFixed(1)}%`;
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Elite';
  if (score >= 60) return 'Strong';
  if (score >= 40) return 'Average';
  if (score >= 20) return 'Below Average';
  return 'Low';
}

// ---------------------------------------------------------------------------
// Analysis generator
// ---------------------------------------------------------------------------

function generateAnalysis(w: Wallet): string[] {
  const name = getDisplayName(w.username, w.walletAddress);
  const lines: string[] = [];

  // Profitability
  if (w.pnl > 100_000) {
    lines.push(
      `${name} is a highly profitable trader with ${formatFullDollars(w.pnl)} in total PnL. This places them among the top earners across all tracked prediction market wallets.`
    );
  } else if (w.pnl > 10_000) {
    lines.push(
      `${name} has generated solid returns of ${formatFullDollars(w.pnl)} in PnL, demonstrating consistent profitability in prediction markets.`
    );
  } else if (w.pnl > 0) {
    lines.push(
      `${name} is net-positive with ${formatFullDollars(w.pnl)} in PnL. While modest, staying profitable in prediction markets is harder than it looks.`
    );
  } else {
    lines.push(
      `${name} is currently in the red with ${formatFullDollars(w.pnl)} PnL. Prediction markets are volatile, and many traders go through drawdown periods before finding an edge.`
    );
  }

  // Efficiency — PnL / Volume
  if (w.volume > 0) {
    const efficiency = w.pnl / w.volume;
    if (efficiency > 0.1) {
      lines.push(
        `Trading efficiency is exceptional — generating ${(efficiency * 100).toFixed(1)}% return on ${formatDollars(w.volume)} volume. High PnL relative to volume suggests sharp, conviction-based bets rather than high-frequency grinding.`
      );
    } else if (efficiency > 0.02) {
      lines.push(
        `With ${formatDollars(w.volume)} in trading volume, this wallet achieves a ${(efficiency * 100).toFixed(2)}% return-on-volume ratio. This indicates a reasonably efficient trading strategy with selective market entries.`
      );
    } else {
      lines.push(
        `Volume is ${formatDollars(w.volume)} against ${formatDollars(w.pnl)} in PnL, yielding a thin ${(efficiency * 100).toFixed(2)}% return-on-volume. This pattern is common in high-frequency or market-making strategies where edge per trade is small but compounds.`
      );
    }
  } else {
    lines.push(
      `This wallet shows no recorded trading volume. PnL may come from resolved positions that pre-date our tracking window.`
    );
  }

  // Win rate
  if (w.win_rate !== null && w.total_resolved_trades > 0) {
    const pct = (w.win_rate * 100).toFixed(0);
    if (w.win_rate >= 0.65) {
      lines.push(
        `A ${pct}% win rate across ${w.total_resolved_trades} resolved trades is outstanding. ${name} demonstrates a strong ability to pick winning outcomes consistently.`
      );
    } else if (w.win_rate >= 0.50) {
      lines.push(
        `With a ${pct}% win rate over ${w.total_resolved_trades} resolved trades, ${name} wins more often than not. Combined with proper position sizing, this can compound into significant returns.`
      );
    } else {
      lines.push(
        `The ${pct}% win rate across ${w.total_resolved_trades} trades is below the breakeven threshold. Profitability despite a low win rate typically means this trader sizes winning positions larger than losers.`
      );
    }
  } else if (w.total_resolved_trades === 0) {
    lines.push(
      `No resolved trades recorded yet. This wallet may have open positions that haven't settled, or trades that pre-date our tracking window.`
    );
  } else {
    lines.push(
      `Win rate data is unavailable for this wallet. Resolved trades exist (${w.total_resolved_trades}) but outcome data is pending.`
    );
  }

  // Wallet score
  const label = scoreLabel(w.wallet_score);
  lines.push(
    `PolyPulse's AI assigns this wallet a score of ${w.wallet_score}/100 (${label}). The score factors in PnL, volume, win rate, trade consistency, and market diversity to gauge overall trading ability.`
  );

  return lines;
}

// ---------------------------------------------------------------------------
// FAQ generator
// ---------------------------------------------------------------------------

function generateFaq(w: Wallet) {
  const name = getDisplayName(w.username, w.walletAddress);
  return [
    {
      question: `How profitable is ${name}?`,
      answer:
        w.pnl > 0
          ? `${name} has earned ${formatFullDollars(w.pnl)} in profit from prediction market trading, making them a net-profitable wallet in our tracking database of 500+ wallets.`
          : `${name} is currently at ${formatFullDollars(w.pnl)} PnL. Not all prediction market traders are profitable — the markets are competitive and require a strong edge.`,
    },
    {
      question: `What is ${name}'s win rate?`,
      answer:
        w.win_rate !== null && w.total_resolved_trades > 0
          ? `${name} has a ${(w.win_rate * 100).toFixed(1)}% win rate across ${w.total_resolved_trades} resolved trades, with ${w.winning_trades} winning positions.`
          : `Win rate data is not yet available for ${name}. This could mean their positions are still open or that trade data is still being processed.`,
    },
    {
      question: `Should I copy ${name}'s trades?`,
      answer: `Past performance does not guarantee future results. ${name}'s wallet score is ${w.wallet_score}/100 (${scoreLabel(w.wallet_score)}). Review their full stats, consider your risk tolerance, and never invest more than you can afford to lose. You can copy trade any wallet on PolyFire.`,
    },
    {
      question: `How is the wallet score calculated?`,
      answer: `PolyPulse's AI wallet score (0–100) evaluates multiple factors: total PnL, trading volume, win rate, trade consistency, market diversity, and position sizing. A higher score indicates stronger all-around trading ability across prediction markets.`,
    },
    {
      question: `How to copy trade this wallet?`,
      answer: `You can copy ${name}'s trades automatically through PolyFire, a Telegram-based trading bot. Open PolyFire, search for the wallet address, enable copy trading, set your position size, and every future trade this wallet makes will be mirrored in your account.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return walletsData.map((w) => ({ address: w.walletAddress }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}): Promise<Metadata> {
  const { address } = await params;
  const wallet = walletsData.find((w) => w.walletAddress === address);
  if (!wallet) {
    return { title: 'Wallet Not Found | PolyPulse' };
  }
  const name = getDisplayName(wallet.username, wallet.walletAddress);
  return {
    title: `${name} — Prediction Market Wallet Profile | PolyPulse`,
    description: `${name} has ${formatFullDollars(wallet.pnl)} PnL, ${formatDollars(wallet.volume)} volume, and a ${wallet.wallet_score}/100 wallet score. View full trading stats and copy their trades.`,
    openGraph: {
      title: `${name} — Wallet Profile`,
      description: `PnL: ${formatFullDollars(wallet.pnl)} | Score: ${wallet.wallet_score}/100 | Win Rate: ${formatPercent(wallet.win_rate)}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function WalletProfilePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const wallet = walletsData.find((w) => w.walletAddress === address);

  if (!wallet) {
    return (
      <main className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Wallet Not Found</h1>
          <p className="text-[#9ca3af] mb-6">
            The wallet address you&apos;re looking for doesn&apos;t exist in our database.
          </p>
          <Link href="/wallets" className="text-[#8b5cf6] hover:underline">
            Back to Wallets Leaderboard
          </Link>
        </div>
      </main>
    );
  }

  const displayName = getDisplayName(wallet.username, wallet.walletAddress);
  const pnlColor = wallet.pnl >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]';
  const analysis = generateAnalysis(wallet);
  const faq = generateFaq(wallet);

  const stats = [
    {
      label: 'PnL',
      value: formatFullDollars(wallet.pnl),
      colorClass: pnlColor,
    },
    {
      label: 'Volume',
      value: formatFullDollars(wallet.volume),
      colorClass: 'text-white',
    },
    {
      label: 'Wallet Score',
      value: `${wallet.wallet_score} / 100`,
      colorClass: 'text-[#06b6d4]',
    },
    {
      label: 'Win Rate',
      value: formatPercent(wallet.win_rate),
      colorClass: 'text-white',
    },
    {
      label: 'Total Trades',
      value: wallet.total_resolved_trades.toLocaleString('en-US'),
      colorClass: 'text-white',
    },
    {
      label: 'Winning Trades',
      value: wallet.winning_trades.toLocaleString('en-US'),
      colorClass: 'text-[#22c55e]',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-[#0a0f1a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumbs — inline */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-[#9ca3af]">
              <li>
                <Link href="/" className="hover:text-[#8b5cf6] transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1f2937]">/</span>
                <Link href="/wallets" className="hover:text-[#8b5cf6] transition-colors">
                  Wallets
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1f2937]">/</span>
                <span className="text-white">{displayName}</span>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 bg-[#8b5cf6]/15 text-[#8b5cf6] text-xs font-bold px-3 py-1 rounded-full">
                Rank #{wallet.rank}
              </span>
            </div>
            <p className="text-sm text-[#9ca3af] font-mono break-all">{wallet.walletAddress}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111827] border border-[#1f2937] rounded-xl p-4"
              >
                <div className="text-xs text-[#9ca3af] uppercase tracking-wide mb-1">
                  {stat.label}
                </div>
                <div className={`text-lg font-bold ${stat.colorClass} sm:text-xl`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Analysis */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Wallet Analysis</h2>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 space-y-4">
              {analysis.map((paragraph, i) => (
                <p key={i} className="text-[#d1d5db] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* CTA — Copy Trade */}
          <div className="mb-10 bg-gradient-to-r from-[#8b5cf6]/20 to-[#06b6d4]/20 border border-[#8b5cf6]/30 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-2">
              Copy {displayName}&apos;s Trades on PolyFire
            </h3>
            <p className="text-[#9ca3af] text-sm mb-4">
              Automatically mirror this wallet&apos;s prediction market trades via our Telegram bot.
            </p>
            <a
              href="https://t.me/Poly_Fire_Bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Start Copy Trading
            </a>
          </div>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#111827] border border-[#1f2937] rounded-xl p-5"
                >
                  <h3 className="text-white font-semibold mb-2">{item.question}</h3>
                  <p className="text-[#d1d5db] text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter CTA */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-2">
              Get Smart Money Alerts
            </h3>
            <p className="text-[#9ca3af] text-sm mb-4">
              Join the PolyPulse newsletter for weekly wallet insights, top trades, and prediction market alpha.
            </p>
            <a
              href="https://t.me/Poly_Fire_Bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#06b6d4] hover:bg-[#0891b2] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Subscribe on Telegram
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
