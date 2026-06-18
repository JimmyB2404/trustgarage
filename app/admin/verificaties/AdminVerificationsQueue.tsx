'use client'

import { useState, useEffect } from 'react'

type VerificationItem = {
  id: string
  user_name: string
  rating: number
  text: string
  receipt_number: string
  created_at: string
  garages: { name: string; slug: string } | null
  review_invitations: { invoice_number: string } | null
}

export default function AdminVerificationsQueue() {
  const [items, setItems] = useState<VerificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  function load() {
    fetch('/api/admin/verifications')
      .then(r => r.json())
      .then(({ items }) => setItems(items ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handle(reviewId: string, action: 'confirm' | 'reject') {
    setBusyId(reviewId)
    await fetch('/api/admin/verifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, action }),
    })
    setItems(prev => prev.filter(i => i.id !== reviewId))
    setBusyId(null)
  }

  if (loading) return <p className="text-[14px] text-neutral-400">Laden...</p>
  if (items.length === 0) return <p className="text-[14px] text-neutral-400">Geen openstaande verificaties.</p>

  return (
    <div className="flex flex-col gap-3 max-w-[720px]">
      {items.map(item => {
        const garageNumber = item.review_invitations?.invoice_number ?? '—'
        const customerNumber = item.receipt_number
        const isMatch = garageNumber === customerNumber
        return (
          <div key={item.id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-medium text-neutral-900">{item.garages?.name ?? 'Onbekende garage'}</span>
              <span className="text-[11px] text-neutral-300">
                {new Date(item.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px] mb-3">
              <div>
                <p className="text-neutral-500">Nummer (garage)</p>
                <p className="font-medium text-neutral-900">{garageNumber}</p>
              </div>
              <div>
                <p className="text-neutral-500">Nummer (klant)</p>
                <p className={isMatch ? 'font-medium text-primary' : 'font-medium text-danger'}>{customerNumber}</p>
              </div>
            </div>
            <div className="bg-surface rounded-md p-3 mb-3">
              <p className="text-[12px] text-neutral-500 mb-1">{item.user_name} — {item.rating}/5</p>
              <p className="text-[13px] text-neutral-900">{item.text}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handle(item.id, 'confirm')}
                disabled={busyId === item.id}
                className="btn-primary text-[12px] py-[6px] px-3 disabled:opacity-50"
              >
                Geverifieerd
              </button>
              <button
                onClick={() => handle(item.id, 'reject')}
                disabled={busyId === item.id}
                className="btn-ghost text-[12px] py-[6px] px-3 disabled:opacity-50"
              >
                Afwijzen
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
