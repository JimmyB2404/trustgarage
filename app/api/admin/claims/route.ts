import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { sendClaimApprovedEmail, sendClaimRejectedEmail } from '@/lib/resend'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('garage_claims')
    .select('id, user_id, phone, kvk_number, status, created_at, garages(id, name, slug, phone, kvk_number)')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // E-mailadressen van de aanvragers erbij halen — staat niet in deze tabel zelf.
  const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const emailByUserId = new Map(usersData?.users.map(u => [u.id, u.email]) ?? [])

  const claims = (data ?? []).map(c => ({
    ...c,
    claimantEmail: emailByUserId.get(c.user_id) ?? null,
  }))

  return NextResponse.json({ claims })
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Niet toegestaan.' }, { status: 403 })
  }

  const { claimId, action } = await req.json()
  if (!claimId || (action !== 'approve' && action !== 'reject')) {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 })
  }

  const supabase = getSupabase()

  const { data: claim } = await supabase
    .from('garage_claims')
    .select('id, garage_id, user_id, garages(name)')
    .eq('id', claimId)
    .single()

  if (!claim) return NextResponse.json({ error: 'Aanvraag niet gevonden.' }, { status: 404 })

  const { data: claimantData } = await supabase.auth.admin.getUserById(claim.user_id)
  const claimantEmail = claimantData?.user?.email
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const garageName = (claim.garages as any)?.name ?? 'uw garage'

  if (action === 'approve') {
    await supabase.from('garages').update({ user_id: claim.user_id }).eq('id', claim.garage_id)
    await supabase
      .from('garage_claims')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', claimId)
    // Eventuele andere openstaande aanvragen voor dezelfde garage vervallen.
    await supabase
      .from('garage_claims')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('garage_id', claim.garage_id)
      .eq('status', 'pending')
      .neq('id', claimId)

    if (claimantEmail) {
      await sendClaimApprovedEmail({
        to: claimantEmail,
        garageName,
        dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      }).catch(() => {})
    }
  } else {
    await supabase
      .from('garage_claims')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', claimId)

    if (claimantEmail) {
      await sendClaimRejectedEmail({ to: claimantEmail, garageName }).catch(() => {})
    }
  }

  return NextResponse.json({ success: true })
}
