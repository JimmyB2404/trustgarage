import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

function normalize(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, '')
}

export async function POST(req: Request) {
  const { token, reviewId, customerInvoiceNumber } = await req.json()
  if (!token || !reviewId || !customerInvoiceNumber?.trim()) {
    return NextResponse.json({ matched: false, reason: 'invalid_input' }, { status: 400 })
  }

  const user = await getSessionUser()
  if (!user) return NextResponse.json({ matched: false, reason: 'not_authenticated' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Review moet bij de ingelogde gebruiker horen — voorkomt dat iemand een willekeurige
  // reviewId + gegokt token combineert om verificatie te claimen voor een review die niet
  // van hen is.
  const { data: review } = await supabase
    .from('reviews')
    .select('id, user_id')
    .eq('id', reviewId)
    .single()

  if (!review || review.user_id !== user.id) {
    return NextResponse.json({ matched: false, reason: 'invalid_review' }, { status: 403 })
  }

  const { data: invitation } = await supabase
    .from('review_invitations')
    .select('id, invoice_number, status')
    .eq('token', token)
    .single()

  if (!invitation || invitation.status !== 'sent') {
    return NextResponse.json({ matched: false, reason: 'invalid_token' })
  }

  const matched = normalize(invitation.invoice_number) === normalize(customerInvoiceNumber)
  const rawNumber = customerInvoiceNumber.trim()

  if (matched) {
    await supabase
      .from('reviews')
      .update({
        verification_path: 'invitation',
        verification_status: 'pending_admin',
        receipt_number: rawNumber,
        invitation_id: invitation.id,
      })
      .eq('id', reviewId)
  } else {
    await supabase
      .from('reviews')
      .update({
        verification_path: 'invitation',
        verification_status: 'rejected',
        receipt_number: rawNumber,
      })
      .eq('id', reviewId)
  }

  await supabase
    .from('review_invitations')
    .update({ status: 'used', review_id: reviewId, used_at: new Date().toISOString() })
    .eq('id', invitation.id)

  return NextResponse.json({ matched })
}
