import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendReviewConfirmationEmail, sendNewReviewNotificationEmail } from '@/lib/resend'

export async function POST(req: Request) {
  const { reviewId } = await req.json()
  if (!reviewId) return NextResponse.json({ error: 'reviewId ontbreekt.' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: review } = await supabase
    .from('reviews')
    .select('id, user_id, user_name, rating, text, garage_id')
    .eq('id', reviewId)
    .single()

  if (!review) return NextResponse.json({ error: 'Review niet gevonden.' }, { status: 404 })

  const { data: garage } = await supabase
    .from('garages')
    .select('name, slug, email')
    .eq('id', review.garage_id)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 404 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  // Beide best-effort — als een van de twee mislukt, blokkeert dat de ander niet en faalt het
  // verzoek niet (de review zelf staat al gewoon opgeslagen).
  const [confirmationResult, notificationResult] = await Promise.all([
    (async () => {
      const { data: authUser } = await supabase.auth.admin.getUserById(review.user_id)
      const customerEmail = authUser?.user?.email
      if (!customerEmail) return { sent: false, error: 'Geen klant-e-mailadres gevonden.' }
      return sendReviewConfirmationEmail({
        to: customerEmail,
        garageName: garage.name,
        garageUrl: `${siteUrl}/garage/${garage.slug}`,
        rating: review.rating,
      })
    })(),
    garage.email
      ? sendNewReviewNotificationEmail({
          to: garage.email,
          garageName: garage.name,
          customerName: review.user_name,
          rating: review.rating,
          text: review.text,
          dashboardUrl: `${siteUrl}/dashboard/reviews`,
        })
      : Promise.resolve({ sent: false, error: 'Garage heeft geen e-mailadres.' }),
  ])

  return NextResponse.json({ confirmationResult, notificationResult })
}
