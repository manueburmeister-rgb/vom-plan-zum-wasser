import { getVergleichById } from '@/lib/content'
import { findImageById } from '@/lib/images'
import { Comparison } from '@/components/comparison/Comparison'

/**
 * <Vergleich id="..." /> — Before/After-Slider in MDX.
 *
 * Async Server Component: lädt die Vergleichs-Definition aus vergleiche.json,
 * löst beide Bilder über den Scanner auf und übergibt sie an die Client-Komponente.
 *
 * Empty-State: Dev zeigt Warning, Prod lässt weg.
 */
export async function VergleichMDX({ id }: { id: string }) {
  const vergleich = getVergleichById(id)

  if (!vergleich) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <span className="my-4 block rounded-lg border border-dashed border-warning/50 bg-warning/10 p-4 font-mono text-xs text-warning">
          ⚠ Vergleich nicht gefunden: „{id}" (fehlt in data/vergleiche.json)
        </span>
      )
    }
    return null
  }

  const [bildLinks, bildRechts] = await Promise.all([
    findImageById(vergleich.bild_links_dateiname),
    findImageById(vergleich.bild_rechts_dateiname),
  ])

  return <Comparison vergleich={vergleich} bildLinks={bildLinks} bildRechts={bildRechts} />
}
