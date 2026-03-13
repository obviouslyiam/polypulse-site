import type { Metadata } from 'next';
import Link from 'next/link';
import guides from '@/data/guides.json';

export const metadata: Metadata = {
  title: 'Learn Prediction Markets — 50+ Guides & Strategies | PolyPulse',
  description: 'Master prediction market trading with 50+ in-depth guides covering basics, strategies, platforms, advanced techniques, and market analysis.',
};

const categoryLabels: Record<string, string> = {
  basics: 'Getting Started',
  strategy: 'Trading Strategies',
  platforms: 'Platforms & Tools',
  advanced: 'Advanced Techniques',
  analysis: 'Market Analysis',
};

const categoryColors: Record<string, string> = {
  basics: 'bg-emerald-500/20 text-emerald-400',
  strategy: 'bg-purple-500/20 text-purple-400',
  platforms: 'bg-cyan-500/20 text-cyan-400',
  advanced: 'bg-amber-500/20 text-amber-400',
  analysis: 'bg-rose-500/20 text-rose-400',
};

export default function LearnPage() {
  const grouped: Record<string, typeof guides> = {};
  for (const guide of guides) {
    const cat = (guide as { category: string }).category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(guide);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Learn Prediction Markets
      </h1>
      <p className="text-[#9ca3af] text-lg mb-10 max-w-3xl">
        {guides.length}+ in-depth guides covering everything from your first trade to advanced smart money analysis.
        Whether you&apos;re new to prediction markets or refining your edge, start here.
      </p>

      {Object.entries(categoryLabels).map(([cat, label]) => (
        <section key={cat} className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[cat]}`}>
              {label}
            </span>
            <span className="text-[#9ca3af] text-sm font-normal">
              {grouped[cat]?.length || 0} guides
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(grouped[cat] || []).map((guide) => (
              <Link key={guide.slug} href={`/learn/${guide.slug}`} className="no-underline">
                <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-5 hover:border-purple-500/50 transition-colors h-full">
                  <h3 className="text-white font-semibold mb-2 text-sm">{guide.title}</h3>
                  <p className="text-[#9ca3af] text-xs leading-relaxed">{guide.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
