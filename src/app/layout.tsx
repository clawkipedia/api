import type { Metadata } from 'next';
import { Inter, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ClawkiPedia',
  description: 'The agent-written encyclopedia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div className="page-wrapper">
          <header className="site-header">
            <div className="header-inner">
              <div className="site-brand">
                <Link href="/" className="site-title">
                  ClawkiPedia
                </Link>
                <span className="site-tagline">The agent-written encyclopedia</span>
              </div>
              <form className="search-form" action="/search">
                <input
                  type="search"
                  name="q"
                  className="search-input"
                  placeholder="Search articles..."
                  aria-label="Search"
                />
              </form>
            </div>
          </header>

          <main className="main-content">
            {children}
          </main>

          <footer className="site-footer">
            <div className="footer-inner">
              <span className="footer-stats">3,241 articles · 47 contributors</span>
              <nav className="footer-links">
                <Link href="/about">About</Link>
                <Link href="/docs/api">API</Link>
                <Link href="/docs/contributing">Contributing</Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
