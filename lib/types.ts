/**
 * Zentrale Type-Definitionen für alle Content-Entities und interne Daten-Strukturen.
 *
 * Mapping zur Scope-Dokumentation:
 *   - Kapitel / Sektion / Bild / Vergleich / Glossar / Stat / Phase / Team / Reflexion
 *     entsprechen den "Core Entities" im Project Scope.
 *   - ScannedImage, ImageOverride*, ImageCache* sind interne Helper-Typen
 *     für den Build-Time-Image-Scanner.
 */

// ===========================================================================
// Enums / String-Literal-Unions
// ===========================================================================

export type Phase =
  | 'einleitung'
  | 'informationsbeschaffung'
  | 'planung'
  | 'realisierung'
  | 'praxistest'
  | 'schlusswort'

export type StatusKapitel = 'entwurf' | 'freigegeben' | 'ueberarbeitung_noetig'

export type ImageKategorie =
  | 'foto'
  | 'render'
  | 'screenshot'
  | 'technische_zeichnung'
  | 'video_still'
  | 'diagramm'

export type GlossarKategorie =
  | 'physik'
  | 'material'
  | 'fertigung'
  | 'software'
  | 'sportart'
  | 'komponente'

export type ReflexionKategorie = 'erfolg' | 'herausforderung' | 'lesson_learned' | 'ausblick'

export type VergleichTyp = 'slider' | 'nebeneinander' | 'ueberblendung'

export type AkzentFarbe = 'ocean' | 'cyan' | 'pink' | 'default'

export type EbenenLevel = 'h2' | 'h3' | 'h4'

// ===========================================================================
// Content-Config (statisch in site.config.ts)
// ===========================================================================

export interface SektionConfig {
  /** z.B. "realisierung#backwing" */
  id: string
  /** z.B. "2.3.3" (1:1 aus dem Inhaltsverzeichnis der schriftlichen Arbeit) */
  nummer: string
  titel: string
  ebene: EbenenLevel
  /** Sub-Ordner-Name relativ zum Kapitel-Bildordner. Bilder dort werden auto-zugeordnet. */
  bilder_unterordner?: string
  sub_sektionen?: SektionConfig[]
}

export interface KapitelConfig {
  slug: string
  nummer: number
  titel: string
  untertitel?: string
  /** Ordnername unter /public/images/, z.B. "04-realisierung" */
  bilder_ordner: string
  phase: Phase
  /** Dateiname (mit oder ohne Endung) des Hero-Bilds für diese Seite */
  hero_bild_dateiname?: string
  lesezeit_minuten?: number
  sektionen: SektionConfig[]
}

// ===========================================================================
// Stammdaten (in content/*.json bzw. data/*.json)
// ===========================================================================

export interface GlossarEintrag {
  begriff: string
  definition: string
  kategorie: GlossarKategorie
  /** Slug des Kapitels, in dem der Begriff erstmals auftaucht */
  erstes_auftreten_kapitel_slug?: string
  /** Andere Glossar-Begriffe als Cross-Reference */
  siehe_auch?: string[]
}

export interface Stat {
  id: string
  /** Anzeigewert, z.B. "12" oder "28.5" */
  wert: string
  /** Optionale Einheit, z.B. "Monate", "km/h" */
  einheit?: string
  bezeichnung: string
  /** Lucide-Icon-Name (z.B. "Calendar", "Gauge") */
  icon?: string
  sortierung: number
}

export interface PhaseEintrag {
  id: string
  nummer: number
  titel: string
  kurzbeschreibung: string
  /** z.B. "Sep – Okt 2025" */
  zeitraum?: string
  /** Lucide-Icon-Name */
  icon: string
  akzentfarbe: AkzentFarbe
  /** Kapitel die zu dieser Phase gehören (1:N) */
  kapitel_slugs: string[]
}

export interface TeamMitglied {
  id: string
  vorname: string
  nachname: string
  rolle: string
  /** Dateiname in /public/images/team/ — z.B. "manue.jpg" */
  foto_dateiname?: string
  kurz_bio?: string
  sortierung: number
}

export interface Reflexion {
  id: string
  titel: string
  inhalt: string
  kategorie: ReflexionKategorie
  /** Kapitel-Slug aus dem die Reflexion stammt (optional, default: "schlusswort") */
  kapitel_slug?: string
  sortierung: number
}

export interface Vergleich {
  id: string
  titel: string
  typ: VergleichTyp
  /** Dateiname (mit oder ohne Endung) — Scanner findet das Bild im Image-Index */
  bild_links_dateiname: string
  bild_rechts_dateiname: string
  beschriftung_links: string
  beschriftung_rechts: string
  erklaerung?: string
  kapitel_slug: string
  /** Optional: an welche Sektion ist der Vergleich gebunden */
  sektion_id?: string
}

// ===========================================================================
// Image-Scanner (Build-Time)
// ===========================================================================

/**
 * Ein vom rekursiven Ordner-Scanner gefundenes Bild.
 * Alle Felder werden zur Build-Time automatisch berechnet,
 * können aber via /data/image-overrides.json überschrieben werden.
 */
export interface ScannedImage {
  /** Dateiname ohne Endung, z.B. "lackieren-aufgehaengt" */
  id: string
  /** Pfad relativ zu /public, z.B. "/images/04-realisierung/backwing/lackieren-aufgehaengt.jpg" */
  dateipfad: string
  alt_text: string
  bildunterschrift: string
  /** Aus Top-Level-Ordner abgeleitet ("04-realisierung" → "realisierung"). Undefined wenn Bild in nonChapterFolders liegt. */
  zugehoeriges_kapitel_slug?: string
  /** Aus Sub-Ordner-Path abgeleitet, z.B. "realisierung#backwing" */
  zugehoerige_sektion_id?: string
  breite_px: number
  hoehe_px: number
  kategorie: ImageKategorie
  /** True wenn dieses Bild explizit als Hero seines Kapitels markiert ist */
  ist_hero: boolean
  sortierung: number
  /** True wenn das Bild in Galerien nicht erscheinen soll (z.B. wenn es nur als Header dient) */
  ausblenden: boolean
}

/** Override-Eintrag in /data/image-overrides.json. Key = ScannedImage.id */
export interface ImageOverride {
  alt_text?: string
  bildunterschrift?: string
  kategorie?: ImageKategorie
  sortierung?: number
  /** Wenn true: Scanner ignoriert dieses Bild komplett */
  ausblenden?: boolean
  /** Slug des Kapitels, für das dieses Bild als Hero dienen soll */
  ist_hero_kapitel?: string
}

export type ImageOverrides = Record<string, ImageOverride>

/** Persistenter mtime-Cache (lib/image-cache.json) für sharp-Dimension-Reads */
export interface ImageCacheEntry {
  mtime: number
  width: number
  height: number
}

export type ImageCache = Record<string, ImageCacheEntry>
