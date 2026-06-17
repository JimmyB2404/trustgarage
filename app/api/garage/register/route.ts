import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, garagenaam, adres, stad, telefoon, bedrijfsEmail, website, description, kvkNumber, kvkVerified, services, languages, hours } = body

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Maak auth account aan (service role = geen sessie nodig, bevestigingsmail wordt verstuurd)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  // 2. Sla garage op
  const slug = `${slugify(garagenaam)}-${slugify(stad)}`
  const { data: garage, error: garageError } = await supabase
    .from('garages')
    .insert({
      user_id: userId,
      name: garagenaam,
      slug,
      address: adres,
      city: stad,
      phone: telefoon,
      email: bedrijfsEmail,
      website: website || null,
      description: description || '',
      kvk_number: kvkNumber || null,
      kvk_verified: kvkVerified ?? false,
      plan: 'free',
    })
    .select('id')
    .single()

  if (garageError) {
    await supabase.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: garageError.message }, { status: 400 })
  }

  const garageId = garage.id

  // 3. Diensten opslaan
  if (services?.length > 0) {
    await supabase.from('garage_services').insert(
      services.map((s: string) => ({ garage_id: garageId, service_name: s }))
    )
  }

  // 4. Talen opslaan
  if (languages?.length > 0) {
    await supabase.from('garage_languages').insert(
      languages.map((l: string) => ({ garage_id: garageId, language: l }))
    )
  }

  // 5. Openingstijden opslaan
  if (hours) {
    await supabase.from('garage_hours').insert(
      Object.entries(hours).map(([day, h]: [string, unknown]) => {
        const row = h as { closed: boolean; open: string; close: string }
        return {
          garage_id: garageId,
          day_of_week: parseInt(day),
          open_time: row.closed ? null : row.open || null,
          close_time: row.closed ? null : row.close || null,
          is_closed: row.closed,
        }
      })
    )
  }

  return NextResponse.json({ success: true })
}
