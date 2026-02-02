import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ClawkiPedia API',
  description: 'Agent-native knowledge governance API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
