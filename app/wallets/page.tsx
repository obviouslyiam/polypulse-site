import type { Metadata } from 'next';
import Link from 'next/link';
import wallets from '@/data/wallets.json';

export const metadata: Metadata = {
  title: 'Top 500 Prediction Market Wallets — Smart Money Leaderboard | PolyPulse',
  description:
    'Track the top 500 prediction market wallets ranked by AI-powered wallet scores. See PnL, volume, win rates, and copy the smartest traders on Polymarket.',
  openGraph: {
    title: 'Top 500 Prediction Market Wallets — Smart Money Leaderboard',
    description:
      'Track the top 500 prediction market wallets ranked by AI-powered wallet scores. See PnL, volume, win rates, and copy the smartest traders.',
  },
};

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

function formatCurrency(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getDisplayName(username: string | null, address: string): string {
  if (!username || username.length > 30 || username.includes(address.slice(2, 10))) {
    return truncateAddress(address);
  }
  return username;
}

const sorted = [...(wallets as Wallet[])].sort((a, b) => {
  if (a.rank !== b.rank) return a.rank - b.rank;
  return b.pnl - a.pnl;
});

export default function WalletsPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Top Prediction Market Wallets
          </h1>
          <p className="mt-4 text-lg text-[#9ca3af]">
            500+ wallets tracked and scored by AI. See who&apos;s winning.
          </p>
        </div>

        {/* Table — Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-[#1f2937]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1f2937] bg-[#111827]">
                <th className="px-4 py-3 font-medium text-[#9ca3af]">Rank</th>
                <th className="px-4 py-3 font-medium text-[#9ca3af]">Wallet</th>
                <th className="px-4 py-3 font-medium text-[#9ca3af] text-right">PnL</th>
                <th className="px-4 py-3 font-medium text-[#9ca3af] text-right">Volume</th>
                <th className="px-4 py-3 font-medium text-[#9ca3af] text-right">Score</th>
                <th className="px-4 py-3 font-medium text-[#9ca3af] text-right">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((w, i) => {
                const displayName = getDisplayName(w.username, w.walletAddress);
                const pnlColor = w.pnl >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]';
                const pnlSign = w.pnl >= 0 ? '+' : '';
                const winPct = w.win_rate !== null ? `${(w.win_rate * 100).toFixed(0)}%` : '—';

                return (
                  <tr
                    key={`${w.walletAddress}-${i}`}
                    className="border-b border-[#1f2937] hover:bg-[#1f2937]/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-[#9ca3af] font-mono text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/wallets/${w.walletAddress}`}
                        className="text-white hover:text-[#8b5cf6] transition-colors font-medium"
                      >
                        {displayName}
                      </Link>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-semibold ${pnlColor}`}>
                      {pnlSign}{formatCurrency(w.pnl)}
                    </td>
                    <td className="px-4 py-3 text-right text-[#9ca3af] font-mono">
                      {formatCurrency(w.volume)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-block bg-[#06b6d4]/15 text-[#06b6d4] text-xs font-bold px-2 py-0.5 rounded-md">
                        {w.wallet_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#9ca3af] font-mono">{winPct}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Card Grid — Mobile */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {sorted.map((w, i) => {
            const displayName = getDisplayName(w.username, w.walletAddress);
            const pnlColor = w.pnl >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]';
            const pnlSign = w.pnl >= 0 ? '+' : '';
            const winPct = w.win_rate !== null ? `${(w.win_rate * 100).toFixed(0)}%` : '—';

            return (
              <Link key={`${w.walletAddress}-${i}`} href={`/wallets/${w.walletAddress}`}>
                <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 hover:border-[#8b5cf6]/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#9ca3af] font-mono">#{i + 1}</span>
                    <span className="bg-[#06b6d4]/15 text-[#06b6d4] text-xs font-bold px-2 py-0.5 rounded-md">
                      {w.wallet_score}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1 truncate">{displayName}</div>
                  <div className={`text-lg font-bold ${pnlColor}`}>
                    {pnlSign}{formatCurrency(w.pnl)}
                  </div>
                  <div className="flex justify-between text-xs text-[#9ca3af] mt-2">
                    <span>Vol {formatCurrency(w.volume)}</span>
                    <span>Win {winPct}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
