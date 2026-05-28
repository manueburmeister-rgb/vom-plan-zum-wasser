'use client'

import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'
import { MoveHorizontal } from 'lucide-react'
import type { Vergleich, ScannedImage } from '@/lib/types'

/**
 * Vergleichs-Komponente (Before/After).
 *   - typ "slider": Drag-Handle zum Überblenden (Maus + Touch + Keyboard)
 *   - typ "nebeneinander": zwei Bilder nebeneinander
 *   - typ "ueberblendung": wie nebeneinander (vereinfacht), könnte später Crossfade werden
 *
 * Bekommt den Vergleich + die beiden aufgelösten Bilder (vom Server via findImageById).
 */
export function Comparison({
  vergleich,
  bildLinks,
  bildRechts,
}: {
  vergleich: Vergleich
  bildLinks: ScannedImage | null
  bildRechts: ScannedImage | null
}) {
  // Wenn ein Bild fehlt (z.B. TODO-Platzhalter), zeigen wir einen dezenten Hinweis statt Crash
  if (!bildLinks || !bildRechts) {
    return (
      <figure className="my-10 overflow-hidden rounded-lg border border-dashed border-line bg-ocean-mid/30 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
          Vergleich „{vergleich.titel}"
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Bilder noch nicht zugeordnet ({vergleich.bild_links_dateiname} ↔{' '}
          {vergleich.bild_rechts_dateiname})
        </p>
      </figure>
    )
  }

  return (
    <figure className="my-10">
      {vergleich.typ === 'nebeneinander' || vergleich.typ === 'ueberblendung' ? (
        <SideBySide bildLinks={bildLinks} bildRechts={bildRechts} vergleich={vergleich} />
      ) : (
        <SliderCompare bildLinks={bildLinks} bildRechts={bildRechts} vergleich={vergleich} />
      )}

      <figcaption className="mt-4">
        <p className="font-headline text-sm font-bold text-ink-primary">{vergleich.titel}</p>
        {vergleich.erklaerung && !vergleich.erklaerung.startsWith('TODO') && (
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{vergleich.erklaerung}</p>
        )}
      </figcaption>
    </figure>
  )
}

function SliderCompare({
  bildLinks,
  bildRechts,
  vergleich,
}: {
  bildLinks: ScannedImage
  bildRechts: ScannedImage
  vergleich: Vergleich
}) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(0, Math.min(100, pct)))
  }, [])

  const onMouseDown = () => {
    dragging.current = true
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) updateFromClientX(e.clientX)
  }
  const stopDrag = () => {
    dragging.current = false
  }
  const onTouchMove = (e: React.TouchEvent) => {
    updateFromClientX(e.touches[0].clientX)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPos(p => Math.max(0, p - 5))
    else if (e.key === 'ArrowRight') setPos(p => Math.min(100, p + 5))
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-lg border border-line"
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={onTouchMove}
    >
      {/* Rechtes Bild (Hintergrund, volle Breite) */}
      <Image
        src={bildRechts.dateipfad}
        alt={bildRechts.alt_text}
        fill
        sizes="(max-width: 1024px) 100vw, 800px"
        className="object-cover"
      />
      <span className="absolute right-3 top-3 z-10 rounded bg-ocean-deep/70 px-2 py-1 font-mono text-xs text-ink-primary">
        {vergleich.beschriftung_rechts}
      </span>

      {/* Linkes Bild (overlay, beschnitten auf pos%) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div className="relative h-full" style={{ width: containerRef.current?.offsetWidth ?? '100%' }}>
          <Image
            src={bildLinks.dateipfad}
            alt={bildLinks.alt_text}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>
        <span className="absolute left-3 top-3 z-10 rounded bg-ocean-deep/70 px-2 py-1 font-mono text-xs text-ink-primary">
          {vergleich.beschriftung_links}
        </span>
      </div>

      {/* Drag-Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Vergleich ${vergleich.titel}: ${Math.round(pos)}%`}
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="absolute top-0 z-20 h-full w-1 cursor-ew-resize bg-wing focus:outline-none focus-visible:ring-2 focus-visible:ring-wing"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        onKeyDown={onKeyDown}
      >
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-wing text-ocean-deep shadow-lg">
          <MoveHorizontal className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function SideBySide({
  bildLinks,
  bildRechts,
  vergleich,
}: {
  bildLinks: ScannedImage
  bildRechts: ScannedImage
  vergleich: Vergleich
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { img: bildLinks, label: vergleich.beschriftung_links },
        { img: bildRechts, label: vergleich.beschriftung_rechts },
      ].map(({ img, label }, i) => (
        <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line">
          <Image
            src={img.dateipfad}
            alt={img.alt_text}
            fill
            sizes="(max-width: 1024px) 50vw, 400px"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 rounded bg-ocean-deep/70 px-2 py-1 font-mono text-xs text-ink-primary">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
