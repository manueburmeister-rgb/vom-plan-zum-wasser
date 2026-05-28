'use client'

import { useState } from 'react'
import { Gallery } from '@/components/gallery/Gallery'
import type { ScannedImage } from '@/lib/types'

export function GalerieClient({
  images,
  kapitel,
}: {
  images: ScannedImage[]
  kapitel: { slug: string; titel: string; nummer: number }[]
}) {
  const [filter, setFilter] = useState<string>('alle')

  const filtered =
    filter === 'alle' ? images : images.filter(img => img.zugehoeriges_kapitel_slug === filter)

  // Nur Kapitel mit Bildern als Chips anzeigen
  const kapitelMitBildern = kapitel.filter(k =>
    images.some(img => img.zugehoeriges_kapitel_slug === k.slug)
  )

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={filter === 'alle'} onClick={() => setFilter('alle')}>
          Alle ({images.length})
        </FilterChip>
        {kapitelMitBildern.map(k => {
          const count = images.filter(img => img.zugehoeriges_kapitel_slug === k.slug).length
          return (
            <FilterChip key={k.slug} active={filter === k.slug} onClick={() => setFilter(k.slug)}>
              {k.titel} ({count})
            </FilterChip>
          )
        })}
      </div>

      <Gallery images={filtered} columns={4} />
    </>
  )
}

function FilterChip({
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
