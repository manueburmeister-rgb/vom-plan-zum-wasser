'use client'

import { useState, useEffect } from 'react'
import type { SektionConfig } from '@/lib/types'

/**
 * Sticky Sub-Navigation für Kapitel-Seiten.
 *   - Desktop: linke Spalte, Scroll-Spy hebt aktive Sektion hervor
 *   - Mobile: horizontale scrollbare Tab-Bar unten (fixed)
 *
 * Sektionen werden flach gelistet (sub_sektionen eingerückt).
 * Jede Sektion-id ist ein Anchor (z.B. "realisierung#backwing" → id="backwing").
 */

interface FlatSektion {
  anchor: string
  nummer: string
  titel: string
  isSub: boolean
}

function flatten(sektionen: SektionConfig[]): FlatSektion[] {
  const out: FlatSektion[] = []
  for (const s of sektionen) {
    out.push({ anchor: anchorFromId(s.id), nummer: s.nummer, titel: s.titel, isSub: false })
    if (s.sub_sektionen) {
      for (const sub of s.sub_sektionen) {
        out.push({ anchor: anchorFromId(sub.id), nummer: sub.nummer, titel: sub.titel, isSub: true })
      }
    }
  }
  return out
}

/** "realisierung#backwing" → "backwing" */
function anchorFromId(id: string): string {
  const hash = id.indexOf('#')
  return hash >= 0 ? id.slice(hash + 1) : id
}

export function ChapterSubNav({ sektionen }: { sektionen: SektionConfig[] }) {
  const flat = flatten(sektionen)
  const [active, setActive] = useState<string>(flat[0]?.anchor ?? '')

  useEffect(() => {
    if (flat.length === 0) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    for (const s of flat) {
      const el = document.getElementById(s.anchor)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [flat])

  if (flat.length === 0) return null

  const scrollTo = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Desktop: Sticky linke Spalte */}
      <nav
        className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
        aria-label="Kapitel-Sektionen"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-ink-muted">Inhalt</p>
        <ul className="space-y-1 border-l border-line">
          {flat.map(s => (
            <li key={s.anchor}>
              <button
                onClick={() => scrollTo(s.anchor)}
                className={`block w-full border-l-2 py-1.5 text-left text-sm transition-colors ${
                  s.isSub ? 'pl-7' : 'pl-4'
                } ${
                  active === s.anchor
                    ? 'border-wing text-wing'
                    : 'border-transparent text-ink-muted hover:text-ink-primary'
                }`}
              >
                <span className="font-mono text-xs opacity-60">{s.nummer}</span> {s.titel}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: fixed Bottom-Tab-Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-ocean-deep/95 backdrop-blur-md lg:hidden"
        aria-label="Kapitel-Sektionen (mobil)"
      >
        <div className="flex gap-1 overflow-x-auto px-3 py-2">
          {flat.map(s => (
            <button
              key={s.anchor}
              onClick={() => scrollTo(s.anchor)}
              className={`shrink-0 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs transition-colors ${
                active === s.anchor
                  ? 'bg-wing/20 text-wing'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              {s.nummer} {s.titel}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
