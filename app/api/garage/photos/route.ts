import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const garageId = formData.get('garageId') as string
  const files = formData.getAll('files') as File[]

  if (!garageId || files.length === 0) {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const uploaded: { id: string; url: string }[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path = `garages/${garageId}/${filename}`
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

    const { data: photo, error: dbError } = await supabase
      .from('garage_photos')
      .insert({ garage_id: garageId, url: publicUrl })
      .select('id, url')
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    uploaded.push(photo)
  }

  return NextResponse.json({ photos: uploaded })
}

export async function DELETE(req: Request) {
  const { photoId } = await req.json()
  if (!photoId) return NextResponse.json({ error: 'Foto ID ontbreekt.' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: photo } = await supabase
    .from('garage_photos')
    .select('url')
    .eq('id', photoId)
    .single()

  if (photo?.url) {
    const storagePath = photo.url.split('/garage-photos/')[1]
    if (storagePath) {
      await supabase.storage.from('garage-photos').remove([storagePath])
    }
  }

  await supabase.from('garage_photos').delete().eq('id', photoId)

  return NextResponse.json({ success: true })
}
