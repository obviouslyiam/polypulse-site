'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1f2937]/30 transition-colors"
            >
              <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-[#8b5cf6] shrink-0 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
              <div>
                <div className="px-5 pb-5 text-sm text-[#9ca3af] leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
