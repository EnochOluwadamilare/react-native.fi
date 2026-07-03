import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google';
import * as React from 'react';

import '@/styles/globals.css';

import { siteConfig } from '@/constant/config';

// Display face — chunky, characterful grotesque (Marimekko/Unikko direction)
const fontDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

// Body face — humanist, readable, decidedly not Inter
const fontBody = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  manifest: `/favicon/site.webmanifest`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontBody.variable}`}
    >
      <head>
        <link rel='alternate' hrefLang='en' href={`${siteConfig.url}/en`} />
        <link rel='alternate' hrefLang='fi' href={`${siteConfig.url}/fi`} />
        <link
          rel='alternate'
          hrefLang='x-default'
          href={`${siteConfig.url}/en`}
        />
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
