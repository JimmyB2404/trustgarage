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
    .from('reviews')
    .select('id, user_name, rating, text, verified, created_at, garages(name, slug), review_reports(count)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ reviews: data ?? [] })
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const { reviewId } = await req.json()
  if (!reviewId) return NextResponse.json({ error: 'reviewId ontbreekt.' }, { status: 400 })

  const supabase = getSupabase()
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
