import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import type { KapitelConfig, ScannedImage } from '@/lib/types'

/**
 * Kapitel-Übersicht: Grid mit einer Karte pro Kapitel.
 * Jede Karte zeigt das Hero-Bild des Kapitels (falls vorhanden), Nummer, Titel, Untertitel.
 *
 * `heroMap`: kapitelSlug → ScannedImage|null (vom Server vorberechnet).
 */
export function ChapterGrid({
  kapitel,
  heroMap,
}: {
  kapitel: readonly KapitelConfig[]
  heroMap: Record<string, ScannedImage | null>
}) {
  return (
    <section className="mx-auto max-w-screen-2xl px-5 py-20 lg:px-10">
      <Reveal>
        <h2 className="mb-12 font-headline text-3xl font-bold tracking-tight text-ink-primary md:text-4xl">
          Kapitel
        </h2>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kapitel.map((k, i) => {
          const hero = heroMap[k.slug]
          return (
            <Reveal key={k.slug} delay={i * 0.08}>
              <Link
                href={`/kapitel/${k.slug}`}
                className="group block overflow-hidden rounded-lg border border-line bg-ocean-mid/40 transition-colors hover:border-wing/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ocean-mid">
                  {hero ? (
                    <Image
                      src={hero.dateipfad}
                      alt={hero.alt_text}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-6xl text-line">0{k.nummer}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-xs text-ink-primary/80">
                    Kapitel {k.nummer}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="flex items-center gap-2 font-headline text-xl font-bold text-ink-primary group-hover:text-wing transition-colors">
                    {k.titel}
                    <ArrowRight
                      className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </h3>
                  {k.untertitel && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{k.untertitel}</p>
                  )}
                  {k.lesezeit_minuten && (
                    <p className="mt-3 font-mono text-xs text-ink-muted/70">
                      {k.lesezeit_minuten} Min. Lesezeit
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
