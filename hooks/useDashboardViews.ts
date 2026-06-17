'use client'

import { useState, useEffect } from 'react'

export type WeekViewDay = {
  day: string
  views: number
  isToday: boolean
}

const DAY_SHORT = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']

export function useDashboardViews(garageId: string | undefined) {
  const [weekViews, setWeekViews] = useState<WeekViewDay[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [loadingViews, setLoadingViews] = useState(true)

  useEffect(() => {
    if (!garageId) { setLoadingViews(false); return }

    fetch(`/api/dashboard/views?garageId=${garageId}`)
      .then(r => r.json())
      .then(({ total, recent }: { total: number; recent: { viewed_at: string }[] }) => {
        setTotalViews(total)

        const week: WeekViewDay[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          d.setHours(0, 0, 0, 0)
          const next = new Date(d)
          next.setDate(next.getDate() + 1)
          const dayCount = recent.filter(v => {
            const vd = new Date(v.viewed_at)
            return vd >= d && vd < next
          }).length
          week.push({ day: DAY_SHORT[d.getDay()], views: dayCount, isToday: i === 0 })
        }
        setWeekViews(week)
        setLoadingViews(false)
      })
      .catch(() => setLoadingViews(false))
  }, [garageId])

  return { weekViews, totalViews, loadingViews }
}
