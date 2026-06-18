'use client'

import { useState, useEffect, useCallback } from 'react'

export type ReviewInvitation = {
  id: string
  customer_email: string
  invoice_number: string
  status: 'sent' | 'used' | 'expired'
  created_at: string
  reviews: { id: string; verified: boolean } | null
}

export function useInvitations(garageId: string | undefined) {
  const [invitations, setInvitations] = useState<ReviewInvitation[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!garageId) return
    const res = await fetch(`/api/garage/invitations?garageId=${garageId}`)
    const { invitations } = await res.json()
    setInvitations(invitations ?? [])
  }, [garageId])

  useEffect(() => {
    if (!garageId) { setLoading(false); return }
    setLoading(true)
    refetch().finally(() => setLoading(false))
  }, [garageId, refetch])

  return { invitations, loading, refetch }
}
