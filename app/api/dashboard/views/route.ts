import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const garageId = searchParams.get('garageId')

  if (!garageId) return NextResponse.json({ total: 0, recent: [] })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [{ data: recentRows }, { count }] = await Promise.all([
    supabase
      .from('page_views')
      .select('viewed_at')
      .eq('garage_id', garageId)
      .gte('viewed_at', sevenDaysAgo.toISOString()),
    supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('garage_id', garageId),
  ])

  return NextResponse.json({ total: count ?? 0, recent: recentRows ?? [] })
}
