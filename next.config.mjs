import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Statischer Export: erzeugt reine HTML+CSS+JS-Dateien beim Build,
  // KEINE Serverless Functions. Perfekt fuer diese Read-Only-Doku-Seite
  // und umgeht das Vercel-300MB-Function-Limit (das Bilder im public/-Bundle nicht packt).
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  images: {
    // Bei static export muss Next.js Image-Optimization deaktiviert sein.
    // Bilder werden direkt aus /public ausgeliefert.
    unoptimized: true,
  },
  // Trailing slash: bessere Kompatibilitaet mit statischen Hostern
  trailingSlash: true,
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
