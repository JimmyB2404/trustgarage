import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { transformGarage } from '@/lib/garages'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function syncCount(supabase: ReturnType<typeof getSupabase>, garageId: string) {
  const { count } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('garage_id', garageId)
  await supabase
    .from('garages')
    .update({ favorites_count: count ?? 0 })
    .eq('id', garageId)
}

// GET ?garageId=x&userId=y  → { isFavorited }
// GET ?userId=y             → { garages: Garage[] }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const garageId = searchParams.get('garageId')

  if (!userId) return NextResponse.json({ error: 'userId ontbreekt.' }, { status: 400 })

  const supabase = getSupabase()

  if (garageId) {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('garage_id', garageId)
      .maybeSingle()
    return NextResponse.json({ isFavorited: !!data })
  }

  // Alle favorieten van de gebruiker met garage data
  const { data } = await supabase
    .from('favorites')
    .select(`
      garage:garages(
        *,
        garage_services(service_name),
        garage_languages(language),
        garage_hours(day_of_week, open_time, close_time, is_closed),
        garage_photos(id, url)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const garages = (data ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((row: any) => row.garage)
    .filter(Boolean)
    .map(transformGarage)

  return NextResponse.json({ garages })
}

// POST { garageId, userId } → voeg toe aan favorieten
export async function POST(req: Request) {
  const { garageId, userId } = await req.json()
  if (!garageId || !userId) return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })

  const supabase = getSupabase()

  const { error } = await supabase
    .from('favorites')
    .insert({ garage_id: garageId, user_id: userId })

  // 23505 = duplicate — gebruiker heeft al gefavoriteerd, geen error
  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await syncCount(supabase, garageId)
  return NextResponse.json({ success: true })
}

// DELETE { garageId, userId } → verwijder uit favorieten
export async function DELETE(req: Request) {
  const { garageId, userId } = await req.json()
  if (!garageId || !userId) return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })

  const supabase = getSupabase()

  await supabase
    .from('favorites')
    .delete()
    .eq('garage_id', garageId)
    .eq('user_id', userId)

  await syncCount(supabase, garageId)
  return NextResponse.json({ success: true })
}
