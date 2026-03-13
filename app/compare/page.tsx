import type { Metadata } from 'next';
import Link from 'next/link';
import comparisons from '@/data/comparisons.json';

export const metadata: Metadata = {
  title: 'Prediction Market Comparisons — Head-to-Head Analysis | PolyPulse',
  description: 'Compare prediction market platforms, strategies, market types, and concepts side-by-side. Data-driven verdicts to help you make better trading decisions.',
};

const categoryLabels: Record<string, string> = {
  platforms: 'Platforms',
  strategies: 'Strategies',
  markets: 'Market Types',
  concepts: 'Concepts',
};

const categoryColors: Record<string, string> = {
  platforms: 'bg-cyan-500/20 text-cyan-400',
  strategies: 'bg-purple-500/20 text-purple-400',
  markets: 'bg-emerald-500/20 text-emerald-400',
  concepts: 'bg-amber-500/20 text-amber-400',
};

export default function ComparePage() {
  const grouped: Record<string, typeof comparisons> = {};
  for (const comp of comparisons) {
    const cat = (comp as { category: string }).category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(comp);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Prediction Market Comparisons
      </h1>
      <p className="text-[#9ca3af] text-lg mb-10 max-w-3xl">
        {comparisons.length} head-to-head comparisons with data-driven verdicts. Stop guessing — see how platforms, strategies, and market types stack up.
      </p>

      {Object.entries(categoryLabels).map(([cat, label]) => (
        <section key={cat} className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[cat]}`}>
              {label}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(grouped[cat] || []).map((comp) => (
              <Link key={comp.slug} href={`/compare/${comp.slug}`} className="no-underline">
                <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-5 hover:border-purple-500/50 transition-colors h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white font-semibold text-sm">{(comp as { itemA: string }).itemA}</span>
                    <span className="text-purple-400 text-xs font-bold">VS</span>
                    <span className="text-white font-semibold text-sm">{(comp as { itemB: string }).itemB}</span>
                  </div>
                  <p className="text-[#9ca3af] text-xs leading-relaxed">{comp.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
