/**
 * List-Images-CLI.
 *
 * Listet alle vom Scanner (lib/images.ts) erkannten Bilder,
 * gruppiert nach Kapitel und Sektion.
 *
 * Aufruf:
 *   pnpm list-images
 *
 * Nützlich zum Verifizieren dass Ordner-Struktur und Slug-Ableitung stimmen.
 */

import { getAllImages, getOrphanImages } from '../lib/images'

async function main() {
  const all = await getAllImages()
  console.log(`\n[list-images] ${all.length} Bild(er) gefunden\n`)

  const byKapitel = new Map<string, typeof all>()
  for (const img of all) {
    if (!img.zugehoeriges_kapitel_slug) continue
    const arr = byKapitel.get(img.zugehoeriges_kapitel_slug) ?? []
    arr.push(img)
    byKapitel.set(img.zugehoeriges_kapitel_slug, arr)
  }

  // Sortierte Ausgabe nach Kapitel-Slug
  const sortedSlugs = Array.from(byKapitel.keys()).sort()
  for (const slug of sortedSlugs) {
    const images = byKapitel.get(slug)!
    console.log(`▸ ${slug} (${images.length})`)

    const bySektion = new Map<string, typeof all>()
    for (const img of images) {
      const key = img.zugehoerige_sektion_id ?? '(direkt im Kapitel)'
      const arr = bySektion.get(key) ?? []
      arr.push(img)
      bySektion.set(key, arr)
    }

    const sortedSekIds = Array.from(bySektion.keys()).sort()
    for (const sekId of sortedSekIds) {
      const sekImgs = bySektion.get(sekId)!
      console.log(`  ${sekId}`)
      for (const img of sekImgs) {
        const dim = img.breite_px && img.hoehe_px ? `${img.breite_px}×${img.hoehe_px}` : '?'
        console.log(`    - ${img.id} (${dim})`)
      }
    }
    console.log()
  }

  // Orphans
  const orphans = await getOrphanImages()
  if (orphans.length > 0) {
    console.log(`⚠ ${orphans.length} Bild(er) ohne Kapitel-Zuordnung:`)
    for (const img of orphans) {
      console.log(`  - ${img.dateipfad}`)
    }
  }
}

main().catch(e => {
  console.error('[list-images] Fehler:', e)
  process.exit(1)
})
