import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const { garageId, phone, kvkNumber } = await req.json()
  if (!garageId || !phone?.trim()) {
    return NextResponse.json({ error: 'Vul uw telefoonnummer in.' }, { status: 400 })
  }

  const supabase = getSupabase()

  const { data: garage } = await supabase
    .from('garages')
    .select('id, user_id')
    .eq('id', garageId)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 404 })
  if (garage.user_id) return NextResponse.json({ error: 'Deze garage is al geclaimd.' }, { status: 400 })

  const { data: existing } = await supabase
    .from('garage_claims')
    .select('id, status')
    .eq('garage_id', garageId)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) return NextResponse.json({ success: true, alreadyPending: true })

  const { error } = await supabase.from('garage_claims').insert({
    garage_id: garageId,
    user_id: user.id,
    phone: phone.trim(),
    kvk_number: kvkNumber?.trim() || null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true, alreadyPending: false })
}

export async function GET(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const garageId = searchParams.get('garageId')
  if (!garageId) return NextResponse.json({ error: 'garageId ontbreekt.' }, { status: 400 })

  const supabase = getSupabase()
  const { data } = await supabase
    .from('garage_claims')
    .select('status')
    .eq('garage_id', garageId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ status: data?.status ?? null })
}
