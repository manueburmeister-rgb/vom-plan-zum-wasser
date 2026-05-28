import Image from 'next/image'
import { findImageById } from '@/lib/images'

/**
 * <Bild name="..." sektion="..." /> — Inline-Bild in MDX.
 *
 * Async Server Component: löst das Bild über den Scanner auf.
 *   - `name`: Dateiname (mit oder ohne Endung)
 *   - `sektion`: optionaler Sub-Ordner zum Eingrenzen (z.B. "backwing")
 *
 * Empty-State:
 *   - Dev (NODE_ENV !== production): sichtbare Warning-Box
 *   - Prod: still weggelassen (Build-Warning kommt aus validate.ts)
 */
export async function BildMDX({ name, sektion }: { name: string; sektion?: string }) {
  const img = await findImageById(name, sektion)

  if (!img) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <span className="my-4 block rounded-lg border border-dashed border-warning/50 bg-warning/10 p-4 font-mono text-xs text-warning">
          ⚠ Bild nicht gefunden: „{name}"{sektion ? ` (Sektion: ${sektion})` : ''}
        </span>
      )
    }
    return null
  }

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg border border-line">
        <Image
          src={img.dateipfad}
          alt={img.alt_text}
          width={img.breite_px || 1600}
          height={img.hoehe_px || 1200}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full"
        />
      </div>
      {img.bildunterschrift && (
        <figcaption className="mt-3 text-sm text-ink-muted">{img.bildunterschrift}</figcaption>
      )}
    </figure>
  )
}
