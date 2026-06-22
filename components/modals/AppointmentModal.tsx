'use client'
import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

interface AppointmentModalProps {
  garageId: string
  garageName: string
  locale?: 'nl' | 'en'
  onClose: () => void
}

const TEXT = {
  nl: {
    title: 'Afspraak aanvragen',
    submittedTitle: 'Aanvraag verzonden!',
    submittedBody: (name: string) => `${name} neemt zo snel mogelijk telefonisch of per e-mail contact met u op.`,
    close: 'Sluiten',
    notice: (name: string) => `Dit is geen directe boeking — ${name} neemt zelf contact met u op om de afspraak te bevestigen.`,
    name: 'Naam',
    phone: 'Telefoonnummer',
    phonePlaceholder: '06 12345678',
    email: 'E-mailadres',
    optional: '(optioneel)',
    preferredDate: 'Gewenste datum',
    description: 'Omschrijving',
    descriptionPlaceholder: 'Bijv. APK-keuring, bandenwissel...',
    cancel: 'Annuleren',
    sending: 'Versturen...',
    submit: 'Aanvraag versturen',
    genericError: 'Er is een fout opgetreden. Probeer opnieuw.',
    networkError: 'Er is een fout opgetreden. Controleer je internetverbinding en probeer opnieuw.',
  },
  en: {
    title: 'Request an appointment',
    submittedTitle: 'Request sent!',
    submittedBody: (name: string) => `${name} will contact you by phone or email as soon as possible.`,
    close: 'Close',
    notice: (name: string) => `This isn't a direct booking — ${name} will contact you themselves to confirm the appointment.`,
    name: 'Name',
    phone: 'Phone number',
    phonePlaceholder: '06 12345678',
    email: 'Email address',
    optional: '(optional)',
    preferredDate: 'Preferred date',
    description: 'Description',
    descriptionPlaceholder: 'E.g. MOT inspection, tyre change...',
    cancel: 'Cancel',
    sending: 'Sending...',
    submit: 'Send request',
    genericError: 'Something went wrong. Please try again.',
    networkError: 'Something went wrong. Check your internet connection and try again.',
  },
}

export default function AppointmentModal({ garageId, garageName, locale = 'nl', onClose }: AppointmentModalProps) {
  const t = TEXT[locale]
  const { user } = useAuth()

  const [customerName, setCustomerName] = useState(user?.user_metadata?.name ?? '')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? '')
  const [preferredDate, setPreferredDate] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customerName.trim() || !customerPhone.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/garage/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garageId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          preferredDate: preferredDate || undefined,
          message: message.trim() || undefined,
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error ?? t.genericError)
        return
      }
      setSubmitted(true)
    } catch {
      setError(t.networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div
        className="bg-white rounded-xl shadow-modal w-full max-w-[440px] max-h-[90vh] overflow-y-auto"
        style={{ animation: 'modalIn 200ms cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-[16px] font-medium text-neutral-900">{t.title}</h2>
          <button onClick={onClose} className="text-neutral-300 hover:text-neutral-900 transition-colors">
            <IconX size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="text-[18px] font-medium text-neutral-900 mb-2">{t.submittedTitle}</h3>
            <p className="text-[14px] text-neutral-500">
              {t.submittedBody(garageName)}
            </p>
            <button onClick={onClose} className="btn-primary mt-6">{t.close}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <p className="text-[13px] text-neutral-500">
              {t.notice(garageName)}
            </p>

            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">{t.name}</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">{t.phone}</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">
                {t.email} <span className="text-neutral-300 font-normal">{t.optional}</span>
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">
                {t.preferredDate} <span className="text-neutral-300 font-normal">{t.optional}</span>
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">
                {t.description} <span className="text-neutral-300 font-normal">{t.optional}</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                className="w-full min-h-[80px] px-3 py-2.5 border border-[#D8D8D8] rounded-md text-[14px] text-neutral-900 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)] resize-none"
              />
            </div>

            {error && (
              <p className="text-[13px] text-danger bg-danger/5 border border-danger/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2 border-t border-neutral-100">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={!customerName.trim() || !customerPhone.trim() || loading}
                className={cn('btn-primary flex-1', (!customerName.trim() || !customerPhone.trim() || loading) && 'opacity-50 cursor-not-allowed')}
              >
                {loading ? t.sending : t.submit}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
