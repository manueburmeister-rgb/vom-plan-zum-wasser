import type { Metadata, Viewport } from 'next'
import { fontDisplay, fontHeadline, fontBody, fontMono } from '@/lib/fonts'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'
import { GrainOverlay } from '@/components/shared/GrainOverlay'
import { ScrollProgress } from '@/components/shared/ScrollProgress'
import { siteConfig } from '@/site.config'
import '../styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.title} — ${siteConfig.subtitle}`,
    template: `%s — ${siteConfig.title}`,
  },
  description: siteConfig.description,
  // Bewusst nicht in Suchmaschinen — Direkt-Link only.
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: `${siteConfig.title} — ${siteConfig.subtitle}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    images: [
      {
        url: '/images/hero/titelbild.jpg',
        width: 1920,
        height: 1080,
        alt: `${siteConfig.title} — Titelbild`,
      },
    ],
    locale: 'de_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.title} — ${siteConfig.subtitle}`,
    description: siteConfig.description,
    images: ['/images/hero/titelbild.jpg'],
  },
  authors: siteConfig.autoren.map(a => ({ name: `${a.vorname} ${a.nachname}` })),
  creator: siteConfig.autoren.map(a => `${a.vorname} ${a.nachname}`).join(', '),
  // Verhindert dass Browser den noch leeren OG-Bildpfad cachen
  other: {
    'theme-color': siteConfig.colors.oceanDeep,
  },
}

export const viewport: Viewport = {
  themeColor: siteConfig.colors.oceanDeep,
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${fontDisplay.variable} ${fontHeadline.variable} ${fontBody.variable} ${fontMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ocean-deep font-body text-ink-primary antialiased">
        <GrainOverlay />
        <ScrollProgress />
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
