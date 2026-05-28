'use client'

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import type { GlossarEintrag } from '@/lib/types'

/**
 * Inline-Glossar-Begriff mit Hover/Focus-Tooltip.
 *   - Pink unterstrichener Begriff im Fliesstext
 *   - Tooltip zeigt die Definition
 *   - Keyboard-zugänglich (Focus triggert Tooltip via Radix)
 *
 * Wird als Client-Komponente in MDX/Text verwendet:
 *   <Begriff eintrag={...}>Hydrofoil</Begriff>
 */
export function GlossarTooltip({
  eintrag,
  children,
}: {
  eintrag: GlossarEintrag
  children: React.ReactNode
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            tabIndex={0}
            className="cursor-help border-b border-dashed border-wing/60 text-wing/90 transition-colors hover:text-wing focus:outline-none focus-visible:ring-2 focus-visible:ring-wing"
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-headline text-sm font-bold text-wing">{eintrag.begriff}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-primary/90">{eintrag.definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
