import { getGlossar } from '@/lib/content'
import { GlossarClient } from './GlossarClient'

export const runtime = 'nodejs'

export const metadata = { title: 'Glossar' }

export default function GlossarPage() {
  const eintraege = getGlossar()

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-10">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-wing">Glossar</p>
        <h1 className="mt-2 font-display text-5xl uppercase tracking-tight text-ink-primary md:text-7xl">
          Begriffe
        </h1>
        <p className="mt-3 text-ink-muted">
          Fachbegriffe rund um Hydrofoils, Material und Fertigung
        </p>
      </header>

      <GlossarClient eintraege={eintraege} />
    </div>
  )
}
