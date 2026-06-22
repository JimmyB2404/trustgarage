import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { sendAppointmentRequestEmail } from '@/lib/resend'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Geen login vereist — zelfde drempel als "Bellen". Als de klant wel ingelogd is, koppelen we
// user_id mee zodat de aanvraag ook op /account/aanvragen verschijnt.
export async function POST(req: Request) {
  const { garageId, customerName, customerPhone, customerEmail, preferredDate, message } = await req.json()

  if (!garageId || !customerName?.trim() || !customerPhone?.trim()) {
    return NextResponse.json({ error: 'Vul naam en telefoonnummer in.' }, { status: 400 })
  }

  const user = await getSessionUser()
  const supabase = getSupabase()

  const { data: garage } = await supabase
    .from('garages')
    .select('id, name, email')
    .eq('id', garageId)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 404 })

  const { error } = await supabase.from('appointment_requests').insert({
    garage_id: garageId,
    user_id: user?.id ?? null,
    customer_name: customerName.trim(),
    customer_phone: customerPhone.trim(),
    customer_email: customerEmail?.trim() || null,
    preferred_date: preferredDate || null,
    message: message?.trim() || null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { sent } = await sendAppointmentRequestEmail({
    to: garage.email,
    garageName: garage.name,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerEmail: customerEmail?.trim() || undefined,
    preferredDate: preferredDate || undefined,
    message: message?.trim() || undefined,
    dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/afspraken`,
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
    .from('appointment_requests')
    .select('id, customer_name, customer_phone, customer_email, preferred_date, message, status, created_at')
    .eq('garage_id', garageId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ appointments: data ?? [] })
}

export async function PATCH(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const { id, status } = await req.json()
  if (!id || status !== 'afgehandeld') {
    return NextResponse.json({ error: 'Ongeldige aanvraag.' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Ownership check via een join: de aanvraag moet bij een garage horen die deze gebruiker bezit.
  const { data: appointment } = await supabase
    .from('appointment_requests')
    .select('id, garages!inner(user_id)')
    .eq('id', id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!appointment || (appointment as any).garages.user_id !== user.id) {
    return NextResponse.json({ error: 'Aanvraag niet gevonden.' }, { status: 403 })
  }

  const { error } = await supabase
    .from('appointment_requests')
    .update({ status: 'afgehandeld' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
