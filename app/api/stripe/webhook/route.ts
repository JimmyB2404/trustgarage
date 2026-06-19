import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret || !signature) {
    return NextResponse.json({ received: true })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Ongeldige webhook-signature.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const garageId = session.metadata?.garageId
      const plan = session.metadata?.plan

      if (garageId && plan) {
        await supabase.from('garages').update({ plan }).eq('id', garageId)
        await supabase.from('subscriptions').upsert(
          {
            garage_id: garageId,
            plan,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            status: 'active',
          },
          { onConflict: 'garage_id' }
        )
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('subscriptions')
        .update({
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('garage_id')
        .eq('stripe_subscription_id', sub.id)
        .maybeSingle()

      if (existing) {
        await supabase.from('garages').update({ plan: 'free' }).eq('id', existing.garage_id)
        await supabase.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', sub.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
