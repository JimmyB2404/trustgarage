'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IconMapPin, IconCircleCheck, IconPhone, IconClock, IconGitCompare } from '@tabler/icons-react'
import type { Garage } from '@/types'
import Badge from './Badge'
import StarRating from './StarRating'
import FavoriteButton from './FavoriteButton'
import { getTodayHours, isGarageOpen } from '@/lib/utils'
import { SERVICE_LABELS_EN } from '@/lib/mock-data'

interface GarageCardProps {
  garage: Garage
  variant?: 'vertical' | 'horizontal'
  featured?: boolean
  locale?: 'nl' | 'en'
  compareSelected?: boolean
  onToggleCompare?: () => void
  compareDisabled?: boolean
}

const TEXT = {
  nl: { kvk: 'KVK geverifieerd', call: 'Bellen', viewProfile: 'Bekijk profiel', reviews: 'reviews', compare: 'Vergelijken' },
  en: { kvk: 'KVK verified', call: 'Call', viewProfile: 'View profile', reviews: 'reviews', compare: 'Compare' },
}

export default function GarageCard({
  garage,
  variant = 'vertical',
  featured = false,
  locale = 'nl',
  compareSelected = false,
  onToggleCompare,
  compareDisabled = false,
}: GarageCardProps) {
  const t = TEXT[locale]
  const open = garage.is_open ?? isGarageOpen(garage.hours)
  const todayHours = getTodayHours(garage.hours, locale)
  const router = useRouter()
  const href = locale === 'en' ? `/en/garage/${garage.slug}` : `/garage/${garage.slug}`
  const serviceLabel = (s: string) => locale === 'en' ? (SERVICE_LABELS_EN[s] ?? s) : s

  if (variant === 'vertical') {
    // Vertical: footer has no links, safe to wrap entire card in Link
    return (
      <Link href={href} className="block group">
        <div className={`bg-white border rounded-xl shadow-card transition-all duration-150 hover:shadow-card-hover hover:border-neutral-300 overflow-hidden ${featured ? 'border-t-[3px] border-t-primary border-neutral-100' : 'border-neutral-100'}`}>
          <div className="relative h-[140px] bg-surface overflow-hidden flex items-center justify-center">
            {garage.photos[0] ? (
              <Image
                src={garage.photos[0]}
                alt={garage.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-serif text-lg">
                {garage.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="p-[14px]">
            {featured && (
              <Badge variant="recommended" className="mb-2" locale={locale} />
            )}
            <h3 className="text-[15px] font-medium text-neutral-900 leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
              {garage.name}
            </h3>
            <div className="flex items-center gap-1 text-[12px] text-[#888] mb-2">
              <IconMapPin size={12} />
              <span>{garage.address}, {garage.city}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={garage.rating} size={13} showNumber count={garage.review_count} />
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {garage.services.slice(0, 3).map(s => (
                <Badge key={s} variant="service" label={serviceLabel(s)} locale={locale} />
              ))}
              {garage.services.length > 3 && (
                <span className="text-[11px] text-neutral-500">+{garage.services.length - 3}</span>
              )}
            </div>
          </div>

          <div className="px-[14px] py-[10px] bg-[#FAFAFA] border-t border-[#F5F5F5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {garage.kvk_verified && (
                <span className="flex items-center gap-1 text-[11px] text-primary">
                  <IconCircleCheck size={12} />
                  KVK
                </span>
              )}
              {open ? <Badge variant="open" locale={locale} /> : <Badge variant="closed" locale={locale} />}
            </div>
            <span className="text-[12px] text-neutral-500">{todayHours}</span>
          </div>
        </div>
      </Link>
    )
  }

  // Horizontal variant: footer has <a href="tel:"> so we use a div + onClick to avoid nested <a>
  return (
    <div
      className={`bg-white border rounded-xl shadow-card transition-all duration-150 hover:shadow-card-hover hover:border-neutral-300 overflow-hidden cursor-pointer group ${featured ? 'border-l-[3px] border-l-primary border-neutral-100' : 'border-neutral-100'}`}
      onClick={() => router.push(href)}
      role="article"
    >
      <div className="flex gap-4 p-[14px]">
        <div className="relative flex-shrink-0 w-[60px] h-[60px] rounded-lg overflow-hidden bg-surface border border-neutral-100 flex items-center justify-center">
          {garage.logo_url ? (
            <Image src={garage.logo_url} alt={garage.name} fill sizes="60px" className="object-cover" />
          ) : (
            <span className="text-primary font-serif text-xl">{garage.name.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              {featured && <Badge variant="recommended" className="mb-1" locale={locale} />}
              <h3 className="text-[16px] font-medium text-neutral-900 group-hover:text-primary transition-colors">
                {garage.name}
              </h3>
              <div className="flex items-center gap-1 text-[12px] text-[#888] mt-0.5">
                <IconMapPin size={12} />
                <span>{garage.address}, {garage.city}</span>
                {garage.distance !== undefined && (
                  <>
                    <span className="text-neutral-300">·</span>
                    <span>{garage.distance.toFixed(1)} km</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <StarRating rating={garage.rating} size={13} showNumber />
              <div className="text-[11px] text-neutral-500 mt-0.5">{garage.review_count} {t.reviews}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {garage.services.slice(0, 4).map(s => (
              <Badge key={s} variant="service" label={serviceLabel(s)} locale={locale} />
            ))}
            {garage.languages.includes('Engels') && (
              <Badge variant="english" locale={locale} />
            )}
          </div>
        </div>
      </div>

      <div className="px-[14px] py-[10px] bg-[#FAFAFA] border-t border-[#F5F5F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {garage.kvk_verified && (
            <span className="flex items-center gap-1 text-[11px] text-primary">
              <IconCircleCheck size={12} />
              {t.kvk}
            </span>
          )}
          {open ? <Badge variant="open" locale={locale} /> : <Badge variant="closed" locale={locale} />}
          <span className="text-[12px] text-neutral-500 flex items-center gap-1">
            <IconClock size={12} />
            {todayHours}
          </span>
          <FavoriteButton
            garageId={garage.id}
            initialCount={garage.favorites_count ?? 0}
            showCount={true}
            size={15}
          />
          {onToggleCompare && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onToggleCompare() }}
              disabled={compareDisabled}
              className={`flex items-center gap-1 text-[12px] transition-colors ${
                compareSelected ? 'text-primary font-medium' : compareDisabled ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-500 hover:text-primary'
              }`}
            >
              <IconGitCompare size={14} />
              {t.compare}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${garage.phone}`}
            onClick={e => e.stopPropagation()}
            className="hidden sm:flex items-center gap-1 bg-transparent text-neutral-900 border border-neutral-100 hover:bg-surface rounded-md text-[12px] py-[6px] px-3 transition-colors"
          >
            <IconPhone size={13} />
            {t.call}
          </a>
          <Link
            href={href}
            onClick={e => e.stopPropagation()}
            className="bg-primary text-white hover:bg-primary-dark rounded-md text-[12px] py-[6px] px-3 transition-colors"
          >
            {t.viewProfile}
          </Link>
        </div>
      </div>
    </div>
  )
}
