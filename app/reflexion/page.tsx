import { getReflexionenNachKategorie } from '@/lib/content'
import type { ReflexionKategorie } from '@/lib/types'

export const runtime = 'nodejs'

export const metadata = { title: 'Reflexion' }

const KATEGORIE: Record<ReflexionKategorie, { label: string; color: string }> = {
  erfolg: { label: 'Erfolge', color: 'text-success' },
  herausforderung: { label: 'Herausforderungen', color: 'text-warning' },
  lesson_learned: { label: 'Lessons Learned', color: 'text-water' },
  ausblick: { label: 'Ausblick', color: 'text-wing' },
}

const REIHENFOLGE: ReflexionKategorie[] = ['erfolg', 'herausforderung', 'lesson_learned', 'ausblick']

export default function ReflexionPage() {
  const grouped = getReflexionenNachKategorie()

  // Prüfen ob echte Inhalte da sind (keine TODO-Platzhalter)
  const hatInhalt = Object.values(grouped)
    .flat()
    .some(r => !r.inhalt.startsWith('TODO') && !r.titel.startsWith('TODO'))

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-10">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-wing">Reflexion</p>
        <h1 className="mt-2 font-display text-5xl uppercase tracking-tight text-ink-primary md:text-7xl">
          Rückblick
        </h1>
        <p className="mt-3 text-ink-muted">
          Erfolge, Herausforderungen und was wir gelernt haben
        </p>
      </header>

      {!hatInhalt ? (
        <div className="rounded-lg border border-dashed border-line bg-ocean-mid/30 p-8 text-center">
          <p className="font-mono text-sm uppercase tracking-wider text-ink-muted">Inhalt folgt</p>
          <p className="mt-2 text-sm text-ink-muted">
            Die Reflexionen werden aus Kapitel 3.3 der schriftlichen Arbeit in{' '}
            <code className="text-water">content/reflexionen.json</code> übernommen.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {REIHENFOLGE.map(kat => {
            const items = (grouped[kat] ?? []).filter(
              r => !r.inhalt.startsWith('TODO') && !r.titel.startsWith('TODO')
            )
            if (items.length === 0) return null
            return (
              <section key={kat}>
                <h2 className={`mb-5 font-headline text-2xl font-bold ${KATEGORIE[kat].color}`}>
                  {KATEGORIE[kat].label}
                </h2>
                <div className="space-y-4">
                  {items.map(r => (
                    <div key={r.id} className="rounded-lg border border-line bg-ocean-mid/30 p-5">
                      <h3 className="font-headline text-lg font-bold text-ink-primary">{r.titel}</h3>
                      <p className="mt-2 leading-relaxed text-ink-primary/85">{r.inhalt}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
