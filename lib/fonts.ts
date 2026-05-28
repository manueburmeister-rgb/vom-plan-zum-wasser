import { Bebas_Neue, Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'

/**
 * Display-Font: Bebas Neue.
 *
 * Hinweis: Google Fonts bietet Bebas Neue nur in Weight 400 (Regular) an.
 * Das ist für den Hero-Display und H1 völlig ausreichend — Hierarchie via Grösse.
 *
 * Falls mehrere Weights gewünscht sind ("Bebas Neue Pro"):
 *   1. Lizenz beim Foundry kaufen (https://www.fontfabric.com/fonts/bebas-neue/)
 *   2. WOFF2-Dateien in /public/fonts/ ablegen
 *   3. Diese Datei umstellen auf `next/font/local` mit src-Array
 */
export const fontDisplay = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

/** Headline-Font: Space Grotesk — technisch, modern, kontrastiert die Display-Schrift */
export const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-headline',
  display: 'swap',
})

/** Body-Font: Inter — höchste Lesbarkeit für lange Texte */
export const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

/** Mono-Font: JetBrains Mono — technische Daten, Spezifikationen */
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
