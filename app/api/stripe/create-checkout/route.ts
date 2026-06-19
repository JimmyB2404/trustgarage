import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSessionUser } from '@/lib/session'
import { PLAN_PRICING } from '@/lib/plans'

// Server-only — test/live hebben andere Price ID's, dit zo houden voorkomt dat we ze ooit per
// ongeluk in client-bundelde code (lib/plans.ts) zetten.
const STRIPE_PRICE_IDS: Record<string, string | undefined> = {
  premium: process.env.STRIPE_PRICE_PREMIUM,
  business: process.env.STRIPE_PRICE_BUSINESS,
}

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })

  const { garageId, plan } = await req.json()
  const priceId = STRIPE_PRICE_IDS[plan]
  if (!garageId || !(plan in PLAN_PRICING) || !priceId) {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })
  }

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

  // Ownership check — garageId moet bij de ingelogde gebruiker horen.
  const { data: garage } = await supabase
    .from('garages')
    .select('id, name, email')
    .eq('id', garageId)
    .eq('user_id', user.id)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 403 })

  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('garage_id', garageId)
    .maybeSingle()

  let customerId = existingSub?.stripe_customer_id as string | undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: garage.email || user.email,
      name: garage.name,
      metadata: { garageId },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/abonnement?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/abonnement?canceled=true`,
    metadata: { garageId, plan },
    subscription_data: { metadata: { garageId, plan } },
  })

  return NextResponse.json({ url: session.url })
}
