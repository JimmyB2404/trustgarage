'use client'

import { useEffect } from 'react'

export default function ViewTracker({ garageId }: { garageId: string }) {
  useEffect(() => {
    fetch('/api/garage/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ garageId }),
    }).catch(() => {})
  }, [garageId])

  return null
}
