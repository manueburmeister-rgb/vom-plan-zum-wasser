/**
 * Build-time Validation der Stammdaten und Datei-Referenzen.
 *
 * Modi:
 *   - Lenient (default): Warnings ins Terminal, Build läuft durch
 *   - Strict: bei jedem Issue exit(1) → für finalen Check vor Abgabe
 *     Umschalten via siteConfig.features.STRICT_VALIDATION
 *
 * Aufruf:
 *   pnpm validate
 *
 * Was wird geprüft:
 *   1. Kapitel-MDX-Dateien existieren
 *   2. Kapitel-Bildordner existieren
 *   3. Alle Stammdaten-JSONs sind valides JSON
 *   4. image-overrides.json (falls vorhanden) ist valides JSON
 *   5. Vergleiche referenzieren existierende Bilder im Index
 */

import fs from 'node:fs'
import path from 'node:path'
import { siteConfig } from '../site.config'
import { getAllImages } from './images'

interface ValidationIssue {
  level: 'error' | 'warning'
  area: string
  message: string
}

const PROJECT_ROOT = process.cwd()
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content')
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const KAPITEL_DIR = path.join(CONTENT_DIR, 'kapitel')
const PUBLIC_IMAGES = path.join(PROJECT_ROOT, 'public', 'images')

async function validate(): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = []

  // === 1. Kapitel-MDX-Dateien & Bildordner ===
  for (const k of siteConfig.kapitel) {
    const mdxFilename = `${String(k.nummer).padStart(2, '0')}-${k.slug}.mdx`
    const mdxPath = path.join(KAPITEL_DIR, mdxFilename)
    if (!fs.existsSync(mdxPath)) {
      issues.push({
        level: 'warning',
        area: 'kapitel',
        message: `MDX-Datei fehlt für Kapitel "${k.titel}": ${path.relative(PROJECT_ROOT, mdxPath)}`,
      })
    }
    const folderPath = path.join(PUBLIC_IMAGES, k.bilder_ordner)
    if (!fs.existsSync(folderPath)) {
      issues.push({
        level: 'warning',
        area: 'kapitel',
        message: `Bildordner fehlt für Kapitel "${k.titel}": ${path.relative(PROJECT_ROOT, folderPath)}`,
      })
    }
  }

  // === 2. Stammdaten-JSONs ===
  const stammdaten = [
    { file: 'glossar.json', dir: CONTENT_DIR },
    { file: 'phasen.json', dir: CONTENT_DIR },
    { file: 'team.json', dir: CONTENT_DIR },
    { file: 'stats.json', dir: CONTENT_DIR },
    { file: 'reflexionen.json', dir: CONTENT_DIR },
    { file: 'vergleiche.json', dir: DATA_DIR },
  ] as const

  for (const { file, dir } of stammdaten) {
    const p = path.join(dir, file)
    if (!fs.existsSync(p)) {
      issues.push({
        level: 'warning',
        area: 'stammdaten',
        message: `Datei fehlt: ${path.relative(PROJECT_ROOT, p)}`,
      })
      continue
    }
    try {
      JSON.parse(fs.readFileSync(p, 'utf8'))
    } catch (e) {
      issues.push({
        level: 'error',
        area: 'stammdaten',
        message: `Ungültiges JSON in ${file}: ${(e as Error).message}`,
      })
    }
  }

  // === 3. Overrides ===
  const overridesPath = path.join(DATA_DIR, 'image-overrides.json')
  if (fs.existsSync(overridesPath)) {
    try {
      JSON.parse(fs.readFileSync(overridesPath, 'utf8'))
    } catch (e) {
      issues.push({
        level: 'error',
        area: 'overrides',
        message: `Ungültiges JSON in image-overrides.json: ${(e as Error).message}`,
      })
    }
  }

  // === 4. Vergleiche referenzieren existierende Bilder ===
  try {
    const verglPath = path.join(DATA_DIR, 'vergleiche.json')
    if (fs.existsSync(verglPath)) {
      const verglRaw = fs.readFileSync(verglPath, 'utf8')
      let vergleiche: Array<{
        id: string
        bild_links_dateiname: string
        bild_rechts_dateiname: string
      }> = []
      try {
        vergleiche = JSON.parse(verglRaw)
      } catch {
        // bereits oben als error gemeldet
      }

      if (vergleiche.length > 0) {
        const allImages = await getAllImages()
        const idsAvailable = new Set(allImages.map(i => i.id))

        for (const v of vergleiche) {
          // TODO-Templates überspringen (deren Dateinamen beginnen mit "TODO-")
          for (const file of [v.bild_links_dateiname, v.bild_rechts_dateiname]) {
            if (file.startsWith('TODO-')) continue
            const base = file.replace(/\.[^.]+$/, '')
            if (!idsAvailable.has(base)) {
              issues.push({
                level: 'warning',
                area: 'vergleiche',
                message: `Vergleich "${v.id}" referenziert Bild "${file}" — nicht im Image-Index gefunden.`,
              })
            }
          }
        }
      }
    }
  } catch (e) {
    issues.push({
      level: 'warning',
      area: 'vergleiche',
      message: `Konnte Vergleiche nicht prüfen: ${(e as Error).message}`,
    })
  }

  return issues
}

async function main() {
  const strict = siteConfig.features.STRICT_VALIDATION
  console.log(`[validate] mode: ${strict ? 'STRICT' : 'lenient'}\n`)

  const issues = await validate()

  for (const i of issues) {
    const prefix = i.level === 'error' ? '✗' : '⚠'
    console.log(`${prefix} [${i.area}] ${i.message}`)
  }

  const errors = issues.filter(i => i.level === 'error').length
  const warnings = issues.filter(i => i.level === 'warning').length
  console.log(`\n[validate] ${errors} Fehler, ${warnings} Warnungen`)

  if (errors > 0) {
    process.exit(1)
  }
  if (strict && issues.length > 0) {
    console.error('[validate] STRICT-Modus aktiv und Issues vorhanden → exit(1)')
    process.exit(1)
  }
}

main().catch(e => {
  console.error('[validate] unerwarteter Fehler:', e)
  process.exit(1)
})
