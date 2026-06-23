'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type AdminGarage = {
  id: string
  name: string
  slug: string
  city: string
  plan: string
  suspended: boolean
  created_at: string
  reviews: { count: number }[]
}

export default function AdminGaragesTable() {
  const [garages, setGarages] = useState<AdminGarage[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/garages')
      .then(r => r.json())
      .then(({ garages }) => setGarages(garages ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function handleToggleSuspend(garage: AdminGarage) {
    setBusyId(garage.id)
    await fetch('/api/admin/garages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ garageId: garage.id, suspended: !garage.suspended }),
    })
    setGarages(prev => prev.map(g => g.id === garage.id ? { ...g, suspended: !g.suspended } : g))
    setBusyId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Deze garage en alle bijbehorende data (reviews, foto\'s, etc.) definitief verwijderen?')) return
    setBusyId(id)
    await fetch('/api/admin/garages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ garageId: id }),
    })
    setGarages(prev => prev.filter(g => g.id !== id))
    setBusyId(null)
  }

  if (loading) return <p className="text-[14px] text-neutral-400">Laden...</p>
  if (garages.length === 0) return <p className="text-[14px] text-neutral-400">Geen garages.</p>

  return (
    <div className="bg-white border border-neutral-100 rounded-[9px] overflow-hidden max-w-[860px]">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-surface text-left text-neutral-500 border-b border-neutral-100">
            <th className="px-4 py-2 font-medium">Naam</th>
            <th className="px-4 py-2 font-medium">Stad</th>
            <th className="px-4 py-2 font-medium">Plan</th>
            <th className="px-4 py-2 font-medium">Reviews</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {garages.map(g => (
            <tr key={g.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-2 text-neutral-900">
                <Link href={`/garage/${g.slug}`} target="_blank" className="hover:text-primary hover:underline">
                  {g.name}
                </Link>
              </td>
              <td className="px-4 py-2 text-neutral-500">{g.city}</td>
              <td className="px-4 py-2 text-neutral-500">{g.plan}</td>
              <td className="px-4 py-2 text-neutral-500">{g.reviews?.[0]?.count ?? 0}</td>
              <td className="px-4 py-2">
                <span className={cn(
                  'text-[11px] font-medium px-2 py-[2px] rounded-sm',
                  g.suspended ? 'bg-danger/10 text-danger' : 'bg-primary-light text-primary'
                )}>
                  {g.suspended ? 'Geschorst' : 'Actief'}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2 justify-end">
                  <Link
                    href={`/admin/garages/${g.id}`}
                    className="text-[12px] text-neutral-500 hover:text-neutral-900 hover:underline"
                  >
                    Bekijk dashboard
                  </Link>
                  <button
                    onClick={() => handleToggleSuspend(g)}
                    disabled={busyId === g.id}
                    className="text-[12px] text-neutral-500 hover:text-neutral-900 disabled:opacity-50"
                  >
                    {g.suspended ? 'Herstellen' : 'Schorsen'}
                  </button>
                  <button
                    onClick={() => handleDelete(g.id)}
                    disabled={busyId === g.id}
                    className="text-[12px] text-danger hover:underline disabled:opacity-50"
                  >
                    Verwijderen
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
