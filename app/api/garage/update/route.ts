import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
  const { garageId, naam, adres, stad, telefoon, email, website, description, services, languages, hours } = await req.json()

  if (!garageId) return NextResponse.json({ error: 'Garage ID ontbreekt.' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: garageError } = await supabase
    .from('garages')
    .update({
      name: naam,
      address: adres,
      city: stad,
      phone: telefoon,
      email,
      website: website || null,
      description: description || '',
    })
    .eq('id', garageId)

  if (garageError) return NextResponse.json({ error: garageError.message }, { status: 400 })

  await supabase.from('garage_services').delete().eq('garage_id', garageId)
  if (services?.length > 0) {
    await supabase.from('garage_services').insert(
      services.map((s: string) => ({ garage_id: garageId, service_name: s }))
    )
  }

  await supabase.from('garage_languages').delete().eq('garage_id', garageId)
  if (languages?.length > 0) {
    await supabase.from('garage_languages').insert(
      languages.map((l: string) => ({ garage_id: garageId, language: l }))
    )
  }

  await supabase.from('garage_hours').delete().eq('garage_id', garageId)
  if (hours?.length > 0) {
    await supabase.from('garage_hours').insert(
      hours.map((h: { day: number; closed: boolean; open: string; close: string }) => ({
        garage_id: garageId,
        day_of_week: h.day,
        open_time: h.closed ? null : (h.open || null),
        close_time: h.closed ? null : (h.close || null),
        is_closed: h.closed,
      }))
    )
  }

  return NextResponse.json({ success: true })
}
