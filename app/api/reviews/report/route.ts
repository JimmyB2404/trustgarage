import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

// Geen login vereist om te rapporteren — een rapport verwijdert niets automatisch, het komt
// alleen in de admin-wachtrij terecht, dus misbruik van deze drempel-loosheid is laag risico.
export async function POST(req: Request) {
  const { reviewId, reason } = await req.json()
  if (!reviewId) return NextResponse.json({ error: 'reviewId ontbreekt.' }, { status: 400 })

  const user = await getSessionUser()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('review_reports').insert({
    review_id: reviewId,
    reporter_user_id: user?.id ?? null,
    reason: reason?.trim() || null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
