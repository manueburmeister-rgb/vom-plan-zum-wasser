'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Count-Up-Animation für Stat-Werte.
 *
 * Verhalten:
 *   - Zählt von 0 auf den Zielwert, sobald das Element in den Viewport scrollt
 *   - Funktioniert nur für numerische Werte; nicht-numerische (z.B. "TODO") werden direkt angezeigt
 *   - prefers-reduced-motion: zeigt den Endwert sofort
 *
 * `value` ist der String aus stats.json (z.B. "12", "28.5", "TODO").
 */
export function CountUp({ value, durationMs = 1400 }: { value: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState('0')

  // Parsen: Zahl + ob Dezimalstellen
  const numeric = parseFloat(value.replace(',', '.'))
  const isNumeric = !isNaN(numeric) && isFinite(numeric)
  const decimals = isNumeric && value.includes('.') ? (value.split('.')[1]?.length ?? 0) : 0

  useEffect(() => {
    if (!isNumeric) {
      setDisplay(value)
      return
    }
    if (reduce) {
      setDisplay(numeric.toFixed(decimals))
      return
    }
    if (!inView) return

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay((numeric * eased).toFixed(decimals))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(numeric.toFixed(decimals))
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, isNumeric, numeric, decimals, reduce, value, durationMs])

  return <span ref={ref}>{display}</span>
}
