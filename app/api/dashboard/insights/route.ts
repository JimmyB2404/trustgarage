import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type GarageMetrics = {
  avgRating: number
  reviewCount: number
  responseRate: number
}

function computeMetrics(reviews: { rating: number; garage_replies: { id: string }[] }[]): GarageMetrics {
  const reviewCount = reviews.length
  const avgRating = reviewCount > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : 0
  const answered = reviews.filter(r => r.garage_replies.length > 0).length
  const responseRate = reviewCount > 0 ? (answered / reviewCount) * 100 : 0
  return { avgRating, reviewCount, responseRate }
}

export async function GET(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const garageId = searchParams.get('garageId')
  if (!garageId) return NextResponse.json({ error: 'garageId ontbreekt.' }, { status: 400 })

  const supabase = getSupabase()

  const { data: garage } = await supabase
    .from('garages')
    .select('id, name, city, plan, user_id')
    .eq('id', garageId)
    .eq('user_id', user.id)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 403 })

  if (garage.plan !== 'business') {
    return NextResponse.json({ gated: true })
  }

  // Eigen reviews
  const { data: ownReviews } = await supabase
    .from('reviews')
    .select('rating, garage_replies(id)')
    .eq('garage_id', garageId)

  // Andere, niet-geschorste garages in dezelfde stad — voor het regionale gemiddelde.
  const { data: regionalGarages } = await supabase
    .from('garages')
    .select('id, reviews(rating, garage_replies(id))')
    .eq('city', garage.city)
    .eq('suspended', false)
    .neq('id', garageId)

  const own = computeMetrics(ownReviews ?? [])

  const regionalMetrics = (regionalGarages ?? []).map(g => computeMetrics(g.reviews ?? []))
  const regionalWithReviews = regionalMetrics.filter(m => m.reviewCount > 0)
  const regional = {
    avgRating: regionalWithReviews.length > 0
      ? regionalWithReviews.reduce((s, m) => s + m.avgRating, 0) / regionalWithReviews.length
      : 0,
    avgReviewCount: regionalMetrics.length > 0
      ? regionalMetrics.reduce((s, m) => s + m.reviewCount, 0) / regionalMetrics.length
      : 0,
    avgResponseRate: regionalWithReviews.length > 0
      ? regionalWithReviews.reduce((s, m) => s + m.responseRate, 0) / regionalWithReviews.length
      : 0,
    garageCount: regionalMetrics.length,
  }

  return NextResponse.json({ gated: false, city: garage.city, own, regional })
}
