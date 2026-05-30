import { siteConfig } from '@/site.config'

export const metadata = { title: 'Impressum' }

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-10">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-wing">Impressum</p>
        <h1 className="mt-2 font-display text-5xl uppercase tracking-tight text-ink-primary md:text-7xl">
          Impressum
        </h1>
      </header>

      {/* Über das Projekt */}
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold text-ink-primary mb-4">
          Über das Projekt
        </h2>
        <p className="leading-relaxed text-ink-muted">
          Diese Webseite ist Teil der Interdisziplinären Projektarbeit (IDPA){' '}
          <span className="text-ink-primary">«{siteConfig.title} – {siteConfig.subtitle}»</span>{' '}
          von Manue Burmeister und Dimitri Mühlebach. Sie begleitet die schriftliche Arbeit und
          dokumentiert den Entwicklungsprozess unseres Hydrofoils mit Bildgalerien, CAD-Vergleichen
          und einem Glossar.
        </p>
        <div className="mt-4 space-y-1 text-ink-primary">
          <p>{siteConfig.schule}</p>
          <p className="text-ink-muted">{siteConfig.klasse}</p>
          <p className="text-ink-muted">Betreuung: {siteConfig.betreuung}</p>
          <p className="text-ink-muted">Abgabe: {siteConfig.abgabeFormatiert}</p>
        </div>
      </section>

      {/* Hauptdokument */}
      <section className="mb-12 rounded-lg border border-line bg-ocean-mid/30 p-6">
        <h2 className="font-headline text-lg font-bold text-ink-primary mb-2">
          Schriftliche Arbeit als Hauptdokument
        </h2>
        <p className="leading-relaxed text-ink-muted">
          Die vollständige Arbeit mit allen Quellenangaben, Abbildungsverzeichnis und der
          Eigenständigkeitserklärung wurde als schriftliches Dokument eingereicht. Diese Webseite
          dient als ergänzende digitale Dokumentation und ersetzt die Arbeit nicht.
        </p>
      </section>

      {/* Quellen */}
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold text-ink-primary mb-4">
          Verwendete Quellen
        </h2>
        <p className="leading-relaxed text-ink-muted mb-6">
          Die folgenden externen Quellen wurden für die Recherche und Konzeption verwendet:
        </p>

        <ul className="space-y-4 text-sm leading-relaxed text-ink-muted">
          <li>
            <span className="text-ink-primary">Lötscher / Zeller (2023).</span>{' '}
            Gleitschirmfliegen. Schweizerischer Hängegleiterverband SHV.
          </li>

          <li>
            <span className="text-ink-primary">Näf, Michael (29. Oktober 2025).</span>{' '}
            Persönliches Gespräch.
          </li>

          <li>
            <span className="text-ink-primary">How do hydrofoils work – a deep dive into the physics (2022).</span>{' '}
            YouTube. Abgerufen am 14. Dezember 2025.{' '}
            <a
              href="https://www.youtube.com/watch?v=fzig8JR2iT0"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              www.youtube.com/watch?v=fzig8JR2iT0
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Make Forged Carbon Fibre Parts Using Compression Moulding (2021).</span>{' '}
            YouTube. Abgerufen am 02. Januar 2026.{' '}
            <a
              href="https://www.youtube.com/watch?v=25PmqM24HEk"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              www.youtube.com/watch?v=25PmqM24HEk
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Making a Composite Mould for a Carbon Fibre Part from a 3D Printed Pattern (2021).</span>{' '}
            YouTube. Abgerufen am 02. Januar 2026.{' '}
            <a
              href="https://www.youtube.com/watch?v=KpJdwryFj6k"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              www.youtube.com/watch?v=KpJdwryFj6k
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Hand Laminating a Carbon Fibre Part Directly into a 3D Printed Mould (2021).</span>{' '}
            YouTube. Abgerufen am 02. Januar 2026.{' '}
            <a
              href="https://www.youtube.com/watch?v=4ND2WtEZatY"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              www.youtube.com/watch?v=4ND2WtEZatY
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Airfoil Tools.</span>{' '}
            <a
              href="http://airfoiltools.com/airfoil/details?airfoil=naca2412-il"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              airfoiltools.com/airfoil/details?airfoil=naca2412-il
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Autodesk Fusion 360.</span>{' '}
            <a
              href="https://www.autodesk.com/ch-de/products/fusion-360/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              autodesk.com/ch-de/products/fusion-360/overview
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Bambu Lab.</span>{' '}
            <a
              href="https://bambulab.com/de-de/download/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              bambulab.com/de-de/download/studio
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Duotone Sports – Front Wings.</span>{' '}
            <a
              href="https://www.duotonesports.com/en/ch/wing-foiling/foils/front-wings/front-wings"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              duotonesports.com/en/ch/wing-foiling/foils/front-wings/front-wings
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Dynamism – Carbon Fiber Molds from 3D Printed Patterns.</span>{' '}
            Abgerufen am 02. Januar 2026.{' '}
            <a
              href="https://www.dynamism.com/learn/automotive/how-to-create-carbon-fiber-molds-from-3d-printed-patterns.html"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              dynamism.com/learn/automotive/how-to-create-carbon-fiber-molds-from-3d-printed-patterns.html
            </a>
          </li>

          <li>
            <span className="text-ink-primary">ENSIS – Michael Näf.</span>{' '}
            <a
              href="https://ensis.surf/pages/team-rider/michael-naef"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              ensis.surf/pages/team-rider/michael-naef
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Geeetech Blog – PETG vs. ABS Filament.</span>{' '}
            <a
              href="https://blog.geeetech.com/deutschekolumne/petg-vs-abs-filament-so-wahlst-du-das-richtige-material-fur-dein-projekt/"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              blog.geeetech.com – PETG vs. ABS Filament
            </a>
          </li>

          <li>
            <span className="text-ink-primary">LEIFIphysik – Auftrieb (Bionik).</span>{' '}
            <a
              href="https://www.leifiphysik.de/uebergreifend/bionik/grundwissen/auftrieb"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              leifiphysik.de/uebergreifend/bionik/grundwissen/auftrieb
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Purefil – ABS Filament.</span>{' '}
            <a
              href="https://www.purefil.ch/purefil-abs-filament_150_1100"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              purefil.ch/purefil-abs-filament_150_1100
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Shape3D – User Manual.</span>{' '}
            <a
              href="https://www.shape3d.com/Support/User_Manual_V9.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              shape3d.com/Support/User_Manual_V9.htm
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Suter Kunststoffe AG.</span>{' '}
            <a
              href="https://www.swiss-composite.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              swiss-composite.ch
            </a>
          </li>

          <li>
            <span className="text-ink-primary">Bildquelle Hydrofoil-Übersicht.</span>{' '}
            cdn.shopify.com – Mast.{' '}
            <a
              href="https://cdn.shopify.com/s/files/1/0307/0551/6677/files/Mast_1_480x480.png?v=1663333527"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-wing hover:underline"
            >
              cdn.shopify.com (Bild)
            </a>
          </li>
        </ul>
      </section>

      {/* Bildrechte */}
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold text-ink-primary mb-4">
          Bildrechte
        </h2>
        <p className="leading-relaxed text-ink-muted">
          Sämtliche Fotos, CAD-Darstellungen und Skizzen auf dieser Webseite sind, sofern nicht
          anders gekennzeichnet, eigene Aufnahmen und Darstellungen von Manue Burmeister und
          Dimitri Mühlebach. Verwendete Vergleichs- und Referenzbilder von Drittanbietern
          (Duotone, ENSIS, LEIFIphysik, cdn.shopify.com sowie aus den Lehrbüchern von
          Lötscher/Zeller) sind in der schriftlichen Arbeit im Abbildungsverzeichnis vollständig
          ausgewiesen.
        </p>
      </section>

      {/* Urheberrecht */}
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold text-ink-primary mb-4">
          Urheberrecht
        </h2>
        <p className="leading-relaxed text-ink-muted">
          Die Inhalte dieser Webseite (Texte, Bilder, Konzept) unterliegen dem Schweizer
          Urheberrecht. Eine Vervielfältigung oder Verwendung in anderen Medien ist nur mit
          ausdrücklicher Zustimmung der Autoren gestattet. Verlinkungen auf diese Seite sind
          erwünscht.
        </p>
      </section>

      {/* Haftungsausschluss */}
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold text-ink-primary mb-4">
          Haftungsausschluss
        </h2>
        <p className="leading-relaxed text-ink-muted">
          Die auf dieser Webseite dokumentierten Konstruktionen, Materialien und Verfahren wurden
          im Rahmen eines schulischen Projekts entwickelt. Die Inhalte dienen ausschliesslich der
          Dokumentation. Eine Nachahmung der beschriebenen Verfahren erfolgt auf eigenes Risiko.
          Für externe Links übernehmen wir keine Verantwortung über die Inhalte der verlinkten
          Seiten.
        </p>
      </section>
    </div>
  )
}
