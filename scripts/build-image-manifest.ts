/**
 * Build-Zeit-Image-Scanner.
 *
 * Wird vor `next build` aufgerufen. Scannt /public/images, schreibt die
 * Image-Liste nach /lib/image-manifest.json.
 *
 * Zur Laufzeit (Production) liest `getAllImages()` aus diesem Manifest,
 * statt das Dateisystem zu scannen. Dadurch landen die Bilder NICHT in der
 * Serverless Function (Vercel-Limit: 300 MB pro Function).
 */

import * as fs from 'fs'
import * as path from 'path'
// Dev-Modus erzwingen, damit getAllImages live scannt (statt eine evtl. leere
// Manifest-Datei zu lesen).
;(process.env as { NODE_ENV?: string }).NODE_ENV = 'development'

import { getAllImages } from '../lib/images'

async function main() {
  const start = Date.now()
  const all = await getAllImages()
  const ms = Date.now() - start

  const outPath = path.join(process.cwd(), 'lib', 'image-manifest.json')
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2), 'utf8')

  console.log(`[build-image-manifest] ${all.length} Bild(er) in ${ms}ms gescannt`)
  console.log(`[build-image-manifest] geschrieben nach lib/image-manifest.json`)
}

main().catch(err => {
  console.error('[build-image-manifest] FEHLER:', err)
  process.exit(1)
})
