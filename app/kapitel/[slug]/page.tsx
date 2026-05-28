import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getKapitelBySlug, getKapitelNachbarn, getKapitel } from '@/lib/content'
import { getHeroImage } from '@/lib/images'
import { ChapterHero } from '@/components/chapter/ChapterHero'
import { ChapterSubNav } from '@/components/chapter/ChapterSubNav'
import { siteConfig } from '@/site.config'
import type { Metadata } from 'next'

export const runtime = 'nodejs'

// Statische Generierung aller Kapitel-Slugs
export function generateStaticParams() {
  return getKapitel().map(k => ({ slug: k.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const kapitel = getKapitelBySlug(params.slug)
  if (!kapitel) return {}
  return {
    title: kapitel.titel,
    description: kapitel.untertitel ?? `${kapitel.titel} — ${siteConfig.title}`,
  }
}

export default async function KapitelPage({ params }: { params: { slug: string } }) {
  const kapitel = getKapitelBySlug(params.slug)
  if (!kapitel) notFound()

  const heroImage = await getHeroImage(kapitel.slug, kapitel.hero_bild_dateiname)
  const { vorheriges, naechstes } = getKapitelNachbarn(kapitel.slug)

  // MDX-Inhalt dynamisch laden. Dateiname: NN-slug.mdx
  const mdxFilename = `${String(kapitel.nummer).padStart(2, '0')}-${kapitel.slug}`
  let MdxContent: React.ComponentType | null = null
  try {
    const mod = await import(`@/content/kapitel/${mdxFilename}.mdx`)
    MdxContent = mod.default
  } catch {
    MdxContent = null
  }

  return (
    <article className="pb-24 lg:pb-12">
      <ChapterHero kapitel={kapitel} heroImage={heroImage} />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-screen-2xl px-5 pt-8 lg:px-10">
        <nav className="font-mono text-xs text-ink-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-wing">
            Start
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-primary">{kapitel.titel}</span>
        </nav>
      </div>

      {/* Layout: Sub-Nav links (Desktop) + Inhalt */}
      <div className="mx-auto max-w-screen-2xl px-5 pt-8 lg:px-10">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          {kapitel.sektionen.length > 0 ? (
            <aside>
              <ChapterSubNav sektionen={kapitel.sektionen} />
            </aside>
          ) : (
            <div className="hidden lg:block" />
          )}

          <div className="min-w-0 max-w-prose">
            {MdxContent ? (
              <div className="mdx-content">
                <MdxContent />
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-ocean-mid/30 p-8 text-center">
                <p className="font-mono text-sm uppercase tracking-wider text-ink-muted">
                  Inhalt folgt
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  Die MDX-Datei <code className="text-water">{mdxFilename}.mdx</code> ist noch nicht
                  angelegt.
                </p>
              </div>
            )}

            {/* Kapitel-Navigation */}
            <nav className="mt-16 flex items-stretch justify-between gap-4 border-t border-line pt-8">
              {vorheriges ? (
                <Link
                  href={`/kapitel/${vorheriges.slug}`}
                  className="group flex flex-1 flex-col gap-1 rounded-lg border border-line p-4 transition-colors hover:border-wing/50"
                >
                  <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                    <ArrowLeft className="h-3 w-3" /> Vorheriges
                  </span>
                  <span className="font-headline font-bold text-ink-primary group-hover:text-wing">
                    {vorheriges.titel}
                  </span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {naechstes ? (
                <Link
                  href={`/kapitel/${naechstes.slug}`}
                  className="group flex flex-1 flex-col items-end gap-1 rounded-lg border border-line p-4 text-right transition-colors hover:border-wing/50"
                >
                  <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                    Nächstes <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="font-headline font-bold text-ink-primary group-hover:text-wing">
                    {naechstes.titel}
                  </span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </nav>
          </div>
        </div>
      </div>
    </article>
  )
}
