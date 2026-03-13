import Link from 'next/link';

interface MarketCardProps {
  slug: string;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  marketAlphaScore: number;
  consensusDirection: string;
  consensusEdge?: number;
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function getConsensusLabel(direction: string): { label: string; color: string; arrow: string } {
  switch (direction) {
    case 'STRONG_YES':
      return { label: 'Strong Yes', color: 'text-[#22c55e]', arrow: '\u2191\u2191' };
    case 'YES':
      return { label: 'Yes', color: 'text-[#22c55e]', arrow: '\u2191' };
    case 'STRONG_NO':
      return { label: 'Strong No', color: 'text-[#ef4444]', arrow: '\u2193\u2193' };
    case 'NO':
      return { label: 'No', color: 'text-[#ef4444]', arrow: '\u2193' };
    default:
      return { label: 'Neutral', color: 'text-[#9ca3af]', arrow: '\u2194' };
  }
}

export default function MarketCard({
  slug,
  question,
  yesPrice,
  noPrice,
  volume,
  marketAlphaScore,
  consensusDirection,
}: MarketCardProps) {
  const consensus = getConsensusLabel(consensusDirection);
  const yesPct = (yesPrice * 100).toFixed(0);
  const noPct = (noPrice * 100).toFixed(0);

  return (
    <Link href={`/markets/${slug}`}>
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 hover:border-[#8b5cf6]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#8b5cf6]/5 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 flex-1">
            {question}
          </h3>
          <span className="shrink-0 bg-[#8b5cf6]/15 text-[#8b5cf6] text-xs font-bold px-2 py-1 rounded-md">
            {marketAlphaScore}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4 mt-auto">
          <div className="flex-1 bg-[#0a0f1a] rounded-lg p-2 text-center">
            <div className="text-xs text-[#9ca3af] mb-0.5">Yes</div>
            <div className="text-sm font-bold text-[#22c55e]">{yesPct}&#162;</div>
          </div>
          <div className="flex-1 bg-[#0a0f1a] rounded-lg p-2 text-center">
            <div className="text-xs text-[#9ca3af] mb-0.5">No</div>
            <div className="text-sm font-bold text-[#ef4444]">{noPct}&#162;</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#9ca3af]">
          <span className={`font-medium ${consensus.color}`}>
            {consensus.arrow} {consensus.label}
          </span>
          <span>Vol {formatVolume(volume)}</span>
        </div>
      </div>
    </Link>
  );
}
