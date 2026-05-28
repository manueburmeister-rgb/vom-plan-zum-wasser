'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from './Lightbox'
import type { ScannedImage } from '@/lib/types'

/**
 * Bildergalerie-Grid.
 *   - Responsive Grid (2 Spalten Mobile, 3-4 Desktop)
 *   - Klick auf Thumbnail öffnet Lightbox
 *   - Videos (.mp4) werden hier herausgefiltert (next/image kann sie nicht)
 *
 * `columns` steuert die Desktop-Spaltenzahl (default 3).
 */
export function Gallery({
  images,
  columns = 3,
}: {
  images: ScannedImage[]
  columns?: 2 | 3 | 4
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Videos rausfiltern (next/image-inkompatibel)
  const photos = images.filter(img => !img.dateipfad.toLowerCase().endsWith('.mp4'))

  if (photos.length === 0) return null

  const colClass =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 4
        ? 'sm:grid-cols-3 lg:grid-cols-4'
        : 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <>
      <div className={`grid grid-cols-2 gap-3 ${colClass}`}>
        {photos.map((img, i) => (
          <button
            key={img.dateipfad}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-ocean-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wing"
            aria-label={`Bild öffnen: ${img.alt_text}`}
          >
            <Image
              src={img.dateipfad}
              alt={img.alt_text}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ocean-deep/0 transition-colors group-hover:bg-ocean-deep/20" />
          </button>
        ))}
      </div>

      <Lightbox
        images={photos}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  )
}
