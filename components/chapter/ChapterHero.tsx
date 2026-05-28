import Image from 'next/image'
import { siteConfig } from '@/site.config'
import type { KapitelConfig, ScannedImage } from '@/lib/types'

/**
 * Kapitel-Hero: grosses Bild + Nummer + Titel + Untertitel + Lesezeit.
 * Fallback: dunkler Gradient mit grosser Kapitel-Nummer wenn kein Hero-Bild da ist.
 */
export function ChapterHero({
  kapitel,
  heroImage,
}: {
  kapitel: KapitelConfig
  heroImage: ScannedImage | null
}) {
  return (
    <header className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      {heroImage ? (
        <Image
          src={heroImage.dateipfad}
          alt={heroImage.alt_text}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-ocean-mid to-ocean-deep">
          <span className="font-display text-[12rem] leading-none text-line">0{kapitel.nummer}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/50 to-ocean-deep/20" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-screen-2xl px-5 pb-12 lg:px-10">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-wing">
            Kapitel {kapitel.nummer}
          </p>
          <h1 className="mt-3 font-display text-6xl uppercase tracking-tight text-ink-primary md:text-8xl">
            {kapitel.titel}
          </h1>
          {kapitel.untertitel && (
            <p className="mt-4 max-w-2xl text-lg text-ink-primary/80">{kapitel.untertitel}</p>
          )}
          {kapitel.lesezeit_minuten && (
            <p className="mt-3 font-mono text-xs text-ink-muted">
              {kapitel.lesezeit_minuten} Min. Lesezeit · IDPA {siteConfig.idpaJahr}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}
