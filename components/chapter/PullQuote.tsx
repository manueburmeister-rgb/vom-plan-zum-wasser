import type { ReactNode } from 'react'

/**
 * <Pull>...</Pull> — Pull-Quote für hervorgehobene Aussagen in MDX.
 * Pinker linker Rand, grössere Schrift.
 */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-8 border-l-4 border-wing pl-6">
      <p className="font-headline text-xl font-medium leading-relaxed text-ink-primary md:text-2xl">
        {children}
      </p>
    </blockquote>
  )
}
