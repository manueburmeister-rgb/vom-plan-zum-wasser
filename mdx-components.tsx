/**
 * MDX-Komponenten-Registry für @next/mdx (App Router).
 *
 * Hier werden Custom-Komponenten registriert, die in .mdx-Dateien direkt
 * verwendet werden können (<Bild>, <Vergleich>, <Pull>), plus gestylte
 * HTML-Element-Defaults (Prose-Look passend zum Dark-Theme).
 */

import type { MDXComponents } from 'mdx/types'
import { BildMDX } from '@/components/chapter/BildMDX'
import { VergleichMDX } from '@/components/chapter/VergleichMDX'
import { PullQuote } from '@/components/chapter/PullQuote'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // === Custom-Komponenten ===
    Bild: BildMDX as never,
    Vergleich: VergleichMDX as never,
    Pull: PullQuote as never,

    // === HTML-Element-Styling (Prose) ===
    h2: ({ children, ...props }) => (
      <h2
        className="mt-14 mb-4 scroll-mt-28 font-headline text-3xl font-bold tracking-tight text-ink-primary md:text-4xl"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mt-10 mb-3 scroll-mt-28 font-headline text-2xl font-bold text-ink-primary"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="mt-6 mb-2 font-headline text-xl font-bold text-ink-primary" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p className="my-4 text-lg leading-relaxed text-ink-primary/90" {...props}>
        {children}
      </p>
    ),
    a: ({ children, ...props }) => (
      <a className="text-water underline underline-offset-2 hover:text-water-light" {...props}>
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-lg text-ink-primary/90" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-lg text-ink-primary/90" {...props}>
        {children}
      </ol>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="my-6 border-l-4 border-wing pl-6 italic text-ink-primary/80" {...props}>
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => (
      <code
        className="rounded bg-code px-1.5 py-0.5 font-mono text-sm text-water"
        {...props}
      >
        {children}
      </code>
    ),
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border-b border-line px-4 py-2 font-headline text-xs uppercase tracking-wider text-ink-muted"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border-b border-line/50 px-4 py-2 font-mono text-ink-primary/90" {...props}>
        {children}
      </td>
    ),
    hr: () => <hr className="my-10 border-line" />,
    ...components,
  }
}
