import { cn } from '@/lib/utils'
import { IconCircleCheck, IconLanguage, IconStar, IconClock } from '@tabler/icons-react'

type BadgeVariant = 'kvk' | 'english' | 'service' | 'premium' | 'open' | 'closed' | 'expat' | 'new' | 'recommended'

interface BadgeProps {
  variant: BadgeVariant
  label?: string
  className?: string
}

export default function Badge({ variant, label, className }: BadgeProps) {
  const base = 'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-[3px] rounded-sm whitespace-nowrap'

  if (variant === 'kvk') {
    return (
      <span className={cn(base, 'bg-primary-light text-primary', className)}>
        <IconCircleCheck size={11} />
        KVK geverifieerd
      </span>
    )
  }

  if (variant === 'english') {
    return (
      <span className={cn(base, 'bg-info-light text-info', className)}>
        <IconLanguage size={11} />
        Engels gesproken
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
        Premium lid
      </span>
    )
  }

  if (variant === 'recommended') {
    return (
      <span className={cn(base, 'bg-primary-light text-primary', className)}>
        <IconStar size={11} />
        Aanbevolen
      </span>
    )
  }

  if (variant === 'open') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-[12px] font-medium text-primary', className)}>
        <span className="w-2 h-2 rounded-full bg-primary" />
        Nu open
      </span>
    )
  }

  if (variant === 'closed') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-500', className)}>
        <IconClock size={13} />
        Gesloten
      </span>
    )
  }

  if (variant === 'new') {
    return (
      <span className={cn(base, 'bg-danger text-white rounded-full', className)}>
        Nieuw
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
