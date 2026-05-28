/**
 * Typed Content-Loader für alle Stammdaten-JSONs.
 *
 * Wird von Pages und Komponenten konsumiert, die strukturierte Daten brauchen
 * (Glossar, Stats, Phasen, Team, Reflexionen, Vergleiche).
 *
 * Das eigentliche MDX-Rendering läuft über @next/mdx via dynamic imports —
 * dieser Loader liefert nur die Metadata.
 *
 * Runtime: nodejs (nutzt fs).
 */

import fs from 'node:fs'
import path from 'node:path'
import { siteConfig } from '@/site.config'
import type {
  KapitelConfig,
  GlossarEintrag,
  Stat,
  PhaseEintrag,
  TeamMitglied,
  Reflexion,
  Vergleich,
} from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const DATA_DIR = path.join(process.cwd(), 'data')

function readJSON<T>(absPath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(absPath, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

// === Kapitel (aus site.config) ===

export function getKapitel(): readonly KapitelConfig[] {
  return siteConfig.kapitel as readonly KapitelConfig[]
}

export function getKapitelBySlug(slug: string): KapitelConfig | null {
  return getKapitel().find(k => k.slug === slug) ?? null
}

export function getKapitelNachbarn(slug: string): {
  vorheriges: KapitelConfig | null
  naechstes: KapitelConfig | null
} {
  const list = getKapitel()
  const idx = list.findIndex(k => k.slug === slug)
  if (idx === -1) return { vorheriges: null, naechstes: null }
  return {
    vorheriges: idx > 0 ? list[idx - 1] : null,
    naechstes: idx < list.length - 1 ? list[idx + 1] : null,
  }
}

// === Stammdaten ===

export function getGlossar(): GlossarEintrag[] {
  return readJSON<GlossarEintrag[]>(path.join(CONTENT_DIR, 'glossar.json'), [])
}

export function getGlossarBegriff(begriff: string): GlossarEintrag | null {
  const normalized = begriff.toLowerCase().trim()
  return getGlossar().find(g => g.begriff.toLowerCase() === normalized) ?? null
}

export function getStats(): Stat[] {
  const stats = readJSON<Stat[]>(path.join(CONTENT_DIR, 'stats.json'), [])
  return [...stats].sort((a, b) => a.sortierung - b.sortierung)
}

export function getPhasen(): PhaseEintrag[] {
  const phasen = readJSON<PhaseEintrag[]>(path.join(CONTENT_DIR, 'phasen.json'), [])
  return [...phasen].sort((a, b) => a.nummer - b.nummer)
}

export function getTeam(): TeamMitglied[] {
  const team = readJSON<TeamMitglied[]>(path.join(CONTENT_DIR, 'team.json'), [])
  return [...team].sort((a, b) => a.sortierung - b.sortierung)
}

export function getReflexionen(): Reflexion[] {
  const refl = readJSON<Reflexion[]>(path.join(CONTENT_DIR, 'reflexionen.json'), [])
  return [...refl].sort((a, b) => a.sortierung - b.sortierung)
}

export function getReflexionenNachKategorie(): Record<string, Reflexion[]> {
  const grouped: Record<string, Reflexion[]> = {}
  for (const r of getReflexionen()) {
    if (!grouped[r.kategorie]) grouped[r.kategorie] = []
    grouped[r.kategorie].push(r)
  }
  return grouped
}

export function getVergleiche(): Vergleich[] {
  return readJSON<Vergleich[]>(path.join(DATA_DIR, 'vergleiche.json'), [])
}

export function getVergleichById(id: string): Vergleich | null {
  return getVergleiche().find(v => v.id === id) ?? null
}
