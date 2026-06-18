import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [{ data: garages }, { data: reviews }, { data: invitations }] = await Promise.all([
    supabase.from('garages').select('id, name, slug'),
    supabase.from('reviews').select('garage_id'),
    supabase.from('review_invitations').select('garage_id'),
  ])

  const reviewCounts = new Map<string, number>()
  for (const r of reviews ?? []) {
    reviewCounts.set(r.garage_id, (reviewCounts.get(r.garage_id) ?? 0) + 1)
  }

  const invitationCounts = new Map<string, number>()
  for (const inv of invitations ?? []) {
    invitationCounts.set(inv.garage_id, (invitationCounts.get(inv.garage_id) ?? 0) + 1)
  }

  const result = (garages ?? []).map(g => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    reviewCount: reviewCounts.get(g.id) ?? 0,
    invitationCount: invitationCounts.get(g.id) ?? 0,
  }))

  return NextResponse.json({ garages: result })
}
