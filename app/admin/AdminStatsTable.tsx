'use client'

import { useState, useEffect } from 'react'

type GarageStat = {
  id: string
  name: string
  slug: string
  reviewCount: number
  invitationCount: number
}

export default function AdminStatsTable() {
  const [garages, setGarages] = useState<GarageStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(({ garages }) => setGarages(garages ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-[14px] text-neutral-400">Laden...</p>
  }

  if (garages.length === 0) {
    return <p className="text-[14px] text-neutral-400">Nog geen garages.</p>
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-surface text-left text-neutral-500 border-b border-neutral-100">
            <th className="px-4 py-2 font-medium">Garage</th>
            <th className="px-4 py-2 font-medium text-right">Reviews</th>
            <th className="px-4 py-2 font-medium text-right">Uitnodigingen verstuurd</th>
            <th className="px-4 py-2 font-medium text-right">Ratio</th>
          </tr>
        </thead>
        <tbody>
          {garages.map(g => {
            const ratio = g.invitationCount > 0
              ? (g.reviewCount / g.invitationCount).toFixed(2)
              : '—'
            return (
              <tr key={g.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-2 text-neutral-900">{g.name}</td>
                <td className="px-4 py-2 text-right">{g.reviewCount}</td>
                <td className="px-4 py-2 text-right">{g.invitationCount}</td>
                <td className="px-4 py-2 text-right text-neutral-500">{ratio}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
