import { getStats } from '@/lib/content'
import { Stats } from '@/components/shared/Stats'

export const runtime = 'nodejs'

export const metadata = { title: 'Zahlen' }

export default function ZahlenPage() {
  const stats = getStats()
  const hatWerte = stats.some(s => s.wert && s.wert.toUpperCase() !== 'TODO')

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-16 lg:px-10">
      <header className="mb-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-wing">Zahlen</p>
        <h1 className="mt-2 font-display text-5xl uppercase tracking-tight text-ink-primary md:text-7xl">
          Das Projekt in Zahlen
        </h1>
      </header>

      {hatWerte ? (
        <Stats stats={stats} />
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-line bg-ocean-mid/30 p-8 text-center">
          <p className="font-mono text-sm uppercase tracking-wider text-ink-muted">
            Werte folgen
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Die KPI-Werte werden aus der schriftlichen Arbeit in{' '}
            <code className="text-water">content/stats.json</code> ergänzt.
          </p>
        </div>
      )}
    </div>
  )
}
