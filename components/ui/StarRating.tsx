import { IconStar, IconStarFilled, IconStarHalfFilled } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  size?: number
  showNumber?: boolean
  count?: number
  className?: string
}

export default function StarRating({ rating, size = 14, showNumber = false, count, className }: StarRatingProps) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="inline-flex items-center" style={{ color: '#EF9F27' }}>
        {Array.from({ length: full }).map((_, i) => (
          <IconStarFilled key={`f${i}`} size={size} />
        ))}
        {half && <IconStarHalfFilled size={size} />}
        {Array.from({ length: empty }).map((_, i) => (
          <IconStar key={`e${i}`} size={size} />
        ))}
      </span>
      {showNumber && (
        <span className="text-[13px] font-medium text-neutral-900">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-[12px] text-neutral-500">({count})</span>
      )}
    </span>
  )
}
