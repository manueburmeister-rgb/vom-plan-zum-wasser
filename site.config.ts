/**
 * Zentrale Konfiguration für die gesamte Site.
 * Wird von Layouts, Validation, Image-Scanner und allen Komponenten konsumiert.
 *
 * Bei Änderungen am Branding oder Kapitel-Setup ist DAS die einzige Quelle der Wahrheit.
 */

import type { KapitelConfig, Phase } from '@/lib/types'

// === Kapitel-Definitionen ===
// Reihenfolge entspricht dem Inhaltsverzeichnis der schriftlichen Arbeit.
// `bilder_ordner` muss exakt dem Top-Level-Ordnernamen unter /public/images/ entsprechen.
// `sektionen` werden 1:1 als H2/H3 in der Kapitel-Seite gerendert + bestimmen die Sticky-Sub-Nav.

const kapitel: KapitelConfig[] = [
  {
    slug: 'einleitung',
    hero_bild_dateiname: 'manue-mit-boar-und-foil-im-wasser',
    nummer: 1,
    titel: 'Einleitung',
    untertitel: 'Themenwahl, Ziele und Grundlagen des Hydrofoils',
    bilder_ordner: '01-einleitung',
    phase: 'einleitung' satisfies Phase,
    lesezeit_minuten: 6,
    sektionen: [
      { id: 'einleitung#vorwort', nummer: '1.1', titel: 'Vorwort', ebene: 'h2' },
      { id: 'einleitung#themenwahl', nummer: '1.2', titel: 'Themenwahl', ebene: 'h2' },
      { id: 'einleitung#ziele', nummer: '1.3', titel: 'Ziele', ebene: 'h2' },
      { id: 'einleitung#beabsichtigtes-vorgehen', nummer: '1.4', titel: 'Beabsichtigtes Vorgehen', ebene: 'h2' },
      {
        id: 'einleitung#aufbau-funktion',
        nummer: '1.5',
        titel: 'Aufbau und Funktion eines Hydrofoils',
        ebene: 'h2',
        bilder_unterordner: 'aufbau-funktion',
      },
    ],
  },
  {
    slug: 'informationsbeschaffung',
    hero_bild_dateiname: 'dimitri-am-pc-konstruiert-frontwing-in-shape',
    nummer: 2,
    titel: 'Informationsbeschaffung',
    untertitel: 'Recherche, Physik und Expertengespräche',
    bilder_ordner: '02-informationsbeschaffung',
    phase: 'informationsbeschaffung' satisfies Phase,
    lesezeit_minuten: 8,
    sektionen: [
      {
        id: 'informationsbeschaffung#physikalisches',
        nummer: '2.1.1',
        titel: 'Physikalisches',
        ebene: 'h2',
        bilder_unterordner: 'physikalisches',
      },
      {
        id: 'informationsbeschaffung#michael-gespraech',
        nummer: '2.1.2',
        titel: 'Michael Gespräch',
        ebene: 'h2',
        bilder_unterordner: 'michael-gespraech',
      },
      { id: 'informationsbeschaffung#fazit', nummer: '2.1.3', titel: 'Fazit', ebene: 'h2' },
    ],
  },
  {
    slug: 'planung',
    hero_bild_dateiname: 'cad-komplette-baugruppe-von-foil-zusammengebaut',
    nummer: 3,
    titel: 'Planung',
    untertitel: 'Konstruktion, CAD-Modellierung und Verfahrensentscheid',
    bilder_ordner: '03-planung',
    phase: 'planung' satisfies Phase,
    lesezeit_minuten: 12,
    sektionen: [
      {
        id: 'planung#konstruktion-skizze',
        nummer: '2.2.1',
        titel: 'Konstruktion / Skizze',
        ebene: 'h2',
        bilder_unterordner: 'konstruktion-skizze',
      },
      {
        id: 'planung#dimensionen',
        nummer: '2.2.2',
        titel: 'Dimensionen',
        ebene: 'h2',
        bilder_unterordner: 'dimensionen',
      },
      {
        id: 'planung#cad-modell',
        nummer: '2.2.3',
        titel: 'CAD-Modell',
        ebene: 'h2',
        sub_sektionen: [
          {
            id: 'planung#cad-frontwing',
            nummer: '2.2.3.1',
            titel: 'Frontwing',
            ebene: 'h3',
            bilder_unterordner: 'cad-frontwing',
          },
          {
            id: 'planung#cad-backwing',
            nummer: '2.2.3.2',
            titel: 'Backwing',
            ebene: 'h3',
            bilder_unterordner: 'cad-backwing',
          },
          {
            id: 'planung#cad-fuselage',
            nummer: '2.2.3.3',
            titel: 'Fuselage',
            ebene: 'h3',
            bilder_unterordner: 'cad-fuselage',
          },
          {
            id: 'planung#cad-adapterstueck',
            nummer: '2.2.3.4',
            titel: 'Adapterstück',
            ebene: 'h3',
            bilder_unterordner: 'cad-adapterstueck',
          },
          {
            id: 'planung#cad-pressformen',
            nummer: '2.2.3.5',
            titel: 'Pressformen',
            ebene: 'h3',
            bilder_unterordner: 'cad-pressformen',
          },
        ],
      },
      {
        id: 'planung#material',
        nummer: '2.2.4',
        titel: 'Material',
        ebene: 'h2',
        bilder_unterordner: 'material',
      },
      {
        id: 'planung#verfahren',
        nummer: '2.2.5',
        titel: 'Verfahren',
        ebene: 'h2',
        bilder_unterordner: 'verfahren',
      },
      { id: 'planung#fazit', nummer: '2.2.6', titel: 'Fazit', ebene: 'h2' },
    ],
  },
  {
    slug: 'realisierung',
    hero_bild_dateiname: 'komplettes-foil-zusammengebaut-mit-dimitri-zusehen',
    nummer: 4,
    titel: 'Realisierung',
    untertitel: 'Fertigung der Komponenten — von der Pressform bis zum lackierten Carbon-Teil',
    bilder_ordner: '04-realisierung',
    phase: 'realisierung' satisfies Phase,
    lesezeit_minuten: 15,
    sektionen: [
      {
        id: 'realisierung#pressformen',
        nummer: '2.3.1',
        titel: 'Pressformen',
        ebene: 'h2',
        bilder_unterordner: 'pressformen',
      },
      {
        id: 'realisierung#kern',
        nummer: '2.3.2',
        titel: 'Kern',
        ebene: 'h2',
        bilder_unterordner: 'kern',
      },
      {
        id: 'realisierung#backwing',
        nummer: '2.3.3',
        titel: 'Backwing',
        ebene: 'h2',
        bilder_unterordner: 'backwing',
      },
      {
        id: 'realisierung#frontwing',
        nummer: '2.3.4',
        titel: 'Frontwing',
        ebene: 'h2',
        bilder_unterordner: 'frontwing',
      },
      {
        id: 'realisierung#fuselage',
        nummer: '2.3.5',
        titel: 'Fuselage',
        ebene: 'h2',
        bilder_unterordner: 'fuselage',
      },
      {
        id: 'realisierung#adapterstueck',
        nummer: '2.3.6',
        titel: 'Adapterstück',
        ebene: 'h2',
        bilder_unterordner: 'adapterstueck',
      },
      { id: 'realisierung#fazit', nummer: '2.3.7', titel: 'Fazit', ebene: 'h2' },
    ],
  },
  {
    slug: 'praxistest',
    hero_bild_dateiname: 'montage-auf-mast-beim-praxistest',
    nummer: 5,
    titel: 'Praxistest',
    untertitel: 'Erster Wassertest des fertigen Foils',
    bilder_ordner: '05-praxistest',
    phase: 'praxistest' satisfies Phase,
    lesezeit_minuten: 5,
    sektionen: [],
  },
  {
    slug: 'schlusswort',
    hero_bild_dateiname: 'fertiges-foil-auf-stein',
    nummer: 6,
    titel: 'Schlusswort',
    untertitel: 'Zusammenfassung, Reflexion und Ausblick',
    bilder_ordner: '06-schlusswort',
    phase: 'schlusswort' satisfies Phase,
    lesezeit_minuten: 7,
    sektionen: [
      { id: 'schlusswort#zusammenfassung', nummer: '3.1', titel: 'Zusammenfassung', ebene: 'h2' },
      { id: 'schlusswort#beantwortung-ziele', nummer: '3.2', titel: 'Beantwortung der Ziele', ebene: 'h2' },
      {
        id: 'schlusswort#reflexion-arbeitsprozess',
        nummer: '3.3',
        titel: 'Reflexion Arbeitsprozess',
        ebene: 'h2',
      },
      { id: 'schlusswort#danksagung', nummer: '3.4', titel: 'Danksagung', ebene: 'h2' },
      {
        id: 'schlusswort#eigenstaendigkeitserklaerung',
        nummer: '3.5',
        titel: 'Eigenständigkeitserklärung',
        ebene: 'h2',
      },
    ],
  },
]

export const siteConfig = {
  // === Identity ===
  title: 'Vom Plan zum Wasser',
  subtitle: 'Entwicklung eines Hydrofoils',
  slogan: 'Vom Plan zum Wasser',
  description:
    'IDPA-Dokumentation zur Entwicklung eines Hydrofoils von Manue Burmeister und Dimitri Mühlebach. Berufsbildungszentrum Goldau, BM2TV 1a, 2026.',
  url: 'https://vom-plan-zum-wasser.vercel.app',
  locale: 'de-CH',

  // === Akademischer Kontext ===
  schule: 'Berufsbildungszentrum Goldau',
  klasse: 'BM2TV 1a',
  betreuung: 'Fabio Lenzlinger',
  abgabe: '2026-05-31',
  abgabeFormatiert: '31. Mai 2026',
  idpaJahr: '2026',

  // === Autoren ===
  autoren: [
    { vorname: 'Manue', nachname: 'Burmeister' },
    { vorname: 'Dimitri', nachname: 'Mühlebach' },
  ],

  // === Kapitel-Struktur ===
  kapitel,

  // === Navigation ===
  navItems: [
    { label: 'Prozess', href: '/prozess' },
    { label: 'Galerie', href: '/galerie' },
    { label: 'Glossar', href: '/glossar' },
    { label: 'Über uns', href: '/team' },
    { label: 'Reflexion', href: '/reflexion' },
  ],

  // === Image-Scanner: Sonder-Ordner die NICHT als Kapitel behandelt werden ===
  // Werden bei der Slug-Pattern-Validation übersprungen, ihre Bilder bekommen kein Kapitel zugeordnet.
  nonChapterFolders: ['hero', 'team', '_shared'] as const,

  // === Feature Flags ===
  features: {
    /** Strikte Build-Validation: failed bei leeren Kapiteln, fehlenden Stammdaten, etc. Vor Abgabe auf true. */
    STRICT_VALIDATION: false,
    /** Glossar-Tooltips innerhalb von Kapiteln aktivieren */
    glossarTooltipsEnabled: true,
    /** prefers-reduced-motion respektieren (CSS macht das schon — Flag ist für JS-Animationen) */
    reducedMotionRespect: true,
  },

  // === Design-Tokens (referenziert, falls JS sie braucht — primär in tailwind.config.ts) ===
  colors: {
    oceanDeep: '#0A1929',
    oceanMid: '#0F2540',
    oceanShallow: '#1E293B',
    wingPink: '#EC4899',
    waterCyan: '#06B6D4',
    inkPrimary: '#F8FAFC',
    inkMuted: '#94A3B8',
    line: '#1E293B',
  },
} as const

export type SiteConfig = typeof siteConfig
