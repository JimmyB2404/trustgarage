'use client'

import { useState, useEffect, useCallback } from 'react'

export type AppointmentRequest = {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  preferred_date: string | null
  message: string | null
  status: 'nieuw' | 'afgehandeld'
  created_at: string
}

export function useAppointments(garageId: string | undefined) {
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!garageId) return
    const res = await fetch(`/api/garage/appointments?garageId=${garageId}`)
    const { appointments } = await res.json()
    setAppointments(appointments ?? [])
  }, [garageId])

  useEffect(() => {
    if (!garageId) { setLoading(false); return }
    setLoading(true)
    refetch().finally(() => setLoading(false))
  }, [garageId, refetch])

  return { appointments, loading, refetch }
}
