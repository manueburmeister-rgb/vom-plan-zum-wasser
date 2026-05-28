'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { ScannedImage } from '@/lib/types'

/**
 * Lightbox für Bildergalerien.
 *   - Pfeil links/rechts (Buttons + Tastatur ← →)
 *   - Schliessen via X, ESC, Klick auf Backdrop (Radix Dialog macht ESC + Backdrop)
 *   - Touch-Swipe auf Mobile
 *   - Counter "3 / 12"
 *   - Bildunterschrift unten
 *
 * Wird von Gallery gesteuert: `images`, `openIndex` (null = zu), `onClose`, `onNavigate`.
 */
export function Lightbox({
  images,
  openIndex,
  onClose,
  onNavigate,
}: {
  images: ScannedImage[]
  openIndex: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}) {
  const isOpen = openIndex !== null
  const current = isOpen ? images[openIndex] : null

  const goPrev = useCallback(() => {
    if (openIndex === null) return
    onNavigate((openIndex - 1 + images.length) % images.length)
  }, [openIndex, images.length, onNavigate])

  const goNext = useCallback(() => {
    if (openIndex === null) return
    onNavigate((openIndex + 1) % images.length)
  }, [openIndex, images.length, onNavigate])

  // Tastatur-Navigation
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, goPrev, goNext])

  // Touch-Swipe
  const touchStartX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (dx > 0) goPrev()
      else goNext()
    }
    touchStartX.current = null
  }

  if (!current) return null

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        hideClose
        className="flex h-screen w-screen max-w-none items-center justify-center p-0"
      >
        <DialogTitle className="sr-only">{current.bildunterschrift}</DialogTitle>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-30 rounded-full bg-ocean-deep/60 p-2 text-ink-primary/80 transition-colors hover:text-wing"
          aria-label="Schliessen"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Counter */}
        <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2 font-mono text-sm text-ink-primary/70">
          {openIndex! + 1} / {images.length}
        </div>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-ocean-deep/60 p-2 text-ink-primary/80 transition-colors hover:text-wing sm:left-6"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}

        {/* Bild + Caption */}
        <div
          className="flex h-full w-full flex-col items-center justify-center px-4 py-16"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative flex max-h-[80vh] w-full max-w-6xl items-center justify-center">
            <Image
              src={current.dateipfad}
              alt={current.alt_text}
              width={current.breite_px || 1600}
              height={current.hoehe_px || 1200}
              className="max-h-[80vh] w-auto object-contain"
              sizes="100vw"
              priority
            />
          </div>
          {current.bildunterschrift && (
            <p className="mt-4 max-w-2xl text-center text-sm text-ink-primary/80">
              {current.bildunterschrift}
            </p>
          )}
        </div>

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-ocean-deep/60 p-2 text-ink-primary/80 transition-colors hover:text-wing sm:right-6"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        )}
      </DialogContent>
    </Dialog>
  )
}
