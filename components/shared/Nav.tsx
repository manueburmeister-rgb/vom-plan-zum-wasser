'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '@/site.config'

/**
 * Sticky Top-Nav.
 *   - Desktop: Wordmark links, Nav-Items mittig, IDPA-Hinweis rechts
 *   - Mobile: Wordmark links, Hamburger rechts → Vollbild-Overlay
 *   - Hintergrund mit backdrop-blur fuer Glas-Effekt ueber Hero-Bildern
 */
export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // ESC schliesst Mobile-Menu, Body-Scroll lock wenn offen
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ocean-deep/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-5 py-4 lg:px-10">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-xl md:text-2xl uppercase tracking-wider text-ink-primary hover:text-wing transition-colors"
          aria-label={`${siteConfig.title} — zur Startseite`}
        >
          {siteConfig.title}
        </Link>

        {/* Desktop-Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Hauptnavigation">
          {siteConfig.navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="font-headline text-sm uppercase tracking-wide text-ink-muted hover:text-ink-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Rechte Seite */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline font-mono text-xs uppercase tracking-wider text-ink-muted">
            IDPA {siteConfig.idpaJahr}
          </span>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-ink-primary hover:text-wing transition-colors"
            aria-label="Menu öffnen"
            aria-expanded={mobileOpen}
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Mobile-Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-ocean-deep flex flex-col lg:hidden animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="flex justify-between items-center px-5 py-4 border-b border-line/60">
            <span className="font-display text-xl uppercase tracking-wider text-ink-primary">
              {siteConfig.title}
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="text-ink-primary hover:text-wing transition-colors"
              aria-label="Menu schliessen"
            >
              <X size={28} />
            </button>
          </div>

          <nav
            className="flex-1 flex flex-col justify-center items-start px-8 gap-6"
            aria-label="Mobile Hauptnavigation"
          >
            {siteConfig.navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-4xl uppercase tracking-wide text-ink-primary hover:text-wing transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-8 border-t border-line/60 font-mono text-xs uppercase tracking-wider text-ink-muted">
            IDPA {siteConfig.idpaJahr} · {siteConfig.schule}
          </div>
        </div>
      )}
    </header>
  )
}
