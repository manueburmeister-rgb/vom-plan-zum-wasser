import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-8xl md:text-9xl uppercase tracking-wider text-wing leading-none">
        404
      </p>
      <p className="mt-6 text-lg text-ink-primary">
        Diese Seite gibt es hier nicht.
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Vielleicht ein Tippfehler in der URL?
      </p>
      <Link
        href="/"
        className="mt-12 inline-block text-sm font-mono uppercase tracking-wider text-ink-primary hover:text-wing transition-colors border-b border-line hover:border-wing pb-1"
      >
        ← Zurück zur Startseite
      </Link>
    </div>
  )
}
