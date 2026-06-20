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
    .select('id, user_name, rating, text, receipt_number, created_at, verification_path, garages(name, slug), review_invitations!invitation_id(invoice_number)')
    .eq('verification_status', 'pending_admin')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ items: data ?? [] })
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const { reviewId, action } = await req.json()
  if (!reviewId || (action !== 'confirm' && action !== 'reject')) {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })
  }

  const supabase = getSupabase()

  if (action === 'confirm') {
    await supabase
      .from('reviews')
      .update({ verification_status: 'verified', verified: true })
      .eq('id', reviewId)
  } else {
    await supabase
      .from('reviews')
      .update({ verification_status: 'rejected' })
      .eq('id', reviewId)
  }

  return NextResponse.json({ success: true })
}
