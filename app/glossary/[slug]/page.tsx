import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import glossary from '@/data/glossary.json';

type Term = typeof glossary[number];

export function generateStaticParams() {
  return glossary.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = glossary.find(t => t.slug === slug);
  if (!term) return {};
  return {
    title: `${term.term} — Prediction Market Term Explained | PolyPulse`,
    description: term.definition,
  };
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = glossary.find(t => t.slug === slug) as Term | undefined;
  if (!term) notFound();

  const relatedTerms = (term.relatedTerms || [])
    .map((s: string) => glossary.find(t => t.slug === s))
    .filter(Boolean) as Term[];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-8">
        <Link href="/" className="hover:text-white no-underline text-[#9ca3af]">Home</Link>
        <span>/</span>
        <Link href="/glossary" className="hover:text-white no-underline text-[#9ca3af]">Glossary</Link>
        <span>/</span>
        <span className="text-white">{term.term}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{term.term}</h1>

      <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-6 mb-8">
        <p className="text-white text-lg leading-relaxed">{term.definition}</p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">In Depth</h2>
        {term.extendedDefinition.split('\n\n').map((para: string, idx: number) => (
          <p key={idx} className="text-[#9ca3af] leading-relaxed mb-4">{para}</p>
        ))}
      </section>

      {relatedTerms.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Related Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {relatedTerms.map((rt) => (
              <Link key={rt.slug} href={`/glossary/${rt.slug}`} className="no-underline">
                <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-4 hover:border-purple-500/50 transition-colors">
                  <h3 className="text-white font-semibold text-sm mb-1">{rt.term}</h3>
                  <p className="text-[#9ca3af] text-xs">{rt.definition}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: term.term,
            description: term.definition,
            inDefinedTermSet: {
              '@type': 'DefinedTermSet',
              name: 'Prediction Market Glossary',
              url: 'https://polypulse.xyz/glossary',
            },
          }),
        }}
      />

      <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-8 text-center mt-10">
        <h3 className="text-xl font-bold text-white mb-2">See It in Action</h3>
        <p className="text-[#9ca3af] mb-4">
          Trade prediction markets with real-time smart money signals on PolyFire.
        </p>
        <a
          href="https://t.me/Poly_Fire_Bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors no-underline"
        >
          Open PolyFire
        </a>
      </div>
    </div>
  );
}
