'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type AdminReview = {
  id: string
  user_name: string
  rating: number
  text: string
  verified: boolean
  created_at: string
  garages: { name: string; slug: string } | null
  review_reports: { id: string; reason: string | null; created_at: string }[]
}

export default function AdminReviewsTable() {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'alle' | 'gerapporteerd'>('alle')

  useEffect(() => {
    fetch('/api/admin/reviews')
      .then(r => r.json())
      .then(({ reviews }) => setReviews(reviews ?? []))
      .finally(() => setLoading(false))
  }, [])

  function reportCount(r: AdminReview): number {
    return r.review_reports?.length ?? 0
  }

  async function handleDelete(id: string) {
    if (!confirm('Deze review definitief verwijderen?')) return
    setBusyId(id)
    await fetch('/api/admin/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId: id }),
    })
    setReviews(prev => prev.filter(r => r.id !== id))
    setBusyId(null)
  }

  const visible = filter === 'gerapporteerd' ? reviews.filter(r => reportCount(r) > 0) : reviews

  if (loading) return <p className="text-[14px] text-neutral-400">Laden...</p>

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('alle')}
          className={cn('text-[12px] px-3 py-[6px] rounded-md', filter === 'alle' ? 'bg-primary text-white' : 'bg-surface text-neutral-500')}
        >
          Alle ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('gerapporteerd')}
          className={cn('text-[12px] px-3 py-[6px] rounded-md', filter === 'gerapporteerd' ? 'bg-primary text-white' : 'bg-surface text-neutral-500')}
        >
          Gerapporteerd ({reviews.filter(r => reportCount(r) > 0).length})
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-[14px] text-neutral-400">Geen reviews.</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-[720px]">
          {visible.map(r => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-neutral-900">{r.garages?.name ?? 'Onbekende garage'}</span>
                  {reportCount(r) > 0 && (
                    <span className="text-[10px] font-medium px-2 py-[2px] rounded-sm bg-danger/10 text-danger">
                      {reportCount(r)}× gerapporteerd
                    </span>
                  )}
                  {r.verified && (
                    <span className="text-[10px] font-medium px-2 py-[2px] rounded-sm bg-primary-light text-primary">
                      Geverifieerd
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-300">
                  {new Date(r.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="bg-surface rounded-md p-3 mb-3">
                <p className="text-[12px] text-neutral-500 mb-1">{r.user_name} — {r.rating}/5</p>
                <p className="text-[13px] text-neutral-900">{r.text}</p>
              </div>
              {r.review_reports.length > 0 && (
                <div className="bg-danger/5 border border-danger/20 rounded-md p-3 mb-3">
                  <p className="text-[11px] font-medium text-danger mb-1">Rapportages</p>
                  <ul className="flex flex-col gap-1">
                    {r.review_reports.map(report => (
                      <li key={report.id} className="text-[12px] text-neutral-900">
                        {report.reason || <span className="text-neutral-300">Geen reden opgegeven</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => handleDelete(r.id)}
                disabled={busyId === r.id}
                className="btn-ghost text-[12px] py-[6px] px-3 text-danger disabled:opacity-50"
              >
                {busyId === r.id ? 'Bezig...' : 'Verwijderen'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
