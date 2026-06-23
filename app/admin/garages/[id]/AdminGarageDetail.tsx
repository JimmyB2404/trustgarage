'use client'

import { useState, useEffect } from 'react'
import { IconStarFilled, IconStar } from '@tabler/icons-react'
import { cn, getTodayHours, isGarageOpen } from '@/lib/utils'
import type { GarageData } from '@/hooks/useGarage'
import { useDashboardViews } from '@/hooks/useDashboardViews'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= Math.round(rating) ? (
          <IconStarFilled key={s} size={13} className="text-amber" />
        ) : (
          <IconStar key={s} size={13} className="text-neutral-300" />
        )
      )}
    </div>
  )
}

export default function AdminGarageDetail({ garageId }: { garageId: string }) {
  const [garage, setGarage] = useState<GarageData | null>(null)
  const [loading, setLoading] = useState(true)
  const { totalViews, loadingViews } = useDashboardViews(garage?.id)

  useEffect(() => {
    fetch(`/api/admin/garages/${garageId}`)
      .then(r => r.json())
      .then(({ garage }) => setGarage(garage ?? null))
      .finally(() => setLoading(false))
  }, [garageId])

  if (loading) return <p className="text-[14px] text-neutral-400">Laden...</p>
  if (!garage) return <p className="text-[14px] text-neutral-400">Garage niet gevonden.</p>

  const reviews = garage.reviews ?? []
  const reviewCount = reviews.length
  const avgRating = reviewCount > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : 0
  const unanswered = reviews.filter(r => r.garage_replies.length === 0).length
  const repliesGiven = reviews.filter(r => r.garage_replies.length > 0).length
  const open = isGarageOpen(garage.garage_hours.map(h => ({
    day: h.day_of_week, open: h.open_time ?? '', close: h.close_time ?? '', closed: h.is_closed,
  })))

  return (
    <div>
      <div className="bg-[#FAEEDA] text-[#633806] text-[12px] font-medium px-4 py-2 rounded-md mb-6 inline-block">
        Admin-weergave — alleen-lezen, geen wijzigingen mogelijk vanaf hier
      </div>

      <div className="bg-white border border-neutral-100 rounded-[9px] p-5 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-[18px] font-medium text-neutral-900">{garage.name}</h3>
            <p className="text-[13px] text-neutral-500">{garage.address}, {garage.city}</p>
            <p className="text-[13px] text-neutral-500 mt-1">{garage.phone} · {garage.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-[12px] text-neutral-500">
            <span className="font-medium text-neutral-900">Plan: {garage.plan}</span>
            <span>{garage.user_id ? 'Geclaimd' : 'Niet geclaimd (geen eigenaar)'}</span>
            <span>{open ? 'Nu open' : 'Gesloten'} · {getTodayHours(garage.garage_hours.map(h => ({
              day: h.day_of_week, open: h.open_time ?? '', close: h.close_time ?? '', closed: h.is_closed,
            })))}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Profielweergaven</p>
          <p className="text-[24px] font-semibold text-neutral-900 leading-none">
            {loadingViews ? '—' : totalViews}
          </p>
        </div>
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Reviews</p>
          <p className="text-[24px] font-semibold text-neutral-900 leading-none">{reviewCount}</p>
        </div>
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Gem. rating</p>
          <p className="text-[24px] font-semibold text-neutral-900 leading-none">
            {reviewCount > 0 ? avgRating.toFixed(1) : '—'}
          </p>
        </div>
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Onbeantwoord</p>
          <p className={cn('text-[24px] font-semibold leading-none', unanswered > 0 ? 'text-danger' : 'text-neutral-900')}>
            {unanswered}
          </p>
          <p className="text-[11px] text-neutral-300 mt-1">van {repliesGiven + unanswered} reviews</p>
        </div>
      </div>

      <h4 className="text-[14px] font-semibold text-neutral-900 mb-3">Reviews</h4>
      <div className="flex flex-col gap-3 max-w-[720px]">
        {reviews.length > 0 ? (
          reviews
            .slice()
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map(review => (
              <div key={review.id} className="bg-white border border-neutral-100 rounded-[9px] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-medium text-neutral-900">{review.user_name}</span>
                  {review.verified && (
                    <span className="text-[10px] font-medium px-2 py-[2px] rounded-sm bg-primary-light text-primary">
                      Geverifieerd
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Stars rating={review.rating} />
                  <span className="text-[11px] text-neutral-300">
                    {new Date(review.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-[13px] text-neutral-900 leading-relaxed">{review.text}</p>
                {review.garage_replies.length > 0 && (
                  <div className="bg-surface border border-neutral-100 rounded-md px-3 py-2 mt-3">
                    <p className="text-[11px] font-semibold text-primary mb-1">Reactie van de garage</p>
                    <p className="text-[12px] text-neutral-500 leading-relaxed">{review.garage_replies[0].text}</p>
                  </div>
                )}
              </div>
            ))
        ) : (
          <div className="bg-white border border-neutral-100 rounded-[9px] p-10 text-center">
            <p className="text-[14px] text-neutral-500">Nog geen reviews ontvangen.</p>
          </div>
        )}
      </div>
    </div>
  )
}
