import type { Garage } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformGarage(raw: any): Garage {
  const reviews = raw.reviews ?? []
  const rating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
      : 0

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    address: raw.address ?? '',
    city: raw.city ?? '',
    kvk_number: raw.kvk_number ?? '',
    kvk_verified: raw.kvk_verified ?? false,
    description: raw.description ?? '',
    phone: raw.phone ?? '',
    email: raw.email ?? '',
    website: raw.website ?? '',
    plan: raw.plan ?? 'free',
    rating: Math.round(rating * 10) / 10,
    review_count: reviews.length,
    services: (raw.garage_services ?? []).map((s: { service_name: string }) => s.service_name),
    languages: (raw.garage_languages ?? []).map((l: { language: string }) => l.language),
    hours: (raw.garage_hours ?? []).map((h: {
      day_of_week: number
      open_time: string | null
      close_time: string | null
      is_closed: boolean
    }) => ({
      day: h.day_of_week,
      open: h.open_time ?? '',
      close: h.close_time ?? '',
      closed: h.is_closed ?? false,
    })),
    photos: (raw.garage_photos ?? []).map((p: { url: string }) => p.url),
    created_at: raw.created_at,
  }
}

const GARAGE_SELECT = `
  *,
  garage_services(service_name),
  garage_languages(language),
  garage_hours(day_of_week, open_time, close_time, is_closed),
  garage_photos(id, url),
  reviews(rating)
`

export async function fetchGarages(limit?: number): Promise<Garage[]> {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let query = supabase
    .from('garages')
    .select(GARAGE_SELECT)
    .order('plan', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data } = await query
  return (data ?? []).map(transformGarage)
}

export async function fetchGarageBySlug(slug: string): Promise<Garage | null> {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('garages')
    .select(GARAGE_SELECT)
    .eq('slug', slug)
    .single()

  return data ? transformGarage(data) : null
}
