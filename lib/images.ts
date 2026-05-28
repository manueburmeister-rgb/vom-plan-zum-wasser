/**
 * Image Scanner — rekursive Erkennung aller Bilder unter /public/images/.
 *
 * Architektur:
 *   - Scannt rekursiv /public/images/ und mapped Top-Level-Ordnernamen ("04-realisierung") auf Kapitel-Slugs ("realisierung")
 *   - Sub-Ordnernamen mappen auf Sektionen ("backwing" → "realisierung#backwing")
 *   - alt_text wird aus dem Dateinamen auto-generiert mit Abkürzungs-Korrekturen (CAD, CNC, NACA, ...)
 *   - Breite/Höhe via sharp gelesen, gecacht in lib/image-cache.json über mtime-Vergleich
 *   - Overrides aus data/image-overrides.json werden draufgelegt
 *
 * Performance:
 *   - Production: einmaliger Scan beim Build, danach in-memory memoized
 *   - Development: re-scan bei jedem Aufruf (damit neu eingelegte Bilder ohne Restart sichtbar werden)
 *   - mtime-Cache wird in beiden Modi genutzt (vermeidet wiederholte sharp-Reads bei unveränderten Files)
 *
 * Runtime:
 *   - Nur Node.js (verwendet fs, sharp). Pages die Scanner-Output konsumieren:
 *     export const runtime = 'nodejs'
 */

import fs from 'node:fs'
import path from 'node:path'
import { siteConfig } from '@/site.config'
import type {
  ImageOverride,
  ImageOverrides,
  ImageCache,
  ScannedImage,
} from './types'

// ===========================================================================
// Pfade & Konstanten
// ===========================================================================

const PROJECT_ROOT = process.cwd()
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images')
const CACHE_FILE = path.join(PROJECT_ROOT, 'lib', 'image-cache.json')
const OVERRIDES_FILE = path.join(PROJECT_ROOT, 'data', 'image-overrides.json')

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

// Top-Level-Ordner, die KEINE Kapitel sind. Werden bei der Slug-Pattern-Validation übersprungen.
const NON_CHAPTER_FOLDERS: ReadonlySet<string> = new Set<string>(siteConfig.nonChapterFolders)

/** Abkürzungen, die im alt_text gross geschrieben werden */
const KNOWN_ABBREVIATIONS: Record<string, string> = {
  cad: 'CAD',
  cnc: 'CNC',
  '3d': '3D',
  idpa: 'IDPA',
  naca: 'NACA',
  bm2tv: 'BM2TV',
  cfk: 'CFK',
  fdm: 'FDM',
  pla: 'PLA',
  abs: 'ABS',
}

/** Eigennamen, die mit Initial-Cap geschrieben werden (auch wenn nicht am Wortanfang) */
const KNOWN_PROPER_NOUNS = new Set([
  'manue',
  'dimitri',
  'michael',
  'fabio',
  'lenzlinger',
  'burmeister',
  'muehlebach',
  'frontwing',
  'backwing',
  'fuselage',
])

// ===========================================================================
// Slug-Ableitung & Filename-Heuristiken
// ===========================================================================

/**
 * Wandelt Ordnernamen "04-realisierung" → "realisierung".
 * Returnt null wenn Ordner nicht dem NN-slug-Pattern entspricht (→ Warning).
 */
function deriveKapitelSlug(folder: string): string | null {
  const match = folder.match(/^(\d{1,3})-(.+)$/)
  return match ? match[2] : null
}

/**
 * Auto-Generierung des alt-Texts aus dem Dateinamen.
 *   "backwingmold-in-cad-andere-seite" → "Backwingmold in CAD andere seite"
 *   "beim-praxistest-montiert-manue"   → "Beim Praxistest montiert Manue"
 */
function autoAltText(filenameWithoutExt: string): string {
  const words = filenameWithoutExt.split('-')
  return words
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (KNOWN_ABBREVIATIONS[lower]) return KNOWN_ABBREVIATIONS[lower]
      if (KNOWN_PROPER_NOUNS.has(lower)) {
        return lower.charAt(0).toUpperCase() + lower.slice(1)
      }
      if (index === 0) {
        return lower.charAt(0).toUpperCase() + lower.slice(1)
      }
      return lower
    })
    .join(' ')
}

// ===========================================================================
// Cache & Overrides (File I/O)
// ===========================================================================

let cacheState: ImageCache | null = null

function loadCache(): ImageCache {
  if (cacheState !== null) return cacheState
  try {
    const raw = fs.readFileSync(CACHE_FILE, 'utf8')
    cacheState = JSON.parse(raw) as ImageCache
  } catch {
    cacheState = {}
  }
  return cacheState
}

function saveCache(cache: ImageCache): void {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true })
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8')
  } catch (e) {
    console.warn('[images] could not write cache:', (e as Error).message)
  }
}

function loadOverrides(): ImageOverrides {
  try {
    const raw = fs.readFileSync(OVERRIDES_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Record<string, unknown>
    // Filter Meta-Keys ("_kommentar", "_schema") raus
    const filtered: ImageOverrides = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (key.startsWith('_')) continue
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        filtered[key] = value as ImageOverride
      }
    }
    return filtered
  } catch {
    return {}
  }
}

// ===========================================================================
// Dimension-Reading mit sharp + mtime-Cache
// ===========================================================================

async function getDimensions(
  absPath: string,
  mtime: number,
  cache: ImageCache
): Promise<{ width: number; height: number }> {
  const cached = cache[absPath]
  if (cached && cached.mtime === mtime) {
    return { width: cached.width, height: cached.height }
  }

  // Lazy-import sharp damit Modul-Load nicht bei jedem Hot-Reload triggert
  const sharp = (await import('sharp')).default
  const meta = await sharp(absPath).metadata()
  const result = {
    width: meta.width ?? 0,
    height: meta.height ?? 0,
  }
  cache[absPath] = { mtime, width: result.width, height: result.height }
  return result
}

// ===========================================================================
// Recursive Scan
// ===========================================================================

interface ScanContext {
  cache: ImageCache
  overrides: ImageOverrides
  images: ScannedImage[]
  warnings: string[]
}

async function scanFolder(
  absFolder: string,
  relParts: string[],
  ctx: ScanContext
): Promise<void> {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(absFolder, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const absChild = path.join(absFolder, entry.name)

    if (entry.isDirectory()) {
      // Slug-Pattern-Validation am Top-Level
      if (relParts.length === 0) {
        const slug = deriveKapitelSlug(entry.name)
        if (slug === null && !NON_CHAPTER_FOLDERS.has(entry.name)) {
          ctx.warnings.push(
            `[images] Top-Level-Ordner "${entry.name}" entspricht nicht dem NN-slug-Pattern und ist nicht in nonChapterFolders. Bilder darin werden keinem Kapitel zugeordnet.`
          )
        }
      }
      await scanFolder(absChild, [...relParts, entry.name], ctx)
      continue
    }

    if (!entry.isFile()) continue
    const ext = path.extname(entry.name).toLowerCase()
    if (!VALID_EXTENSIONS.has(ext)) continue

    // === Per-File processing ===
    const id = path.basename(entry.name, ext)
    const dateipfad = '/images/' + [...relParts, entry.name].join('/')

    const stat = fs.statSync(absChild)
    const mtime = stat.mtimeMs
    const { width, height } = await getDimensions(absChild, mtime, ctx.cache)

    // Slug & Sektion ableiten
    const topFolder = relParts[0]
    let kapitelSlug: string | undefined
    if (topFolder && !NON_CHAPTER_FOLDERS.has(topFolder)) {
      const derived = deriveKapitelSlug(topFolder)
      kapitelSlug = derived ?? undefined
    }

    const subFolderPath = relParts.slice(1).join('/')
    const sektionId =
      kapitelSlug && subFolderPath ? `${kapitelSlug}#${subFolderPath}` : undefined

    // Override anwenden
    const override = ctx.overrides[id]
    // ausblenden=true heisst NICHT mehr "raus aus dem Scanner",
    // sondern "nicht in Galerien zeigen". Das Bild bleibt fuer Header verfuegbar.

    const alt_text = override?.alt_text ?? autoAltText(id)
    const bildunterschrift = override?.bildunterschrift ?? alt_text
    const istHero = override?.ist_hero_kapitel
      ? override.ist_hero_kapitel === kapitelSlug
      : false

    ctx.images.push({
      id,
      dateipfad,
      alt_text,
      bildunterschrift,
      zugehoeriges_kapitel_slug: kapitelSlug,
      zugehoerige_sektion_id: sektionId,
      breite_px: width,
      hoehe_px: height,
      kategorie: override?.kategorie ?? 'foto',
      ist_hero: istHero,
      sortierung: override?.sortierung ?? 0,
      ausblenden: override?.ausblenden === true,
    })
  }
}

// ===========================================================================
// Public API
// ===========================================================================

let memoizedScan: ScannedImage[] | null = null

/**
 * Liefert alle gescannten Bilder.
 *   - Production: einmaliger Scan, danach memoized
 *   - Development: re-scan pro Aufruf (neue Bilder ohne Server-Restart sichtbar)
 */
export async function getAllImages(): Promise<ScannedImage[]> {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev && memoizedScan !== null) {
    return memoizedScan
  }

  const ctx: ScanContext = {
    cache: loadCache(),
    overrides: loadOverrides(),
    images: [],
    warnings: [],
  }

  await scanFolder(IMAGES_DIR, [], ctx)
  saveCache(ctx.cache)

  for (const w of ctx.warnings) {
    console.warn(w)
  }

  // Sortierung: nach sortierung asc, dann alphabetisch nach id
  ctx.images.sort((a, b) => {
    if (a.sortierung !== b.sortierung) return a.sortierung - b.sortierung
    return a.id.localeCompare(b.id, 'de')
  })

  if (!isDev) {
    memoizedScan = ctx.images
  }
  return ctx.images
}

/** Alle Bilder eines Kapitels */
export async function getImagesForKapitel(kapitelSlug: string): Promise<ScannedImage[]> {
  const all = await getAllImages()
  return all.filter(img => img.zugehoeriges_kapitel_slug === kapitelSlug && !img.ausblenden)
}

/** Alle Bilder einer Sektion (Sub-Ordner) */
export async function getImagesForSektion(sektionId: string): Promise<ScannedImage[]> {
  const all = await getAllImages()
  return all.filter(img => img.zugehoerige_sektion_id === sektionId && !img.ausblenden)
}

/**
 * Hero-Bild eines Kapitels finden.
 * Priorität:
 *   1. Bild mit ist_hero=true (via Override gesetzt)
 *   2. Bild dessen id dem hero_bild_dateiname entspricht
 *   3. Erstes Bild des Kapitels (Fallback)
 *   4. null
 */
export async function getHeroImage(
  kapitelSlug: string,
  heroFilename?: string
): Promise<ScannedImage | null> {
  const all = await getAllImages()

  const overrideHero = all.find(
    img => img.zugehoeriges_kapitel_slug === kapitelSlug && img.ist_hero
  )
  if (overrideHero) return overrideHero

  if (heroFilename) {
    const base = heroFilename.replace(/\.[^.]+$/, '')
    // Zuerst im eigenen Kapitel suchen ...
    const byNameInKapitel = all.find(
      img => img.zugehoeriges_kapitel_slug === kapitelSlug && img.id === base
    )
    if (byNameInKapitel) return byNameInKapitel
    // ... sonst kapitelübergreifend (Header darf ein Bild aus einem anderen Ordner sein)
    const byNameAnywhere = all.find(img => img.id === base)
    if (byNameAnywhere) return byNameAnywhere
  }

  const firstOfKapitel = all.find(img => img.zugehoeriges_kapitel_slug === kapitelSlug)
  return firstOfKapitel ?? null
}

/**
 * Titelbild für die Landing-Page finden.
 * Liegt im hero/-Ordner (nonChapterFolder, daher kein Kapitel-Slug).
 * Sucht primär nach `titelbild`, fällt sonst auf das erste Bild im hero/-Ordner zurück.
 */
export async function getTitelbild(): Promise<ScannedImage | null> {
  const all = await getAllImages()
  const heroImages = all.filter(img => img.dateipfad.startsWith('/images/hero/'))
  const titel = heroImages.find(img => img.id === 'titelbild')
  return titel ?? heroImages[0] ?? null
}

/**
 * Ein einzelnes Bild über seine id finden — für die <Bild>-MDX-Komponente.
 * Optional auf einen Sub-Ordner ("backwing") oder Kapitel-Ordner einschränken.
 */
export async function findImageById(
  id: string,
  scopeFolder?: string
): Promise<ScannedImage | null> {
  const all = await getAllImages()
  const base = id.replace(/\.[^.]+$/, '')

  let candidates = all.filter(img => img.id === base)
  if (scopeFolder) {
    candidates = candidates.filter(img => img.dateipfad.includes(`/${scopeFolder}/`))
  }
  return candidates[0] ?? null
}

/**
 * Diagnose-Helper für /_dev/bilder-Tool (Phase 4):
 *   Liefert alle Bilder OHNE zugewiesenes Kapitel — also Bilder die im falschen
 *   Ordner liegen oder deren Top-Ordner nicht dem NN-slug-Pattern entspricht.
 */
export async function getOrphanImages(): Promise<ScannedImage[]> {
  const all = await getAllImages()
  return all.filter(img => !img.zugehoeriges_kapitel_slug)
}
