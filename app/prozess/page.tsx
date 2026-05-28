import { getPhasen } from '@/lib/content'
import { Timeline } from '@/components/shared/Timeline'

export const runtime = 'nodejs'

export const metadata = { title: 'Prozess' }

export default function ProzessPage() {
  const phasen = getPhasen()

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-16 lg:px-10">
      <header className="mb-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-wing">Prozess</p>
        <h1 className="mt-2 font-display text-5xl uppercase tracking-tight text-ink-primary md:text-7xl">
          Der Entwicklungsweg
        </h1>
        <p className="mt-3 text-ink-muted">Von der ersten Idee bis zum Test auf dem Wasser</p>
      </header>

      <Timeline phasen={phasen} />
    </div>
  )
}
