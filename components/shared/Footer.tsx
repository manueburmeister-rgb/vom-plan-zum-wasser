import Link from 'next/link'
import { siteConfig } from '@/site.config'

export function Footer() {
  const autorenString = siteConfig.autoren
    .map(a => `${a.vorname} ${a.nachname}`)
    .join(' & ')

  return (
    <footer className="mt-32 border-t border-line/60 bg-ocean-mid/40">
      <div className="mx-auto max-w-screen-2xl px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Wordmark + Meta */}
          <div>
            <Link
              href="/"
              className="font-display text-3xl uppercase tracking-wider text-ink-primary hover:text-wing transition-colors"
            >
              {siteConfig.title}
            </Link>
            <p className="mt-3 max-w-sm text-sm text-ink-muted leading-relaxed">
              {siteConfig.subtitle}. IDPA {siteConfig.idpaJahr} · {siteConfig.schule} · {siteConfig.klasse}.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-headline text-xs uppercase tracking-wider text-ink-muted mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {siteConfig.navItems.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-primary hover:text-wing transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kapitel */}
          <div>
            <h4 className="font-headline text-xs uppercase tracking-wider text-ink-muted mb-4">
              Kapitel
            </h4>
            <ul className="space-y-2">
              {siteConfig.kapitel.map(k => (
                <li key={k.slug}>
                  <Link
                    href={`/kapitel/${k.slug}`}
                    className="text-sm text-ink-primary hover:text-wing transition-colors"
                  >
                    {k.nummer}. {k.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Schule */}
          <div>
            <h4 className="font-headline text-xs uppercase tracking-wider text-ink-muted mb-4">
              Schule
            </h4>
            <p className="text-sm text-ink-primary">{siteConfig.schule}</p>
            <p className="text-sm text-ink-muted">{siteConfig.klasse}</p>
            <p className="mt-3 text-sm text-ink-muted">
              Betreuung
              <br />
              <span className="text-ink-primary">{siteConfig.betreuung}</span>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line/60 flex flex-col sm:flex-row justify-between gap-3 text-xs text-ink-muted">
          <p>
            © {siteConfig.idpaJahr} {autorenString}. Alle Bildrechte beim Team.
          </p>
          <p className="font-mono uppercase tracking-wider">
            IDPA {siteConfig.idpaJahr} · {siteConfig.klasse}
          </p>
        </div>
      </div>
    </footer>
  )
}
