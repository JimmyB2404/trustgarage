import { IconCircleCheck } from '@tabler/icons-react'
import type { Review } from '@/types'
import StarRating from './StarRating'
import { getInitials, COUNTRY_FLAGS } from '@/lib/utils'

interface ReviewCardProps {
  review: Review
}

const CATEGORY_LABELS: Record<string, string> = {
  eerlijkheid: 'Eerlijkheid',
  prijs: 'Prijs',
  snelheid: 'Snelheid',
  communicatie: 'Communicatie',
  engels: 'Engelstalig',
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const avatarBg = review.is_expat ? '#185FA5' : '#0F6E56'
  const flag = review.user_country ? COUNTRY_FLAGS[review.user_country] : undefined
  const date = new Date(review.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="border border-[#EFEFEF] rounded-[9px] p-[14px] bg-white">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="flex-shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[12px] font-medium"
          style={{ backgroundColor: avatarBg }}
        >
          {getInitials(review.user_name)}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-neutral-900">{review.user_name}</span>
            {review.is_expat && flag && (
              <span className="inline-flex items-center gap-1 bg-info-light text-info text-[10px] font-medium px-2 py-[2px] rounded-sm">
                {flag} Expat
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} size={12} />
            <span className="text-[11px] text-[#AAAAAA]">{date}</span>
          </div>
        </div>
      </div>

      {/* Text */}
      <p className="mt-2 text-[13px] text-[#444] leading-[1.6]">{review.text}</p>

      {/* Sub-ratings */}
      {review.ratings.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
          {review.ratings.map(r => (
            <div key={r.category} className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-500">{CATEGORY_LABELS[r.category]}</span>
              <div className="flex items-center gap-1">
                <div className="w-12 h-[3px] bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(r.score / 5) * 100}%` }} />
                </div>
                <span className="text-neutral-900 font-medium">{r.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Garage reply */}
      {review.reply && (
        <div className="mt-3 bg-surface border-t border-[#F0F0F0] border-l-[3px] border-l-primary rounded-sm pl-3 pr-3 py-2">
          <div className="text-[12px] font-medium text-primary mb-1">Reactie van de garage</div>
          <p className="text-[12px] text-[#444] leading-[1.5]">{review.reply.text}</p>
        </div>
      )}

      {/* Verified */}
      {review.verified && (
        <div className="mt-2 flex items-center gap-1 text-[11px] text-primary">
          <IconCircleCheck size={12} />
          Geverifieerd bezoek
        </div>
      )}
    </div>
  )
}
