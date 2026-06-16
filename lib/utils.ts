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
