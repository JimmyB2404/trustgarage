import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { sendInvitationEmail } from '@/lib/resend'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const { garageId, customerEmail, invoiceNumber } = await req.json()
  if (!garageId || !customerEmail || !invoiceNumber?.trim()) {
    return NextResponse.json({ error: 'Vul alle velden in.' }, { status: 400 })
  }
  if (!EMAIL_REGEX.test(customerEmail)) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres.' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Ownership check — garageId moet bij de ingelogde gebruiker horen.
  const { data: garage } = await supabase
    .from('garages')
    .select('id, name, slug')
    .eq('id', garageId)
    .eq('user_id', user.id)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 403 })

  const { data: invitation, error } = await supabase
    .from('review_invitations')
    .insert({
      garage_id: garageId,
      customer_email: customerEmail.trim(),
      invoice_number: invoiceNumber.trim(),
    })
    .select('id, token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/garage/${garage.slug}?invite=${invitation.token}`
  const { sent } = await sendInvitationEmail({
    to: customerEmail.trim(),
    garageName: garage.name,
    inviteUrl,
  })

  return NextResponse.json({ success: true, emailSent: sent })
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
    .select('id')
    .eq('id', garageId)
    .eq('user_id', user.id)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 403 })

  const { data, error } = await supabase
    .from('review_invitations')
    .select('id, customer_email, invoice_number, status, created_at, reviews!review_id(id, verified)')
    .eq('garage_id', garageId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ invitations: data ?? [] })
}
