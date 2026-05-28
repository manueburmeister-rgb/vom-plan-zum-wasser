import { getAllImages } from '@/lib/images'
import { getKapitel } from '@/lib/content'
import { GalerieClient } from './GalerieClient'

export const runtime = 'nodejs'

export const metadata = { title: 'Galerie' }

export default async function GaleriePage() {
  const all = await getAllImages()
  // Nur Bilder mit Kapitel-Zuordnung, keine Videos
  const images = all.filter(
    img => img.zugehoeriges_kapitel_slug && !img.dateipfad.toLowerCase().endsWith('.mp4') && !img.ausblenden
  )
  const kapitel = getKapitel().map(k => ({ slug: k.slug, titel: k.titel, nummer: k.nummer }))

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-16 lg:px-10">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-wing">Galerie</p>
        <h1 className="mt-2 font-display text-5xl uppercase tracking-tight text-ink-primary md:text-7xl">
          Alle Bilder
        </h1>
        <p className="mt-3 text-ink-muted">{images.length} Aufnahmen aus dem gesamten Projekt</p>
      </header>

      <GalerieClient images={images} kapitel={kapitel} />
    </div>
  )
}
