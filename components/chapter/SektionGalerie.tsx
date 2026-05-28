import { getImagesForSektion } from '@/lib/images'
import { Gallery } from '@/components/gallery/Gallery'

/**
 * Automatische Sektions-Galerie.
 * Async Server Component: holt alle Bilder einer Sektion (via Sub-Ordner) und zeigt sie als Grid.
 * Wenn keine Bilder vorhanden: rendert nichts (kein Fehler).
 *
 * `sektionId` ist z.B. "realisierung#backwing".
 */
export async function SektionGalerie({ sektionId }: { sektionId: string }) {
  const images = await getImagesForSektion(sektionId)
  if (images.length === 0) return null

  return (
    <div className="mt-6">
      <Gallery images={images} columns={3} />
    </div>
  )
}
