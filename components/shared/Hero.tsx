'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { siteConfig } from '@/site.config'

/**
 * Vollbild-Cinematic-Hero.
 *   - Titelbild als Hintergrund mit sanftem Parallax beim Scrollen
 *   - Animierter Display-Titel (staggered fade-in)
 *   - Pinker Subtitle, Meta-Block
 *   - Scroll-Hinweis-Pfeil (fade-in nach Verzögerung)
 *   - Fallback: dunkler Gradient + Wordmark falls Titelbild fehlt
 *
 * Das Titelbild liegt unter /public/images/hero/titelbild.png und wird
 * als Prop `heroImage` übergeben (Pfad + Dimensionen aus dem Scanner),
 * oder null wenn nicht vorhanden.
 */
export function Hero({
  heroImage,
}: {
  heroImage: { dateipfad: string; breite_px: number; hoehe_px: number } | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [showCue, setShowCue] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Parallax: Bild bewegt sich langsamer als der Scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '25%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])

  useEffect(() => {
    const t = setTimeout(() => setShowCue(true), 2000)
    return () => clearTimeout(t)
  }, [])

  const autorenString = siteConfig.autoren.map(a => `${a.vorname} ${a.nachname}`).join(' und ')

  const titleWords = ['VOM', 'PLAN', 'ZUM', 'WASSER']

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden flex items-center justify-center"
    >
      {/* Hintergrund */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        {heroImage ? (
          <Image
            src={heroImage.dateipfad}
            alt="Titelbild — Hydrofoil"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-ocean-mid to-ocean-deep" />
        )}
      </motion.div>

      {/* Dunkles Overlay für Lesbarkeit */}
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-b from-ocean-deep/70 via-ocean-deep/40 to-ocean-deep"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-20 px-5 text-center max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-ink-primary/80 mb-6"
        >
          IDPA {siteConfig.idpaJahr}
        </motion.p>

        <h1 className="font-display uppercase leading-[0.9] text-ink-primary text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight">
          {titleWords.map((word, i) => (
            <motion.span
              key={word}
              className="inline-block mr-[0.25em] last:mr-0"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-6 font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide text-wing"
        >
          {siteConfig.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 space-y-1 text-sm text-ink-primary/70"
        >
          <p>
            {siteConfig.schule} · {siteConfig.klasse}
          </p>
          <p className="text-ink-primary">IDPA von {autorenString}</p>
          <p>
            Betreuung: {siteConfig.betreuung} · Abgabe: {siteConfig.abgabeFormatiert}
          </p>
        </motion.div>
      </div>

      {/* Scroll-Cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showCue ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-7 w-7 text-ink-primary/60" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  )
}
