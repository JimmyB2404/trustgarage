'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type Claim = {
  id: string
  user_id: string
  phone: string
  kvk_number: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  claimantEmail: string | null
  garages: { id: string; name: string; slug: string; phone: string | null; kvk_number: string | null } | null
}

export default function AdminClaimsQueue() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/claims')
      .then(r => r.json())
      .then(({ claims }) => setClaims(claims ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function handleAction(claimId: string, action: 'approve' | 'reject') {
    if (action === 'reject' && !confirm('Deze claim afwijzen?')) return
    setBusyId(claimId)
    await fetch('/api/admin/claims', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, action }),
    })
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: action === 'approve' ? 'approved' : 'rejected' } : c))
    setBusyId(null)
  }

  const pending = claims.filter(c => c.status === 'pending')
  const handled = claims.filter(c => c.status !== 'pending')

  if (loading) return <p className="text-[14px] text-neutral-400">Laden...</p>

  return (
    <div>
      <h2 className="text-[14px] font-semibold text-neutral-900 mb-3">Openstaand ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className="text-[13px] text-neutral-400 mb-8">Geen openstaande claim-aanvragen.</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-[720px] mb-8">
          {pending.map(claim => {
            const phoneMatch = claim.garages?.phone && claim.garages.phone === claim.phone
            const kvkMatch = claim.garages?.kvk_number && claim.kvk_number && claim.garages.kvk_number === claim.kvk_number
            return (
              <div key={claim.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium text-neutral-900">{claim.garages?.name ?? 'Onbekende garage'}</span>
                  <span className="text-[11px] text-neutral-300">
                    {new Date(claim.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-[12px] text-neutral-500 mb-2">Aanvrager: {claim.claimantEmail ?? '—'}</p>
                <div className="grid grid-cols-2 gap-3 text-[12px] mb-3">
                  <div>
                    <p className="text-neutral-500">Telefoon (opgegeven)</p>
                    <p className={cn('font-medium', phoneMatch ? 'text-primary' : 'text-neutral-900')}>{claim.phone}</p>
                    <p className="text-neutral-300 mt-1">Op profiel: {claim.garages?.phone ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">KVK-nummer (opgegeven)</p>
                    <p className={cn('font-medium', kvkMatch ? 'text-primary' : 'text-neutral-900')}>{claim.kvk_number ?? '—'}</p>
                    <p className="text-neutral-300 mt-1">Op profiel: {claim.garages?.kvk_number ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(claim.id, 'approve')}
                    disabled={busyId === claim.id}
                    className="btn-primary text-[12px] py-[6px] px-3 disabled:opacity-50"
                  >
                    Goedkeuren
                  </button>
                  <button
                    onClick={() => handleAction(claim.id, 'reject')}
                    disabled={busyId === claim.id}
                    className="btn-ghost text-[12px] py-[6px] px-3 disabled:opacity-50"
                  >
                    Afwijzen
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {handled.length > 0 && (
        <>
          <h2 className="text-[14px] font-semibold text-neutral-900 mb-3">Afgehandeld</h2>
          <div className="flex flex-col gap-2 max-w-[720px]">
            {handled.map(claim => (
              <div key={claim.id} className="flex items-center justify-between text-[13px] px-4 py-3 bg-white border border-neutral-100 rounded-[9px]">
                <span className="text-neutral-900">{claim.garages?.name ?? 'Onbekende garage'} — {claim.claimantEmail}</span>
                <span className={cn(
                  'text-[11px] font-medium px-2 py-[2px] rounded-sm',
                  claim.status === 'approved' ? 'bg-primary-light text-primary' : 'bg-danger/10 text-danger'
                )}>
                  {claim.status === 'approved' ? 'Goedgekeurd' : 'Afgewezen'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
