# Vom Plan zum Wasser

IDPA-Dokumentationsseite zur Entwicklung eines Hydrofoils
von **Manue Burmeister** & **Dimitri Mühlebach**
Berufsbildungszentrum Goldau · BM2TV 1a · Betreuung: Fabio Lenzlinger · Abgabe 31.05.2026

---

## Stack

- **Next.js 14** (App Router) + TypeScript strict
- **Tailwind CSS** + shadcn/ui
- **MDX** via `@next/mdx`
- **Bilder** via `next/image` (volle Optimization auf Vercel)
- **Hosting**: Vercel Hobby, `vom-plan-zum-wasser.vercel.app`
- **Robots**: `noindex, nofollow` (Direkt-Link only, nicht in Suchmaschinen)

## Setup

```bash
pnpm install
pnpm dev
```

Site läuft auf http://localhost:3000.

> Node ≥ 18.17 erforderlich. pnpm wird empfohlen (npm/yarn funktionieren auch).

## Commands

| Command                  | Wirkung                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `pnpm dev`               | Dev-Server mit HMR                                             |
| `pnpm build`             | Production-Build                                               |
| `pnpm start`             | Production-Server (nach Build)                                 |
| `pnpm lint`              | ESLint                                                         |
| `pnpm typecheck`         | TypeScript-Check ohne Build                                    |
| `pnpm validate`          | Stammdaten + Bild-Referenzen prüfen (lenient/strict via Flag)  |
| `pnpm normalize-images`  | Bilddateinamen normalisieren (Leerzeichen/Umlaute → web-safe)  |
| `pnpm list-images`       | Alle erkannten Bilder gruppiert nach Kapitel listen            |

## Bilder hinzufügen

1. Bild in den passenden Sub-Ordner unter `/public/images/` legen, z.B.
   `/public/images/04-realisierung/backwing/lackieren-aufgehaengt.jpg`
2. Falls Dateiname Leerzeichen oder Umlaute enthält:
   ```bash
   pnpm normalize-images
   ```
3. Beim nächsten Build wird das Bild **automatisch** der Sektion „2.3.3 Backwing" zugeordnet —
   alt-Text aus dem Dateinamen generiert, Breite/Höhe via sharp gelesen.
4. Bei Bedarf alt-Text oder Sortierung anpassen in `data/image-overrides.json`.

## Bilder verifizieren

```bash
pnpm list-images
```

Listet alle gefundenen Bilder gruppiert nach Kapitel und Sektion. Falls ein Bild fehlt
oder einem falschen Kapitel zugeordnet ist, hier kommt's raus.

## Stammdaten

Vor Abgabe befüllen (siehe `TODO:`-Markierungen):

- `content/glossar.json` — Glossar-Begriffe (11 Beispiele schon eingebaut)
- `content/phasen.json` — Zeiträume ergänzen
- `content/team.json` — Rollen, Bios, Fotos
- `content/stats.json` — KPI-Werte aus der Arbeit
- `content/reflexionen.json` — Inhalte aus Kapitel 3.3
- `data/vergleiche.json` — Bild-Dateinamen anpassen (CAD vs. Fertigteil)
- `data/image-overrides.json` — optional, nur für Politur

Vor finaler Abgabe `STRICT_VALIDATION: true` in `site.config.ts` setzen, dann `pnpm validate`.

## Fonts

- **Display**: Bebas Neue (Google Font, single weight). Genügt für den Hero-Display.
  Falls mehrere Weights nötig sind → Bebas Neue Pro lizenzieren und in `/public/fonts/`
  ablegen, dann `lib/fonts.ts` auf `next/font/local` umstellen.
- **Headline**: Space Grotesk
- **Body**: Inter
- **Mono**: JetBrains Mono

Alle Fonts via `next/font/google` selbst gehostet — keine externen Calls zur Laufzeit.

## Deploy

Repository mit Vercel verbinden (Account: Webboost360, Projekt: `vom-plan-zum-wasser`),
dann jeder `git push` deployt automatisch.

URL: `https://vom-plan-zum-wasser.vercel.app`

## Verzeichnis-Übersicht

```
app/                  Next.js App Router (Layout + Pages)
components/
  shared/             Nav, Footer, GrainOverlay, ScrollProgress
  ui/                 shadcn-Primitives (Button etc.)
content/
  kapitel/            MDX-Dateien pro Kapitel (Phase 4+5)
  *.json              Stammdaten (Glossar, Phasen, Team, Stats, Reflexionen)
data/
  vergleiche.json     Before/After-Slider-Definitionen
  image-overrides.json  Optionale Bild-Korrekturen
lib/
  images.ts           Rekursiver Bild-Scanner (mtime-Cache + Dev-Bypass)
  validate.ts         Build-Time-Validation
  content.ts          JSON-Loader
  types.ts            TypeScript-Interfaces
  fonts.ts            next/font-Setup
  utils.ts            cn() Helper
public/
  images/             Bild-Quellen (ordnerbasiert, automatisch erkannt)
  fonts/              Lokale Fonts (falls verwendet)
scripts/
  normalize-filenames.ts
  list-images.ts
styles/globals.css
site.config.ts        Single Source of Truth: Kapitel-Struktur, Branding, Flags
```

## Aktueller Stand

- **Phase 1 ✓** Foundation (Repo, Vercel, Fonts, Dark-Theme, Layout, Nav, Footer, GrainOverlay)
- **Phase 2 ✓** Content-Strukturen (Types, Scanner, Validate, Normalize, Overrides)
- **Phase 3** Core-Komponenten (Hero, Stats, Timeline, Gallery, Lightbox, Vergleich)
- **Phase 4** Seiten (Landing, 6 Kapitel, Glossar, Team, Reflexion, Zahlen, Galerie)
- **Phase 5** Content-Befüllung durch das Team
- **Phase 6** Polishing (A11y, Performance, STRICT-Check)
- **Phase 7** Abgabe (Link an Fabio Lenzlinger)
