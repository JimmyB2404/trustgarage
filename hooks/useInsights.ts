'use client'

import { useState, useEffect } from 'react'

export type InsightsData = {
  gated: boolean
  city?: string
  own?: { avgRating: number; reviewCount: number; responseRate: number }
  regional?: { avgRating: number; avgReviewCount: number; avgResponseRate: number; garageCount: number }
}

export function useInsights(garageId: string | undefined) {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!garageId) { setLoading(false); return }
    setLoading(true)
    fetch(`/api/dashboard/insights?garageId=${garageId}`)
      .then(r => r.json())
      .then(data => setInsights(data))
      .finally(() => setLoading(false))
  }, [garageId])

  return { insights, loading }
}
