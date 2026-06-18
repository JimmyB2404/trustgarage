import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvitationEmail(opts: {
  to: string
  garageName: string
  inviteUrl: string
}): Promise<{ sent: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: 'TrustGarage.nl <noreply@trustgarage.nl>',
      to: opts.to,
      subject: `${opts.garageName} nodigt u uit om een review te schrijven`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F6E56;">TrustGarage.nl</h2>
          <p>Beste klant,</p>
          <p><strong>${opts.garageName}</strong> nodigt u uit om een review te schrijven over uw recente bezoek.</p>
          <p>
            <a href="${opts.inviteUrl}" style="display: inline-block; background: #0F6E56; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
              Review schrijven
            </a>
          </p>
          <p style="font-size: 13px; color: #666;">
            Vul bij het schrijven van uw review uw factuurnummer in om een &quot;Geverifieerd bezoek&quot;-badge te krijgen.
          </p>
        </div>
      `,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Onbekende fout' }
  }
}
