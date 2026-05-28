'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { Search } from 'lucide-react'
import type { GlossarEintrag, GlossarKategorie } from '@/lib/types'

const KATEGORIE_LABEL: Record<GlossarKategorie, string> = {
  physik: 'Physik',
  material: 'Material',
  fertigung: 'Fertigung',
  software: 'Software',
  sportart: 'Sportart',
  komponente: 'Komponente',
}

export function GlossarClient({ eintraege }: { eintraege: GlossarEintrag[] }) {
  const [query, setQuery] = useState('')
  const [kategorie, setKategorie] = useState<string>('alle')

  const fuse = useMemo(
    () =>
      new Fuse(eintraege, {
        keys: ['begriff', 'definition'],
        threshold: 0.4,
      }),
    [eintraege]
  )

  const gefiltert = useMemo(() => {
    let result = eintraege
    if (query.trim()) {
      result = fuse.search(query).map(r => r.item)
    }
    if (kategorie !== 'alle') {
      result = result.filter(e => e.kategorie === kategorie)
    }
    // Alphabetisch
    return [...result].sort((a, b) => a.begriff.localeCompare(b.begriff, 'de'))
  }, [query, kategorie, eintraege, fuse])

  const vorhandeneKategorien = Array.from(new Set(eintraege.map(e => e.kategorie)))

  return (
    <>
      {/* Suche */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Begriff suchen…"
          className="w-full rounded-lg border border-line bg-ocean-mid/40 py-3 pl-11 pr-4 text-ink-primary placeholder:text-ink-muted focus:border-wing focus:outline-none"
        />
      </div>

      {/* Kategorie-Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={kategorie === 'alle'} onClick={() => setKategorie('alle')}>
          Alle
        </Chip>
        {vorhandeneKategorien.map(k => (
          <Chip key={k} active={kategorie === k} onClick={() => setKategorie(k)}>
            {KATEGORIE_LABEL[k]}
          </Chip>
        ))}
      </div>

      {/* Liste */}
      {gefiltert.length === 0 ? (
        <p className="py-12 text-center text-ink-muted">Keine Begriffe gefunden.</p>
      ) : (
        <dl className="space-y-4">
          {gefiltert.map(e => (
            <div key={e.begriff} className="rounded-lg border border-line bg-ocean-mid/30 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="font-headline text-xl font-bold text-ink-primary">{e.begriff}</dt>
                <span className="shrink-0 rounded-sm bg-ocean-shallow px-2 py-0.5 font-mono text-xs text-water">
                  {KATEGORIE_LABEL[e.kategorie]}
                </span>
              </div>
              <dd className="mt-2 leading-relaxed text-ink-primary/85">{e.definition}</dd>
              {e.siehe_auch && e.siehe_auch.length > 0 && (
                <p className="mt-3 font-mono text-xs text-ink-muted">
                  Siehe auch: {e.siehe_auch.join(', ')}
                </p>
              )}
            </div>
          ))}
        </dl>
      )}
    </>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-wing bg-wing/15 text-wing'
          : 'border-line text-ink-muted hover:border-ink-muted hover:text-ink-primary'
      }`}
    >
      {children}
    </button>
  )
}
