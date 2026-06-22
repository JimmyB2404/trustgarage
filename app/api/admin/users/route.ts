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

  const { data: usersData, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data: garages } = await supabase.from('garages').select('user_id, name')
  const garageByUserId = new Map((garages ?? []).map(g => [g.user_id, g.name]))

  const users = usersData.users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    banned: !!u.banned_until && new Date(u.banned_until) > new Date(),
    garageName: garageByUserId.get(u.id) ?? null,
  }))

  return NextResponse.json({ users })
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const { userId, banned } = await req.json()
  if (!userId || typeof banned !== 'boolean') {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: banned ? '876000h' : 'none',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
