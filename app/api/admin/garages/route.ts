import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('garages')
    .select('id, name, slug, city, plan, suspended, created_at, reviews(count)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ garages: data ?? [] })
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const { garageId, suspended } = await req.json()
  if (!garageId || typeof suspended !== 'boolean') {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('garages').update({ suspended }).eq('id', garageId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const { garageId } = await req.json()
  if (!garageId) return NextResponse.json({ error: 'garageId ontbreekt.' }, { status: 400 })

  const supabase = getSupabase()
  const { error } = await supabase.from('garages').delete().eq('id', garageId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
