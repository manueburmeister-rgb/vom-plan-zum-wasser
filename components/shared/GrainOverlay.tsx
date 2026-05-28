/**
 * Page-wide Grain-Overlay für Print-Magazin-Feeling.
 *
 * Implementation:
 *   - Fixed positioned über das ganze Viewport
 *   - SVG-Noise via inline data-URI (kein Asset-Request)
 *   - opacity 2.5% — sichtbare Textur ohne Lesbarkeit zu opfern
 *   - mix-blend-overlay sorgt dafür dass der Grain mit allem darunter interagiert
 *   - pointer-events: none, aria-hidden — komplett unsichtbar für Interaktion / Screen-Reader
 *   - z-index 1: liegt über dem Hintergrund, aber unter Content (Content hat in der Regel
 *     keinen expliziten z-index → wird je nach Stacking-Context dargestellt)
 */

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }}
    />
  )
}
