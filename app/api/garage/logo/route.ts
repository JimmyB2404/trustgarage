import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const garageId = formData.get('garageId') as string
  const file = formData.get('file') as File

  if (!garageId || !file) {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Verwijder oude logo bestanden
  const { data: oldFiles } = await supabase.storage
    .from('garage-photos')
    .list(`logos/${garageId}`)
  if (oldFiles && oldFiles.length > 0) {
    await supabase.storage
      .from('garage-photos')
      .remove(oldFiles.map(f => `logos/${garageId}/${f.name}`))
  }

  // Upload nieuw logo
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `logos/${garageId}/logo-${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('garage-photos')
    .upload(path, buffer, { contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('garage-photos')
    .getPublicUrl(path)

  const { error: dbError } = await supabase
    .from('garages')
    .update({ logo_url: publicUrl })
    .eq('id', garageId)

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 })
  }

  return NextResponse.json({ logo_url: publicUrl })
}

export async function DELETE(req: Request) {
  const { garageId } = await req.json()
  if (!garageId) return NextResponse.json({ error: 'Garage ID ontbreekt.' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: files } = await supabase.storage
    .from('garage-photos')
    .list(`logos/${garageId}`)
  if (files && files.length > 0) {
    await supabase.storage
      .from('garage-photos')
      .remove(files.map(f => `logos/${garageId}/${f.name}`))
  }

  await supabase.from('garages').update({ logo_url: null }).eq('id', garageId)

  return NextResponse.json({ success: true })
}
