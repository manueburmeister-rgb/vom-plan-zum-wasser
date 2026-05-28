import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names, resolving conflicts intelligently.
 * Used by shadcn-style components for variant composition.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
