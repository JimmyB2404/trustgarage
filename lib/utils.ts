import type { GarageHours } from '@/types'
import { DAY_NAMES } from '@/lib/mock-data'

export function isGarageOpen(hours: GarageHours[]): boolean {
  const now = new Date()
  const today = hours.find(h => h.day === now.getDay())
  if (!today || today.closed) return false
  const [openH, openM] = today.open.split(':').map(Number)
  const [closeH, closeM] = today.close.split(':').map(Number)
  const current = now.getHours() * 60 + now.getMinutes()
  return current >= openH * 60 + openM && current < closeH * 60 + closeM
}

export function getTodayHours(hours: GarageHours[]): string {
  const now = new Date()
  const today = hours.find(h => h.day === now.getDay())
  if (!today || today.closed) return 'Vandaag gesloten'
  return `${today.open} – ${today.close}`
}

export function getDayName(day: number): string {
  return DAY_NAMES[day] ?? ''
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Komt overeen met de "max. 5 MB"-tekst bij elke foto/logo-upload — zonder deze check accepteert
// de browser gewoon elk bestand (bv. een 15MB foto rechtstreeks van een telefoon/tablet-camera),
// die dan op de server kan stranden op een platformlimiet zonder duidelijke foutmelding.
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024

export function validatePhotoSize(file: File): string | null {
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return `"${file.name}" is te groot (max. 5 MB per foto).`
  }
  return null
}

export const COUNTRY_FLAGS: Record<string, string> = {
  GB: '🇬🇧',
  US: '🇺🇸',
  DE: '🇩🇪',
  FR: '🇫🇷',
  IT: '🇮🇹',
  ES: '🇪🇸',
  PL: '🇵🇱',
  TR: '🇹🇷',
  MA: '🇲🇦',
  NL: '🇳🇱',
}
