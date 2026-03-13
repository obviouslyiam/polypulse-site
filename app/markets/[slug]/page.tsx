import type { Metadata } from 'next';
import Link from 'next/link';
import markets from '@/data/markets.json';
import categories from '@/data/categories.json';

type Market = (typeof markets)[number];

const categoryMap = Object.fromEntries(
  (categories as { slug: string; name: string }[]).map((c) => [c.slug, c.name])
);

/* ------------------------------------------------------------------ */
/*  Static generation                                                  */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return markets.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const market = markets.find((m) => m.slug === slug);
  if (!market)
    return { title: 'Market Not Found — PolyPulse' };

  const desc = `Smart money consensus: ${formatDirection(market.consensusDirection)} (${market.consensusStrength.toFixed(0)}% strength). Alpha score: ${market.marketAlphaScore ?? 'N/A'}. Current odds: YES ${pct(market.yesPrice)} / NO ${pct(market.noPrice)}.`;

  return {
    title: `${market.question} — Market Analysis & Smart Money Consensus | PolyPulse`,
    description: desc,
    openGraph: {
      title: `${market.question} — PolyPulse Analysis`,
      description: desc,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pct(v: number | null): string {
  if (v == null) return '--';
  return `${(v * 100).toFixed(1)}%`;
}

function formatVolume(v: number | null): string {
  if (v == null) return '--';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function formatUsd(v: number | null): string {
  if (v == null) return '--';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function formatDirection(dir: string): string {
  switch (dir) {
    case 'STRONG_YES': return 'Strong YES';
    case 'LEAN_YES':   return 'Lean YES';
    case 'STRONG_NO':  return 'Strong NO';
    case 'LEAN_NO':    return 'Lean NO';
    default:           return 'Split';
  }
}

function directionColor(dir: string): string {
  if (dir.includes('YES')) return 'text-[#22c55e]';
  if (dir.includes('NO'))  return 'text-[#ef4444]';
  return 'text-[#9ca3af]';
}

function alphaGradient(score: number | null): string {
  if (score == null) return 'from-[#1f2937] to-[#1f2937]';
  if (score >= 80) return 'from-[#22c55e] to-[#16a34a]';
  if (score >= 60) return 'from-[#eab308] to-[#ca8a04]';
  if (score >= 40) return 'from-[#f97316] to-[#ea580c]';
  return 'from-[#ef4444] to-[#dc2626]';
}

function alphaLabel(score: number | null): string {
  if (score == null) return 'Insufficient Data';
  if (score >= 80) return 'Very High Alpha';
  if (score >= 60) return 'High Alpha';
  if (score >= 40) return 'Moderate Alpha';
  if (score >= 20) return 'Low Alpha';
  return 'Minimal Alpha';
}

function opportunityLabel(score: number | null): string {
  if (score == null) return 'Unrated';
  if (score >= 60) return 'Strong Opportunity';
  if (score >= 45) return 'Moderate Opportunity';
  if (score >= 30) return 'Mild Opportunity';
  return 'Low Opportunity';
}

function liquidityLevel(liq: number): string {
  if (liq >= 100_000) return 'Deep liquidity — easy to enter and exit positions';
  if (liq >= 25_000) return 'Moderate liquidity — suitable for most position sizes';
  if (liq >= 5_000) return 'Thin liquidity — may experience slippage on larger orders';
  return 'Very thin liquidity — trade with caution, significant slippage risk';
}

/* ------------------------------------------------------------------ */
/*  Narrative generators                                               */
/* ------------------------------------------------------------------ */

function generateAnalysis(m: Market): string[] {
  const paragraphs: string[] = [];

  // Smart money direction
  const smDir = m.smartMoneyDirection;
  const smCount = m.smartMoneyCount;
  const smSize = m.totalSmartMoneySize;
  const smSizeStr = formatUsd(smSize);

  if (smCount > 0) {
    if (smDir === 'STRONG YES') {
      paragraphs.push(
        `Smart money is decisively bullish on this market. ${smCount} tracked wallets with a history of profitable trades have taken positions totaling ${smSizeStr}, overwhelmingly favoring YES. This level of conviction from informed traders is notable — when this many smart wallets align on one side, it often signals information or analysis the broader market hasn't fully priced in.`
      );
    } else if (smDir === 'STRONG NO') {
      paragraphs.push(
        `Smart money is firmly positioned against this outcome. ${smCount} tracked wallets have deployed ${smSizeStr} in total, with the overwhelming majority betting NO. When sophisticated traders cluster this heavily on one side, it typically reflects deeper analysis or information advantages that haven't been fully absorbed by the market.`
      );
    } else {
      paragraphs.push(
        `Smart money is divided on this market. ${smCount} tracked wallets have placed ${smSizeStr} in total positions, but without a clear directional consensus. A split among informed traders often indicates genuine uncertainty — this market may be closer to a coin flip than the current prices suggest.`
      );
    }
  }

  // Consensus edge
  const edge = m.consensusEdge;
  const yesPrice = m.yesPrice;
  const noPrice = m.noPrice;

  if (edge != null && edge > 0) {
    const edgePct = (edge * 100).toFixed(1);
    const consensusDir = formatDirection(m.consensusDirection);

    if (edge >= 0.15) {
      paragraphs.push(
        `The consensus edge is ${edgePct}% — a substantial gap between the current market price and where smart money analysis suggests the true probability lies. With the market pricing YES at ${pct(yesPrice)} and the ${consensusDir} consensus, there's a meaningful divergence that could represent a trading opportunity. Edges this large don't persist indefinitely; they either correct as the market catches up, or the smart money thesis proves wrong.`
      );
    } else if (edge >= 0.05) {
      paragraphs.push(
        `The consensus edge sits at ${edgePct}%, indicating a moderate gap between market pricing and smart money sentiment. YES is currently at ${pct(yesPrice)} while the ${consensusDir} consensus suggests the market hasn't fully adjusted to the information smart wallets are acting on. This edge is meaningful but not extreme.`
      );
    } else {
      paragraphs.push(
        `The consensus edge is a narrow ${edgePct}%, meaning smart money and the market are largely in agreement. The current YES price of ${pct(yesPrice)} is close to where informed traders think it should be. In tight-edge markets, transaction costs and timing become more critical factors.`
      );
    }
  }

  // Risk/reward
  if (yesPrice != null && noPrice != null) {
    const yP = yesPrice;
    const nP = noPrice;

    if (yP < 0.2) {
      paragraphs.push(
        `At ${pct(yesPrice)} for YES, this is a high-payout longshot. A YES resolution would return roughly ${(1 / yP).toFixed(1)}x on the investment. The asymmetry is attractive — you don't need to be right often on these to profit, but the base rate of sub-20% events resolving YES is low. Consider position sizing accordingly.`
      );
    } else if (yP > 0.8) {
      paragraphs.push(
        `With YES priced at ${pct(yesPrice)}, this is a high-probability market with limited upside. A YES win returns only ${((1 / yP - 1) * 100).toFixed(0)}% on capital. The real opportunity may be on the NO side if you believe the market is overestimating the likelihood of this outcome. At ${pct(noPrice)} for NO, a correct contrarian bet returns ${(1 / nP).toFixed(1)}x.`
      );
    } else {
      paragraphs.push(
        `The market is relatively balanced with YES at ${pct(yesPrice)} and NO at ${pct(noPrice)}. A YES resolution returns ${(1 / yP).toFixed(2)}x while a NO resolution returns ${(1 / nP).toFixed(2)}x. In balanced markets like this, the edge from smart money consensus becomes the primary decision driver rather than raw payout asymmetry.`
      );
    }
  }

  // Time pressure
  const days = m.daysToExpiry;
  if (days != null) {
    if (days <= 3) {
      paragraphs.push(
        `This market expires in ${days} day${days === 1 ? '' : 's'} — resolution is imminent. Short-dated markets tend to have the most accurate pricing since most information is already known. Any remaining edge is likely small, but the rapid time decay means positions resolve quickly with minimal holding risk.`
      );
    } else if (days <= 14) {
      paragraphs.push(
        `With ${days} days until expiry, this is a short-duration trade. The compressed timeline limits exposure to black swan events but also means the market is likely well-informed. Position conviction should be high at this stage.`
      );
    } else if (days <= 60) {
      paragraphs.push(
        `${days} days remain until this market resolves. This medium-term horizon gives time for the smart money thesis to play out, but also introduces event risk. Markets this far from expiry can see significant price swings as new information emerges.`
      );
    } else {
      paragraphs.push(
        `This is a longer-dated market with ${days} days to resolution. While the annualized return potential can look attractive, extended timelines come with significant uncertainty. Smart money positions taken this far out reflect high-conviction views, but a lot can change.`
      );
    }
  }

  // Volume context
  const vol = m.volume;
  if (vol != null) {
    if (vol >= 1_000_000) {
      paragraphs.push(
        `With ${formatVolume(vol)} in total volume, this is a heavily-traded market with strong price discovery. High-volume markets tend to be more efficiently priced, making any remaining smart money edge particularly significant — it's harder to find alpha in liquid markets.`
      );
    } else if (vol >= 100_000) {
      paragraphs.push(
        `Total trading volume of ${formatVolume(vol)} puts this in the moderately active tier. There's enough price discovery for the odds to be somewhat reliable, but not so much that alpha opportunities are completely arbitraged away.`
      );
    } else if (vol != null) {
      paragraphs.push(
        `At ${formatVolume(vol)} in volume, this market has seen limited trading activity. Lower-volume markets can offer larger edges but come with execution risk — wide spreads and thin order books may make it difficult to enter or exit at desired prices.`
      );
    }
  }

  return paragraphs;
}

function generateFAQs(m: Market): { q: string; a: string }[] {
  const qText = m.question;
  const catName = categoryMap[m.category] ?? m.category;

  return [
    {
      q: `What are the current odds for "${qText}"?`,
      a: `As of the latest data, the market prices YES at ${pct(m.yesPrice)} and NO at ${pct(m.noPrice)}. This means the market-implied probability of this outcome is ${pct(m.yesPrice)}. ${m.volume != null ? `The market has seen ${formatVolume(m.volume)} in trading volume.` : ''}`,
    },
    {
      q: `What does smart money think about "${qText}"?`,
      a: `Smart money consensus is ${formatDirection(m.consensusDirection)} with ${m.consensusStrength.toFixed(0)}% strength. ${m.smartMoneyCount} tracked wallets — traders with a history of profitable predictions — have taken positions totaling ${formatUsd(m.totalSmartMoneySize)}. Their overall direction is ${m.smartMoneyDirection}.`,
    },
    {
      q: `Is "${qText}" a good trading opportunity?`,
      a: `This market has an opportunity score of ${m.opportunityScore ?? 'N/A'} out of 72 and an alpha score of ${m.marketAlphaScore ?? 'N/A'} out of 100. ${m.consensusEdge != null ? `The consensus edge — the gap between market price and smart money valuation — is ${(m.consensusEdge * 100).toFixed(1)}%.` : ''} ${m.annualizedReturn != null ? `The annualized return potential is ${m.annualizedReturn.toFixed(0)}%.` : ''} As with all prediction markets, past smart money performance does not guarantee future results.`,
    },
    {
      q: `When does this ${catName.toLowerCase()} market resolve?`,
      a: `This market is scheduled to resolve on ${m.endDate ? new Date(m.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'a date to be determined'}. ${m.daysToExpiry != null ? `That's ${m.daysToExpiry} day${m.daysToExpiry === 1 ? '' : 's'} from the time of analysis.` : ''}`,
    },
    {
      q: `How liquid is the "${qText}" market?`,
      a: `The market has ${formatUsd(m.liquidity)} in liquidity. ${liquidityLevel(m.liquidity)} ${m.volume != null ? `Total volume traded is ${formatVolume(m.volume)}, which provides additional context on market activity.` : ''}`,
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Inline components                                                  */
/* ------------------------------------------------------------------ */

function StatBox({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4">
      <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-xl font-bold ${color ?? 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-[#9ca3af] mt-0.5">{sub}</p>}
    </div>
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
/*  JSON-LD                                                            */
/* ------------------------------------------------------------------ */

function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function MarketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const market = markets.find((m) => m.slug === slug);

  if (!market) {
    return (
      <main className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Market Not Found
          </h1>
          <Link
            href="/markets"
            className="text-[#8b5cf6] hover:underline"
          >
            Back to Markets
          </Link>
        </div>
      </main>
    );
  }

  const catName = categoryMap[market.category] ?? market.category;
  const analysis = generateAnalysis(market);
  const faqs = generateFAQs(market);
  const consensus = formatDirection(market.consensusDirection);
  const consColor = directionColor(market.consensusDirection);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqs)),
        }}
      />

      <main className="min-h-screen bg-[#0a0f1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[#9ca3af]">
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
                <Link
                  href={`/markets/category/${market.category}`}
                  className="hover:text-[#8b5cf6] transition-colors"
                >
                  {catName}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1f2937]">/</span>
                <span className="text-white line-clamp-1">
                  {market.question}
                </span>
              </li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight">
            {market.question}
          </h1>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            <StatBox
              label="YES Price"
              value={pct(market.yesPrice)}
              color="text-[#22c55e]"
            />
            <StatBox
              label="NO Price"
              value={pct(market.noPrice)}
              color="text-[#ef4444]"
            />
            <StatBox
              label="Volume"
              value={formatVolume(market.volume)}
            />
            <StatBox
              label="Liquidity"
              value={formatUsd(market.liquidity)}
            />
            <StatBox
              label="Days to Expiry"
              value={market.daysToExpiry != null ? `${market.daysToExpiry}` : '--'}
              sub={
                market.endDate
                  ? new Date(market.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : undefined
              }
            />
          </div>

          {/* Alpha Score */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Alpha Score</h2>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
              <div className="flex items-center gap-6">
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${alphaGradient(market.marketAlphaScore)} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-3xl font-black text-white">
                    {market.marketAlphaScore ?? '—'}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white mb-1">
                    {alphaLabel(market.marketAlphaScore)}
                  </p>
                  <p className="text-sm text-[#9ca3af] leading-relaxed">
                    The Alpha Score measures the divergence between market price
                    and smart money positioning on a 0-100 scale. Higher scores
                    indicate larger gaps between what the market thinks and what
                    informed traders are betting on.
                  </p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mt-5">
                <div className="w-full h-2 rounded-full bg-[#1f2937] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${alphaGradient(market.marketAlphaScore)} transition-all`}
                    style={{
                      width: `${market.marketAlphaScore ?? 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-[#9ca3af]">
                  <span>0 — Low</span>
                  <span>50 — Moderate</span>
                  <span>100 — Very High</span>
                </div>
              </div>
            </div>
          </section>

          {/* Smart Money Consensus */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              Smart Money Consensus
            </h2>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
                    Direction
                  </p>
                  <p className={`text-lg font-bold ${consColor}`}>
                    {consensus}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
                    Strength
                  </p>
                  <p className="text-lg font-bold text-white">
                    {market.consensusStrength.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
                    Edge
                  </p>
                  <p className="text-lg font-bold text-[#8b5cf6]">
                    {market.consensusEdge != null
                      ? `${(market.consensusEdge * 100).toFixed(1)}%`
                      : '--'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
                    Smart Wallets
                  </p>
                  <p className="text-lg font-bold text-white">
                    {market.smartMoneyCount}
                  </p>
                </div>
              </div>

              {/* Strength bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-1">
                  <span>NO Consensus</span>
                  <span>Split</span>
                  <span>YES Consensus</span>
                </div>
                <div className="relative w-full h-3 rounded-full bg-[#1f2937] overflow-hidden">
                  {/* Center line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#9ca3af]/30" />
                  {/* Indicator */}
                  <div
                    className={`absolute top-0 bottom-0 rounded-full ${
                      market.consensusDirection.includes('YES')
                        ? 'bg-[#22c55e]'
                        : market.consensusDirection.includes('NO')
                          ? 'bg-[#ef4444]'
                          : 'bg-[#9ca3af]'
                    }`}
                    style={{
                      left: market.consensusDirection.includes('NO')
                        ? `${50 - market.consensusStrength / 2}%`
                        : '50%',
                      width: `${market.consensusStrength / 2}%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-sm text-[#9ca3af] mt-4 leading-relaxed">
                Total smart money volume: {formatUsd(market.totalSmartMoneySize)}{' '}
                across {market.smartMoneyCount} wallet{market.smartMoneyCount !== 1 ? 's' : ''}.
                Direction: <span className="font-medium text-white">{market.smartMoneyDirection}</span>.
              </p>
            </div>
          </section>

          {/* Market Analysis */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              Market Analysis
            </h2>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 space-y-4">
              {analysis.map((p, i) => (
                <p
                  key={i}
                  className="text-[#d1d5db] text-sm leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* Trading Opportunity Assessment */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              Trading Opportunity
            </h2>
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="text-center p-4 rounded-lg bg-[#0a0f1a]">
                  <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
                    Opportunity Score
                  </p>
                  <p className="text-2xl font-bold text-[#8b5cf6]">
                    {market.opportunityScore ?? '--'}
                    <span className="text-sm font-normal text-[#9ca3af]">
                      /72
                    </span>
                  </p>
                  <p className="text-xs text-[#9ca3af] mt-1">
                    {opportunityLabel(market.opportunityScore)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-[#0a0f1a]">
                  <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
                    Annualized Return
                  </p>
                  <p className="text-2xl font-bold text-[#22c55e]">
                    {market.annualizedReturn != null
                      ? `${market.annualizedReturn.toFixed(0)}%`
                      : '--'}
                  </p>
                  <p className="text-xs text-[#9ca3af] mt-1">
                    If consensus is correct
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-[#0a0f1a]">
                  <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
                    Liquidity
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatUsd(market.liquidity)}
                  </p>
                  <p className="text-xs text-[#9ca3af] mt-1">
                    Available depth
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#9ca3af] leading-relaxed">
                {market.opportunityScore != null && market.opportunityScore >= 50
                  ? `This market scores in the top tier for trading opportunity. The combination of smart money edge, market liquidity, and time to expiry makes it worth close attention. ${market.annualizedReturn != null && market.annualizedReturn >= 100 ? `The annualized return of ${market.annualizedReturn.toFixed(0)}% is attractive if the smart money consensus proves correct.` : ''}`
                  : market.opportunityScore != null && market.opportunityScore >= 30
                    ? `This market presents a moderate trading opportunity. The edge exists but is balanced against factors like liquidity constraints or lower conviction in the consensus. Position sizing should reflect the moderate confidence level.`
                    : `Current metrics suggest limited trading opportunity in this market. The edge may be too small, the timeline too long, or the liquidity too thin to warrant a high-conviction position. Monitor for changes in smart money positioning.`}
              </p>
            </div>
          </section>

          {/* Trade CTA */}
          <section className="mb-10">
            <a
              href="https://t.me/Poly_Fire_Bot"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] rounded-xl p-6 text-center hover:opacity-90 transition-opacity"
            >
              <p className="text-xl font-bold text-white mb-2">
                Trade This Market on PolyFire
              </p>
              <p className="text-white/80 text-sm mb-4">
                Copy smart money trades automatically. One-click execution via
                Telegram.
              </p>
              <span className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur rounded-lg text-white font-semibold text-sm hover:bg-white/20 transition-colors">
                Open PolyFire Bot &rarr;
              </span>
            </a>
          </section>

          {/* FAQ Section */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              Frequently Asked Questions
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
    </>
  );
}
