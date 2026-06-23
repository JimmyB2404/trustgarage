import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: garage, error } = await supabase
    .from('garages')
    .select(`
      *,
      garage_services(service_name),
      garage_languages(language),
      garage_hours(day_of_week, open_time, close_time, is_closed),
      garage_photos(id, url),
      reviews(
        id, user_name, user_country, is_expat, rating, text, language, verified, created_at,
        review_ratings(category, score),
        garage_replies(id, text, created_at)
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !garage) return NextResponse.json({ error: 'Garage niet gevonden.' }, { status: 404 })

  return NextResponse.json({ garage })
}
