import { cn } from '@/lib/utils'
import { IconCircleCheck, IconLanguage, IconStar, IconClock } from '@tabler/icons-react'

type BadgeVariant = 'kvk' | 'english' | 'service' | 'premium' | 'open' | 'closed' | 'expat' | 'new' | 'recommended'

interface BadgeProps {
  variant: BadgeVariant
  label?: string
  className?: string
  locale?: 'nl' | 'en'
}

const TEXT = {
  nl: {
    kvk: 'KVK geverifieerd',
    english: 'Engels gesproken',
    premium: 'Premium lid',
    recommended: 'Aanbevolen',
    open: 'Nu open',
    closed: 'Gesloten',
    new: 'Nieuw',
  },
  en: {
    kvk: 'KVK verified',
    english: 'English spoken',
    premium: 'Premium member',
    recommended: 'Recommended',
    open: 'Open now',
    closed: 'Closed',
    new: 'New',
  },
}

export default function Badge({ variant, label, className, locale = 'nl' }: BadgeProps) {
  const t = TEXT[locale]
  const base = 'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-[3px] rounded-sm whitespace-nowrap'

  if (variant === 'kvk') {
    return (
      <span className={cn(base, 'bg-primary-light text-primary', className)}>
        <IconCircleCheck size={11} />
        {t.kvk}
      </span>
    )
  }

  if (variant === 'english') {
    return (
      <span className={cn(base, 'bg-info-light text-info', className)}>
        <IconLanguage size={11} />
        {t.english}
      </span>
    )
  }

  if (variant === 'service') {
    return (
      <span className={cn(base, 'bg-[#F5F5F5] text-neutral-500 font-normal', className)}>
        {label}
      </span>
    )
  }

  if (variant === 'premium') {
    return (
      <span className={cn(base, 'bg-[#FAEEDA] text-[#633806]', className)}>
        <IconStar size={11} />
        {t.premium}
      </span>
    )
  }

  if (variant === 'recommended') {
    return (
      <span className={cn(base, 'bg-primary-light text-primary', className)}>
        <IconStar size={11} />
        {t.recommended}
      </span>
    )
  }

  if (variant === 'open') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-[12px] font-medium text-primary', className)}>
        <span className="w-2 h-2 rounded-full bg-primary" />
        {t.open}
      </span>
    )
  }

  if (variant === 'closed') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-500', className)}>
        <IconClock size={13} />
        {t.closed}
      </span>
    )
  }

  if (variant === 'new') {
    return (
      <span className={cn(base, 'bg-danger text-white rounded-full', className)}>
        {t.new}
      </span>
    )
  }

  if (variant === 'expat') {
    return (
      <span className={cn(base, 'bg-info-light text-info', className)}>
        {label}
      </span>
    )
  }

  return null
}
