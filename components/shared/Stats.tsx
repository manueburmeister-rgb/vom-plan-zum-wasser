import { Icon } from '@/components/shared/Icon'
import { CountUp } from '@/components/shared/CountUp'
import { Reveal } from '@/components/shared/Reveal'
import type { Stat } from '@/lib/types'

/**
 * Stats-Strip: Grid mit KPI-Kacheln, Count-Up beim Scroll-In.
 * Werte mit "TODO" werden ausgeblendet (damit Platzhalter nicht öffentlich erscheinen).
 */
export function Stats({ stats }: { stats: Stat[] }) {
  // Nur Stats mit echtem Wert zeigen (TODO-Platzhalter raus)
  const visible = stats.filter(s => s.wert && s.wert.toUpperCase() !== 'TODO')

  if (visible.length === 0) return null

  return (
    <section className="mx-auto max-w-screen-2xl px-5 py-20 lg:px-10">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4 lg:grid-cols-4">
        {visible.map((stat, i) => (
          <Reveal key={stat.id} delay={i * 0.08}>
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-ocean-deep p-6 text-center">
              {stat.icon && <Icon name={stat.icon} className="text-water" size={24} />}
              <div className="font-display text-4xl text-ink-primary lg:text-5xl">
                <CountUp value={stat.wert} />
                {stat.einheit && (
                  <span className="ml-1 font-mono text-base text-ink-muted">{stat.einheit}</span>
                )}
              </div>
              <p className="text-xs uppercase tracking-wider text-ink-muted">{stat.bezeichnung}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
