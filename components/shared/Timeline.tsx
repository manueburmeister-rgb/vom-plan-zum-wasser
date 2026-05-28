import Link from 'next/link'
import { Icon } from '@/components/shared/Icon'
import { Reveal } from '@/components/shared/Reveal'
import type { PhaseEintrag } from '@/lib/types'

/**
 * Prozess-Timeline der 6 Phasen.
 *   - Desktop: horizontal mit Verbindungslinie
 *   - Mobile: vertikal gestapelt
 *   - Klick auf Phase → erstes zugehöriges Kapitel
 *   - Akzentfarbe pro Phase aus phasen.json
 */

const AKZENT: Record<string, { text: string; bg: string; border: string; line: string }> = {
  ocean: { text: 'text-water', bg: 'bg-water/10', border: 'border-water/40', line: 'bg-water/30' },
  cyan: { text: 'text-water', bg: 'bg-water/10', border: 'border-water/40', line: 'bg-water/30' },
  pink: { text: 'text-wing', bg: 'bg-wing/10', border: 'border-wing/40', line: 'bg-wing/30' },
  default: { text: 'text-ink-primary', bg: 'bg-ocean-shallow', border: 'border-line', line: 'bg-line' },
}

export function Timeline({ phasen }: { phasen: PhaseEintrag[] }) {
  if (phasen.length === 0) return null

  return (
    <section className="mx-auto max-w-screen-2xl px-5 py-20 lg:px-10">
      <Reveal>
        <div className="mb-12 flex items-end justify-between gap-4">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-ink-primary md:text-4xl">
            Der Prozess auf einen Blick
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-wider text-ink-muted sm:inline">
            6 Phasen
          </span>
        </div>
      </Reveal>

      {/* Desktop: horizontal */}
      <div className="hidden lg:grid lg:grid-cols-6 lg:gap-4">
        {phasen.map((phase, i) => {
          const c = AKZENT[phase.akzentfarbe] ?? AKZENT.default
          const targetSlug = phase.kapitel_slugs[0]
          return (
            <Reveal key={phase.id} delay={i * 0.1}>
              <Link
                href={targetSlug ? `/kapitel/${targetSlug}` : '#'}
                className="group block h-full"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${c.border} ${c.bg} ${c.text} transition-transform group-hover:scale-110`}
                  >
                    <Icon name={phase.icon} size={22} />
                  </div>
                  <span className="font-mono text-xs text-ink-muted">0{phase.nummer}</span>
                </div>
                <h3 className="font-headline text-lg font-bold text-ink-primary group-hover:text-wing transition-colors">
                  {phase.titel}
                </h3>
                {phase.zeitraum && !phase.zeitraum.startsWith('TODO') && (
                  <p className={`mt-1 font-mono text-xs ${c.text}`}>{phase.zeitraum}</p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{phase.kurzbeschreibung}</p>
              </Link>
            </Reveal>
          )
        })}
      </div>

      {/* Mobile: vertikal */}
      <div className="space-y-4 lg:hidden">
        {phasen.map((phase, i) => {
          const c = AKZENT[phase.akzentfarbe] ?? AKZENT.default
          const targetSlug = phase.kapitel_slugs[0]
          return (
            <Reveal key={phase.id} delay={i * 0.06}>
              <Link
                href={targetSlug ? `/kapitel/${targetSlug}` : '#'}
                className="group flex gap-4 rounded-lg border border-line bg-ocean-mid/40 p-4"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${c.border} ${c.bg} ${c.text}`}
                >
                  <Icon name={phase.icon} size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-ink-muted">0{phase.nummer}</span>
                    <h3 className="font-headline text-base font-bold text-ink-primary">
                      {phase.titel}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{phase.kurzbeschreibung}</p>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
