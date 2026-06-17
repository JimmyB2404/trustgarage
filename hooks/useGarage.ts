'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export type GarageHour = {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export type GarageReview = {
  id: string
  user_name: string
  user_country: string | null
  is_expat: boolean
  rating: number
  text: string
  language: string
  verified: boolean
  created_at: string
  review_ratings: { category: string; score: number }[]
  garage_replies: { id: string; text: string; created_at: string }[]
}

export type GarageData = {
  id: string
  user_id: string
  name: string
  slug: string
  address: string
  city: string
  phone: string
  email: string
  website: string
  description: string
  kvk_number: string | null
  kvk_verified: boolean
  plan: string
  rating: number
  review_count: number
  garage_services: { service_name: string }[]
  garage_languages: { language: string }[]
  garage_hours: GarageHour[]
  garage_photos: { id: string; url: string }[]
  reviews: GarageReview[]
}

export function useGarage() {
  const { user } = useAuth()
  const [garage, setGarage] = useState<GarageData | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from('garages')
      .select(`
        *,
        garage_services(service_name),
        garage_languages(language),
        garage_hours(day_of_week, open_time, close_time, is_closed),
        garage_photos(id, url),
        reviews(
          id, user_name, user_country, is_expat, rating, text, language, verified, created_at,
          review_ratings(category, score),
          garage_replies(id, text, created_at)
        )
      `)
      .eq('user_id', user.id)
      .single()
    if (data) setGarage(data as GarageData)
  }, [user])

  useEffect(() => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    refetch().finally(() => setLoading(false))
  }, [user, refetch])

  return { garage, loading, refetch }
}
