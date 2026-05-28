'use client'

import { useEffect, useState } from 'react'

/**
 * Scroll-Progress-Indikator.
 *   - Fixed top, ueber dem Sticky-Header
 *   - Pinker Strich, dehnt sich beim Scrollen aus
 *   - z-50 — darf von nichts anderem ueberlagert werden
 *   - Passive scroll-Listener, kein Performance-Issue
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const docEl = document.documentElement
      const max = docEl.scrollHeight - docEl.clientHeight
      const p = max > 0 ? (docEl.scrollTop / max) * 100 : 0
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-wing transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
