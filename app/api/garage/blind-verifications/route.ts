import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function getOwnedGarageId(userId: string, supabase: ReturnType<typeof getSupabase>) {
  const { data } = await supabase.from('garages').select('id').eq('user_id', userId).single()
  return data?.id ?? null
}

// GET — garage's blinde wachtrij: ALLEEN bonnummer + datum, nooit tekst/rating/naam.
// Dit is het belangrijkste implementatiedetail van Pad B — de garage mag nooit kunnen zien
// welke specifieke review bij welk bonnummer hoort, anders kan men gericht saboteren.
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const supabase = getSupabase()
  const garageId = await getOwnedGarageId(user.id, supabase)
  if (!garageId) return NextResponse.json({ error: 'Geen garage gevonden.' }, { status: 403 })

  const { data, error } = await supabase
    .from('reviews')
    .select('id, receipt_number, created_at')
    .eq('garage_id', garageId)
    .eq('verification_path', 'organic')
    .eq('verification_status', 'pending_garage')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ items: data ?? [] })
}

// POST { reviewId, action } — garage bevestigt/wijst af op basis van het bonnummer zelf,
// blind voor de inhoud van de review.
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const { reviewId, action } = await req.json()
  if (!reviewId || (action !== 'confirm' && action !== 'reject')) {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })
  }

  const supabase = getSupabase()
  const garageId = await getOwnedGarageId(user.id, supabase)
  if (!garageId) return NextResponse.json({ error: 'Geen garage gevonden.' }, { status: 403 })

  // Ownership van de review zelf checken — alleen reviews van de eigen garage mogen aangepast worden.
  const { data: review } = await supabase
    .from('reviews')
    .select('id, garage_id, verification_path, verification_status')
    .eq('id', reviewId)
    .single()

  if (!review || review.garage_id !== garageId || review.verification_path !== 'organic' || review.verification_status !== 'pending_garage') {
    return NextResponse.json({ error: 'Review niet gevonden in wachtrij.' }, { status: 404 })
  }

  if (action === 'confirm') {
    // Niet direct naar 'verified' — eerst nog een laatste handmatige check door de platform-admin,
    // zelfde eindstap als Pad A. De garage blijft wel de eerste (blinde) poort.
    await supabase
      .from('reviews')
      .update({ verification_status: 'pending_admin' })
      .eq('id', reviewId)
  } else {
    await supabase
      .from('reviews')
      .update({ verification_status: 'rejected' })
      .eq('id', reviewId)
  }

  return NextResponse.json({ success: true })
}
