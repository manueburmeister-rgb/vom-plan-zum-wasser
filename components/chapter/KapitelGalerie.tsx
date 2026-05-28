import { getImagesForKapitel } from '@/lib/images'
import { Gallery } from '@/components/gallery/Gallery'

/**
 * Automatische Kapitel-Galerie.
 * Async Server Component: holt ALLE Bilder eines Kapitels (egal welche Sektion) und zeigt sie als Grid.
 * Gedacht für Kapitel ohne Sektionen (z.B. Praxistest), wo alle Bilder direkt im Ordner liegen.
 *
 * `kapitelSlug` ist z.B. "praxistest".
 */
export async function KapitelGalerie({ kapitelSlug }: { kapitelSlug: string }) {
  const images = await getImagesForKapitel(kapitelSlug)
  if (images.length === 0) return null

  return (
    <div className="mt-6">
      <Gallery images={images} columns={3} />
    </div>
  )
}
