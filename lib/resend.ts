import { Resend } from 'resend'

// Klantinvoer (reviewtekst, naam) komt rechtstreeks van de gebruiker en wordt hieronder
// geïnterpoleerd in e-mail-HTML — escapen voorkomt dat opgeslagen HTML/scripts in de mail
// terechtkomen.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendInvitationEmail(opts: {
  to: string
  garageName: string
  inviteUrl: string
}): Promise<{ sent: boolean; error?: string }> {
  try {
    // Pas hier aanmaken, niet op module-niveau — anders crasht elk bestand dat dit importeert
    // zodra RESEND_API_KEY ontbreekt (bv. tijdens een Vercel build zonder die env var).
    const resend = new Resend(process.env.RESEND_API_KEY)
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

export async function sendReviewConfirmationEmail(opts: {
  to: string
  garageName: string
  garageUrl: string
  rating: number
}): Promise<{ sent: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'TrustGarage.nl <noreply@trustgarage.nl>',
      to: opts.to,
      subject: `Bedankt voor uw review bij ${opts.garageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F6E56;">TrustGarage.nl</h2>
          <p>Beste klant,</p>
          <p>Bedankt voor uw review (${opts.rating}/5 sterren) bij <strong>${opts.garageName}</strong>. Deze is nu zichtbaar op het garageprofiel.</p>
          <p>
            <a href="${opts.garageUrl}" style="display: inline-block; background: #0F6E56; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
              Bekijk garageprofiel
            </a>
          </p>
        </div>
      `,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Onbekende fout' }
  }
}

export async function sendAppointmentRequestEmail(opts: {
  to: string
  garageName: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  preferredDate?: string
  message?: string
  dashboardUrl: string
}): Promise<{ sent: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'TrustGarage.nl <noreply@trustgarage.nl>',
      to: opts.to,
      subject: `Nieuwe afspraakaanvraag voor ${opts.garageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F6E56;">TrustGarage.nl</h2>
          <p>Beste ondernemer,</p>
          <p><strong>${escapeHtml(opts.customerName)}</strong> wil graag een afspraak maken bij <strong>${opts.garageName}</strong>:</p>
          <ul style="color: #444; padding-left: 18px;">
            <li>Telefoon: ${escapeHtml(opts.customerPhone)}</li>
            ${opts.customerEmail ? `<li>E-mail: ${escapeHtml(opts.customerEmail)}</li>` : ''}
            ${opts.preferredDate ? `<li>Gewenste datum: ${escapeHtml(opts.preferredDate)}</li>` : ''}
          </ul>
          ${opts.message ? `<blockquote style="border-left: 3px solid #E1F5EE; margin: 16px 0; padding: 4px 16px; color: #444;">${escapeHtml(opts.message)}</blockquote>` : ''}
          <p style="font-size: 13px; color: #666;">
            Dit is geen geboekte afspraak — neem zelf contact op met de klant om dit te regelen.
          </p>
          <p>
            <a href="${opts.dashboardUrl}" style="display: inline-block; background: #0F6E56; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
              Bekijk in dashboard
            </a>
          </p>
        </div>
      `,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Onbekende fout' }
  }
}

export async function sendNewReviewNotificationEmail(opts: {
  to: string
  garageName: string
  customerName: string
  rating: number
  text: string
  dashboardUrl: string
}): Promise<{ sent: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'TrustGarage.nl <noreply@trustgarage.nl>',
      to: opts.to,
      subject: `Nieuwe review voor ${opts.garageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F6E56;">TrustGarage.nl</h2>
          <p>Beste ondernemer,</p>
          <p><strong>${escapeHtml(opts.customerName)}</strong> heeft een review (${opts.rating}/5 sterren) geplaatst bij <strong>${opts.garageName}</strong>:</p>
          <blockquote style="border-left: 3px solid #E1F5EE; margin: 16px 0; padding: 4px 16px; color: #444;">
            ${escapeHtml(opts.text)}
          </blockquote>
          <p>
            <a href="${opts.dashboardUrl}" style="display: inline-block; background: #0F6E56; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
              Reageer op deze review
            </a>
          </p>
        </div>
      `,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Onbekende fout' }
  }
}

export async function sendGarageSuspendedEmail(opts: {
  to: string
  garageName: string
}): Promise<{ sent: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'TrustGarage.nl <noreply@trustgarage.nl>',
      to: opts.to,
      subject: `Uw garage ${opts.garageName} is geschorst op TrustGarage.nl`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F6E56;">TrustGarage.nl</h2>
          <p>Beste ondernemer,</p>
          <p><strong>${escapeHtml(opts.garageName)}</strong> is momenteel geschorst en niet meer
          zichtbaar in zoekresultaten of op uw profielpagina. U kunt nog wel inloggen op uw
          dashboard.</p>
          <p>Heeft u vragen of wilt u meer weten over de reden? Neem contact met ons op.</p>
        </div>
      `,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Onbekende fout' }
  }
}

export async function sendGarageDeletedEmail(opts: {
  to: string
  garageName: string
}): Promise<{ sent: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'TrustGarage.nl <noreply@trustgarage.nl>',
      to: opts.to,
      subject: `Uw garage ${opts.garageName} is verwijderd van TrustGarage.nl`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F6E56;">TrustGarage.nl</h2>
          <p>Beste ondernemer,</p>
          <p><strong>${escapeHtml(opts.garageName)}</strong> en alle bijbehorende gegevens
          (reviews, foto's, etc.) zijn definitief verwijderd van TrustGarage.nl.</p>
          <p>Heeft u vragen over deze beslissing? Neem contact met ons op.</p>
        </div>
      `,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Onbekende fout' }
  }
}

export async function sendClaimApprovedEmail(opts: {
  to: string
  garageName: string
  dashboardUrl: string
}): Promise<{ sent: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'TrustGarage.nl <noreply@trustgarage.nl>',
      to: opts.to,
      subject: `U bent nu eigenaar van ${opts.garageName} op TrustGarage.nl`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F6E56;">TrustGarage.nl</h2>
          <p>Beste ondernemer,</p>
          <p>Uw aanvraag om <strong>${escapeHtml(opts.garageName)}</strong> te claimen is goedgekeurd.
          U kunt nu inloggen op uw dashboard om het profiel te beheren en op reviews te reageren.</p>
          <p>
            <a href="${opts.dashboardUrl}" style="display: inline-block; background: #0F6E56; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
              Naar mijn dashboard
            </a>
          </p>
        </div>
      `,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Onbekende fout' }
  }
}

export async function sendClaimRejectedEmail(opts: {
  to: string
  garageName: string
}): Promise<{ sent: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'TrustGarage.nl <noreply@trustgarage.nl>',
      to: opts.to,
      subject: `Uw aanvraag voor ${opts.garageName} op TrustGarage.nl`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F6E56;">TrustGarage.nl</h2>
          <p>Beste ondernemer,</p>
          <p>Helaas konden we uw aanvraag om <strong>${escapeHtml(opts.garageName)}</strong> te
          claimen niet bevestigen. Neem contact met ons op als u denkt dat dit niet klopt.</p>
        </div>
      `,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Onbekende fout' }
  }
}
