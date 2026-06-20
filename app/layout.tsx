import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Isaac — Frontend Engineer',
  description:
    'React · Next.js · TypeScript. Interfaces that feel fast, look sharp, and ship clean.',
  authors: [{ name: 'Isaac' }],
  openGraph: {
    title: 'Isaac — Frontend Engineer',
    description:
      'React · Next.js · TypeScript. Interfaces that feel fast, look sharp, and ship clean.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#060a14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="font-sans leading-relaxed">{children}</body>
    </html>
  );
}
