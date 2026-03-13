import type { Metadata } from 'next';
import Link from 'next/link';
import glossary from '@/data/glossary.json';

export const metadata: Metadata = {
  title: 'Prediction Market Glossary — 50+ Terms Defined | PolyPulse',
  description: 'Complete glossary of prediction market terms. From alpha scores to win rates, understand every concept you need to trade effectively.',
};

export default function GlossaryPage() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  const letters = [...new Set(sorted.map(t => t.term[0].toUpperCase()))].sort();

  const categoryColors: Record<string, string> = {
    trading: 'bg-purple-500/20 text-purple-400',
    markets: 'bg-cyan-500/20 text-cyan-400',
    analysis: 'bg-emerald-500/20 text-emerald-400',
    platforms: 'bg-amber-500/20 text-amber-400',
    risk: 'bg-rose-500/20 text-rose-400',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Prediction Market Glossary
      </h1>
      <p className="text-[#9ca3af] text-lg mb-8">
        {glossary.length} essential terms every prediction market trader should know.
      </p>

      {/* Letter nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {letters.map(letter => (
          <a key={letter} href={`#letter-${letter}`} className="px-3 py-1 rounded bg-[#111827] border border-[#1f2937] text-white text-sm hover:border-purple-500/50 no-underline">
            {letter}
          </a>
        ))}
      </div>

      {letters.map(letter => {
        const terms = sorted.filter(t => t.term[0].toUpperCase() === letter);
        return (
          <section key={letter} id={`letter-${letter}`} className="mb-8">
            <h2 className="text-xl font-bold text-purple-400 mb-4 border-b border-[#1f2937] pb-2">{letter}</h2>
            <div className="space-y-3">
              {terms.map(term => (
                <Link key={term.slug} href={`/glossary/${term.slug}`} className="no-underline block">
                  <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-4 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-semibold">{term.term}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[term.category] || ''}`}>
                        {term.category}
                      </span>
                    </div>
                    <p className="text-[#9ca3af] text-sm">{term.definition}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
