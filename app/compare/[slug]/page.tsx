import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import comparisons from '@/data/comparisons.json';

type Comparison = typeof comparisons[number];

export function generateStaticParams() {
  return comparisons.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comp = comparisons.find(c => c.slug === slug);
  if (!comp) return {};
  return {
    title: `${comp.title} | PolyPulse`,
    description: comp.description,
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comp = comparisons.find(c => c.slug === slug) as Comparison | undefined;
  if (!comp) notFound();

  const c = comp as unknown as {
    title: string;
    description: string;
    itemA: string;
    itemB: string;
    category: string;
    sections: { heading: string; content: string }[];
    verdict: string;
    faqs: { question: string; answer: string }[];
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-8">
        <Link href="/" className="hover:text-white no-underline text-[#9ca3af]">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-white no-underline text-[#9ca3af]">Compare</Link>
        <span>/</span>
        <span className="text-white">{c.itemA} vs {c.itemB}</span>
      </nav>

      <div className="flex items-center gap-3 mb-6">
        <span className="px-4 py-2 rounded-lg bg-[#111827] border border-[#1f2937] text-white font-bold">
          {c.itemA}
        </span>
        <span className="text-purple-400 font-bold text-lg">VS</span>
        <span className="px-4 py-2 rounded-lg bg-[#111827] border border-[#1f2937] text-white font-bold">
          {c.itemB}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{c.title}</h1>
      <p className="text-[#9ca3af] text-lg mb-10">{c.description}</p>

      {c.sections.map((section, idx) => (
        <section key={idx} className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
          {section.content.split('\n\n').map((para, pIdx) => (
            <p key={pIdx} className="text-[#9ca3af] leading-relaxed mb-4">{para}</p>
          ))}
        </section>
      ))}

      {/* Verdict */}
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6 mb-10">
        <h2 className="text-xl font-bold text-emerald-400 mb-3">Our Verdict</h2>
        <p className="text-white leading-relaxed">{c.verdict}</p>
      </div>

      {/* FAQ */}
      {c.faqs && c.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">FAQ</h2>
          <div className="space-y-4">
            {c.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-[#1f2937] bg-[#111827] p-5">
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: c.faqs.map(f => ({
                  '@type': 'Question',
                  name: f.question,
                  acceptedAnswer: { '@type': 'Answer', text: f.answer },
                })),
              }),
            }}
          />
        </section>
      )}

      <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Trade Prediction Markets</h3>
        <p className="text-[#9ca3af] mb-4">
          Copy top wallets, get AI signals, and trade 5,400+ markets on PolyFire.
        </p>
        <a
          href="https://t.me/Poly_Fire_Bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors no-underline"
        >
          Start Trading on PolyFire
        </a>
      </div>
    </div>
  );
}
