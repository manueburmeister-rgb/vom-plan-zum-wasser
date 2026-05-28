/**
 * Normalize-Filenames-Script.
 *
 * Macht Bilddateinamen unter /public/images/ web-safe:
 *   - lowercase
 *   - Leerzeichen → Bindestriche
 *   - Umlaute: ä→ae, ö→oe, ü→ue, ß→ss
 *   - Sonderzeichen entfernt (nur [a-z0-9.-] bleibt übrig)
 *   - Konflikte: Suffix -1, -2, ...
 *   - Idempotent: erneute Ausführung ist ein No-Op wenn schon alles normalisiert ist
 *
 * Aufruf:
 *   pnpm normalize-images
 *
 * Macht NICHT:
 *   - Tippfehler korrigieren ("frotnwing" bleibt "frotnwing")
 *     → Korrekturen über data/image-overrides.json ("alt_text"-Override)
 *
 * Log:
 *   scripts/rename-log.txt (gitignored)
 */

import fs from 'node:fs'
import path from 'node:path'

const PROJECT_ROOT = process.cwd()
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images')
const LOG_FILE = path.join(PROJECT_ROOT, 'scripts', 'rename-log.txt')

const UMLAUT_MAP: Record<string, string> = {
  ä: 'ae',
  ö: 'oe',
  ü: 'ue',
  Ä: 'ae',
  Ö: 'oe',
  Ü: 'ue',
  ß: 'ss',
}

function normalizeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase()
  const base = path.basename(name, ext)
  let result = base.toLowerCase()

  // Umlaute ersetzen (auf dem ursprünglichen Case-State, dann lowercase)
  result = base.replace(/[äöüÄÖÜß]/g, c => UMLAUT_MAP[c] ?? c).toLowerCase()

  // Leerzeichen und Unterstriche zu Bindestrichen
  result = result.replace(/[\s_]+/g, '-')

  // Alles ausser a-z, 0-9, Punkt, Bindestrich entfernen
  result = result.replace(/[^a-z0-9.\-]/g, '')

  // Mehrfach-Bindestriche kollabieren
  result = result.replace(/-+/g, '-')

  // Führende/abschliessende Bindestriche entfernen
  result = result.replace(/^-+|-+$/g, '')

  return result + ext
}

function uniqueName(folder: string, desired: string, taken: Set<string>): string {
  if (!fs.existsSync(path.join(folder, desired)) && !taken.has(desired)) {
    return desired
  }
  const ext = path.extname(desired)
  const base = path.basename(desired, ext)
  for (let i = 1; i < 1000; i++) {
    const candidate = `${base}-${i}${ext}`
    if (!fs.existsSync(path.join(folder, candidate)) && !taken.has(candidate)) {
      return candidate
    }
  }
  throw new Error(`Konnte keinen eindeutigen Namen für ${desired} in ${folder} finden`)
}

interface RenameRecord {
  folder: string
  from: string
  to: string
}

function processFolder(absFolder: string, records: RenameRecord[]): void {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(absFolder, { withFileTypes: true })
  } catch {
    return
  }

  // Erst rekursiv in Sub-Ordner
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      processFolder(path.join(absFolder, entry.name), records)
    }
  }

  // Dann Dateien im aktuellen Ordner umbenennen
  const taken = new Set<string>()
  for (const entry of entries) {
    if (!entry.isFile()) continue
    if (entry.name.startsWith('.')) continue

    const newName = normalizeFilename(entry.name)
    if (newName === entry.name) {
      taken.add(newName)
      continue
    }

    const finalName = uniqueName(absFolder, newName, taken)
    const fromPath = path.join(absFolder, entry.name)
    const toPath = path.join(absFolder, finalName)

    fs.renameSync(fromPath, toPath)
    taken.add(finalName)
    records.push({
      folder: path.relative(PROJECT_ROOT, absFolder),
      from: entry.name,
      to: finalName,
    })
  }
}

function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log(`[normalize] Kein Bild-Ordner unter ${IMAGES_DIR} — nichts zu tun.`)
    return
  }

  const records: RenameRecord[] = []
  processFolder(IMAGES_DIR, records)

  if (records.length === 0) {
    console.log('[normalize] Alle Dateinamen sind bereits normalisiert. Keine Änderungen.')
    return
  }

  console.log(`[normalize] ${records.length} Datei(en) umbenannt:\n`)
  const logLines: string[] = [`# Rename-Log — ${new Date().toISOString()}`, '']
  for (const r of records) {
    const line = `${r.folder}/  ${r.from}  →  ${r.to}`
    console.log('  ' + line)
    logLines.push(line)
  }

  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true })
  fs.appendFileSync(LOG_FILE, logLines.join('\n') + '\n\n')
  console.log(`\n[normalize] Log angehängt an ${path.relative(PROJECT_ROOT, LOG_FILE)}`)
}

main()
