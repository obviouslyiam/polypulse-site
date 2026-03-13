import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'PolyPulse — Prediction Market Intelligence',
  description:
    'AI-powered prediction market analysis and signals. 5,400+ markets analyzed, smart money consensus tracking, and weekly intelligence reports.',
  metadataBase: new URL('https://polypulse.xyz'),
  openGraph: {
    title: 'PolyPulse — Prediction Market Intelligence',
    description:
      'AI-powered prediction market analysis and signals. 5,400+ markets analyzed, smart money consensus tracking, and weekly intelligence reports.',
    siteName: 'PolyPulse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PolyPulse — Prediction Market Intelligence',
    description:
      'AI-powered prediction market analysis and signals. 5,400+ markets analyzed.',
  },
};

const navLinks = [
  { href: '/markets', label: 'Markets' },
  { href: '/wallets', label: 'Wallets' },
  { href: '/categories', label: 'Categories' },
  { href: '/learn', label: 'Learn' },
  { href: '/newsletter', label: 'Newsletter' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-sm border-b border-[#1f2937]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-1 text-xl font-bold">
                <span className="text-[#8b5cf6]">Poly</span>
                <span className="text-white">Pulse</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-[#9ca3af] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {/* Mobile nav toggle placeholder */}
              <button className="md:hidden text-[#9ca3af] hover:text-white" aria-label="Menu">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[#1f2937] bg-[#0a0f1a] mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-1 text-lg font-bold mb-3">
                  <span className="text-[#8b5cf6]">Poly</span>
                  <span className="text-white">Pulse</span>
                </div>
                <p className="text-sm text-[#9ca3af] max-w-sm mb-4">
                  Prediction market intelligence powered by AI analysis. Track smart money,
                  discover alpha, and stay ahead of the markets.
                </p>
                <p className="text-xs text-[#9ca3af]/60">
                  Powered by{' '}
                  <a
                    href="https://tradesphere.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#06b6d4]/70 hover:text-[#06b6d4] transition-colors"
                  >
                    TradeSphere
                  </a>{' '}
                  data
                </p>
              </div>

              {/* Navigation */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Explore</h4>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#9ca3af] hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* More */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">More</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/about"
                      className="text-sm text-[#9ca3af] hover:text-white transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://polyfire.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#9ca3af] hover:text-white transition-colors"
                    >
                      PolyFire Trading
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://tradesphere.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#9ca3af] hover:text-white transition-colors"
                    >
                      TradeSphere API
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#1f2937] mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#9ca3af]/60">
                &copy; 2026 PolyPulse. All rights reserved. Not financial advice.
              </p>
              <p className="text-xs text-[#9ca3af]/60">
                Market data provided for informational purposes only.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
