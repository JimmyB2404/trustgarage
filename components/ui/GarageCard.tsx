'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconMapPin, IconCircleCheck, IconPhone, IconClock } from '@tabler/icons-react'
import type { Garage } from '@/types'
import Badge from './Badge'
import StarRating from './StarRating'
import { getTodayHours, isGarageOpen } from '@/lib/utils'

interface GarageCardProps {
  garage: Garage
  variant?: 'vertical' | 'horizontal'
  featured?: boolean
}

export default function GarageCard({ garage, variant = 'vertical', featured = false }: GarageCardProps) {
  const open = garage.is_open ?? isGarageOpen(garage.hours)
  const todayHours = getTodayHours(garage.hours)
  const router = useRouter()
  const href = `/garage/${garage.slug}`

  if (variant === 'vertical') {
    // Vertical: footer has no links, safe to wrap entire card in Link
    return (
      <Link href={href} className="block group">
        <div className={`bg-white border rounded-xl shadow-card transition-all duration-150 hover:shadow-card-hover hover:border-neutral-300 overflow-hidden ${featured ? 'border-t-[3px] border-t-primary border-neutral-100' : 'border-neutral-100'}`}>
          <div className="h-[140px] bg-surface overflow-hidden flex items-center justify-center">
            {garage.photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={garage.photos[0]} alt={garage.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-serif text-lg">
                {garage.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="p-[14px]">
            {featured && garage.plan === 'premium' && (
              <Badge variant="recommended" className="mb-2" />
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
                <Badge key={s} variant="service" label={s} />
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
              {open ? <Badge variant="open" /> : <Badge variant="closed" />}
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
        <div className="flex-shrink-0 w-[60px] h-[60px] rounded-lg overflow-hidden bg-surface border border-neutral-100 flex items-center justify-center">
          {garage.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={garage.logo_url} alt={garage.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-serif text-xl">{garage.name.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              {featured && <Badge variant="recommended" className="mb-1" />}
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
              <div className="text-[11px] text-neutral-500 mt-0.5">{garage.review_count} reviews</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {garage.services.slice(0, 4).map(s => (
              <Badge key={s} variant="service" label={s} />
            ))}
            {garage.languages.includes('Engels') && (
              <Badge variant="english" />
            )}
          </div>
        </div>
      </div>

      <div className="px-[14px] py-[10px] bg-[#FAFAFA] border-t border-[#F5F5F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {garage.kvk_verified && (
            <span className="flex items-center gap-1 text-[11px] text-primary">
              <IconCircleCheck size={12} />
              KVK geverifieerd
            </span>
          )}
          {open ? <Badge variant="open" /> : <Badge variant="closed" />}
          <span className="text-[12px] text-neutral-500 flex items-center gap-1">
            <IconClock size={12} />
            {todayHours}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${garage.phone}`}
            onClick={e => e.stopPropagation()}
            className="hidden sm:flex items-center gap-1 bg-transparent text-neutral-900 border border-neutral-100 hover:bg-surface rounded-md text-[12px] py-[6px] px-3 transition-colors"
          >
            <IconPhone size={13} />
            Bellen
          </a>
          <Link
            href={href}
            onClick={e => e.stopPropagation()}
            className="bg-primary text-white hover:bg-primary-dark rounded-md text-[12px] py-[6px] px-3 transition-colors"
          >
            Bekijk profiel
          </Link>
        </div>
      </div>
    </div>
  )
}
