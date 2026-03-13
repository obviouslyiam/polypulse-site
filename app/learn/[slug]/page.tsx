import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import guides from '@/data/guides.json';

type Guide = typeof guides[number];

export function generateStaticParams() {
  return guides.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find(g => g.slug === slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | PolyPulse`,
    description: guide.description,
  };
}

const categoryLabels: Record<string, string> = {
  basics: 'Getting Started',
  strategy: 'Trading Strategies',
  platforms: 'Platforms & Tools',
  advanced: 'Advanced Techniques',
  analysis: 'Market Analysis',
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find(g => g.slug === slug) as Guide | undefined;
  if (!guide) notFound();

  const cat = (guide as unknown as { category: string }).category;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-8">
        <Link href="/" className="hover:text-white no-underline text-[#9ca3af]">Home</Link>
        <span>/</span>
        <Link href="/learn" className="hover:text-white no-underline text-[#9ca3af]">Learn</Link>
        <span>/</span>
        <span className="text-white">{guide.title}</span>
      </nav>

      <div className="mb-6">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
          {categoryLabels[cat] || cat}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{guide.title}</h1>
      <p className="text-[#9ca3af] text-lg mb-10">{guide.description}</p>

      {guide.sections.map((section: { heading: string; content: string }, idx: number) => (
        <section key={idx} className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
          {section.content.split('\n\n').map((para: string, pIdx: number) => (
            <p key={pIdx} className="text-[#9ca3af] leading-relaxed mb-4">{para}</p>
          ))}
        </section>
      ))}

      {/* FAQ */}
      {guide.faqs && guide.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {guide.faqs.map((faq: { question: string; answer: string }, idx: number) => (
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
                mainEntity: guide.faqs.map((f: { question: string; answer: string }) => ({
                  '@type': 'Question',
                  name: f.question,
                  acceptedAnswer: { '@type': 'Answer', text: f.answer },
                })),
              }),
            }}
          />
        </section>
      )}

      {/* CTA */}
      <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Ready to Trade?</h3>
        <p className="text-[#9ca3af] mb-4">
          Apply what you&apos;ve learned. Trade prediction markets directly via Telegram with PolyFire.
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
