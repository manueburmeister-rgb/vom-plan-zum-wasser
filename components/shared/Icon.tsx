import {
  Compass,
  BookOpen,
  Ruler,
  Wrench,
  Waves,
  Flag,
  Calendar,
  Cpu,
  RotateCw,
  Layers,
  Scale,
  Gauge,
  type LucideIcon,
  Circle,
} from 'lucide-react'

/**
 * Mappt Icon-Namen-Strings (aus phasen.json / stats.json) auf Lucide-Komponenten.
 * Fallback: Circle, falls ein Name nicht bekannt ist.
 *
 * Neue Icons hier registrieren, wenn sie in den JSONs verwendet werden.
 */
const ICONS: Record<string, LucideIcon> = {
  Compass,
  BookOpen,
  Ruler,
  Wrench,
  Waves,
  Flag,
  Calendar,
  Cpu,
  RotateCw,
  Layers,
  Scale,
  Gauge,
}

export function Icon({
  name,
  className,
  size = 24,
}: {
  name: string
  className?: string
  size?: number
}) {
  const Cmp = ICONS[name] ?? Circle
  return <Cmp className={className} size={size} aria-hidden="true" />
}
