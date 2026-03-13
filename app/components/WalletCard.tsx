import Link from 'next/link';

interface WalletCardProps {
  walletAddress: string;
  username: string;
  pnl: number;
  volume: number;
  wallet_score: number;
  win_rate: number;
}

function formatCurrency(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getDisplayName(username: string, address: string): string {
  if (!username || username.length > 30 || username.includes(address.slice(2, 10))) {
    return truncateAddress(address);
  }
  return username;
}

export default function WalletCard({
  walletAddress,
  username,
  pnl,
  volume,
  wallet_score,
  win_rate,
}: WalletCardProps) {
  const displayName = getDisplayName(username, walletAddress);
  const pnlColor = pnl >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]';
  const pnlSign = pnl >= 0 ? '+' : '';
  const winRatePct = (win_rate * 100).toFixed(0);

  return (
    <Link href={`/wallets/${walletAddress}`}>
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 hover:border-[#06b6d4]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#06b6d4]/5 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-medium text-white truncate flex-1">
            {displayName}
          </h3>
          <span className="shrink-0 bg-[#06b6d4]/15 text-[#06b6d4] text-xs font-bold px-2 py-1 rounded-md">
            {wallet_score}
          </span>
        </div>

        <div className={`text-lg font-bold mb-3 ${pnlColor}`}>
          {pnlSign}{formatCurrency(pnl)}
        </div>

        <div className="flex items-center justify-between text-xs text-[#9ca3af] mt-auto">
          <span>Vol {formatCurrency(volume)}</span>
          <span>Win {winRatePct}%</span>
        </div>
      </div>
    </Link>
  );
}
