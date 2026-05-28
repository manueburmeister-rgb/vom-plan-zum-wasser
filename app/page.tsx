import { Hero } from '@/components/shared/Hero'
import { Stats } from '@/components/shared/Stats'
import { Timeline } from '@/components/shared/Timeline'
import { ChapterGrid } from '@/components/shared/ChapterGrid'
import { getStats, getPhasen, getKapitel } from '@/lib/content'
import { getHeroImage, getTitelbild } from '@/lib/images'
import type { ScannedImage } from '@/lib/types'

// Scanner nutzt fs/sharp → Node-Runtime erzwingen
export const runtime = 'nodejs'

export default async function Home() {
  const stats = getStats()
  const phasen = getPhasen()
  const kapitel = getKapitel()

  // Hero-Titelbild aus /public/images/hero/
  const heroImage = await getTitelbild()

  // Pro Kapitel ein Vorschaubild für das Grid
  const heroMap: Record<string, ScannedImage | null> = {}
  for (const k of kapitel) {
    heroMap[k.slug] = await getHeroImage(k.slug, k.hero_bild_dateiname)
  }

  return (
    <>
      <Hero heroImage={heroImage} />
      <Stats stats={stats} />
      <Timeline phasen={phasen} />
      <ChapterGrid kapitel={kapitel} heroMap={heroMap} />
    </>
  )
}
