import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSessionUser } from '@/lib/session'

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const { garageId } = await req.json()
  if (!garageId) return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })

  let stripe
  try {
    stripe = getStripe()
  } catch {
    return NextResponse.json({ error: 'Stripe is nog niet geconfigureerd.' }, { status: 503 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Ownership check
  const { data: garage } = await supabase
    .from('garages')
    .select('id')
    .eq('id', garageId)
    .eq('user_id', user.id)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 403 })

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('garage_id', garageId)
    .maybeSingle()

  if (subscription?.stripe_subscription_id) {
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
    // De webhook (customer.subscription.deleted) zet garages.plan terug naar 'free' en
    // subscriptions.status op 'canceled' — niet hier al doen om dubbele logica te voorkomen.
  } else {
    // Geen actief Stripe-abonnement gevonden (bv. handmatig op premium gezet) — direct terugzetten.
    await supabase.from('garages').update({ plan: 'free' }).eq('id', garageId)
  }

  return NextResponse.json({ success: true })
}
