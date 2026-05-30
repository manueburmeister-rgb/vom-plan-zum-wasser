import Image from 'next/image'
import { getTeam } from '@/lib/content'
import { findImageById } from '@/lib/images'
import { siteConfig } from '@/site.config'
import type { ScannedImage } from '@/lib/types'

export const runtime = 'nodejs'

export const metadata = { title: 'Über uns' }

export default async function TeamPage() {
  const team = getTeam()

  // Fotos auflösen
  const fotos: Record<string, ScannedImage | null> = {}
  for (const m of team) {
    fotos[m.id] = m.foto_dateiname ? await findImageById(m.foto_dateiname, 'team') : null
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-10">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-wing">Über uns</p>
        <h1 className="mt-2 font-display text-5xl uppercase tracking-tight text-ink-primary md:text-7xl">
          Manue & Dimitri
        </h1>
      </header>

      <div className="grid gap-8 sm:grid-cols-2">
        {team.map(m => {
          const foto = fotos[m.id]
          const cleanRolle = m.rolle.startsWith('TODO') ? null : m.rolle
          const cleanBio = m.kurz_bio && !m.kurz_bio.startsWith('TODO') ? m.kurz_bio : null
          return (
            <div key={m.id} className="rounded-lg border border-line bg-ocean-mid/30 p-6">
              <div className="relative mb-5 aspect-square overflow-hidden rounded-lg bg-ocean-mid">
                {foto ? (
                  <Image
                    src={foto.dateipfad}
                    alt={`${m.vorname} ${m.nachname}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-6xl text-line">
                      {m.vorname[0]}
                      {m.nachname[0]}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="font-headline text-2xl font-bold text-ink-primary">
                {m.vorname} {m.nachname}
              </h2>
              {cleanRolle && <p className="mt-1 text-water">{cleanRolle}</p>}
              {cleanBio && <p className="mt-3 leading-relaxed text-ink-muted">{cleanBio}</p>}
            </div>
          )
        })}
      </div>

      {/* Schul-Info */}
      <div className="mt-12 rounded-lg border border-line bg-ocean-mid/30 p-6 text-center">
        <p className="text-ink-primary">{siteConfig.schule}</p>
        <p className="text-ink-muted">{siteConfig.klasse}</p>
        <p className="mt-2 text-sm text-ink-muted">
          Betreuung: {siteConfig.betreuung} · Abgabe: {siteConfig.abgabeFormatiert}
        </p>
      </div>
    </div>
  )
}
