'use client'
import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

interface AppointmentModalProps {
  garageId: string
  garageName: string
  onClose: () => void
}

export default function AppointmentModal({ garageId, garageName, onClose }: AppointmentModalProps) {
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
        setError(result.error ?? 'Er is een fout opgetreden. Probeer opnieuw.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Er is een fout opgetreden. Controleer je internetverbinding en probeer opnieuw.')
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
          <h2 className="text-[16px] font-medium text-neutral-900">Afspraak aanvragen</h2>
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
            <h3 className="text-[18px] font-medium text-neutral-900 mb-2">Aanvraag verzonden!</h3>
            <p className="text-[14px] text-neutral-500">
              {garageName} neemt zo snel mogelijk telefonisch of per e-mail contact met u op.
            </p>
            <button onClick={onClose} className="btn-primary mt-6">Sluiten</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <p className="text-[13px] text-neutral-500">
              Dit is geen directe boeking — {garageName} neemt zelf contact met u op om de afspraak te bevestigen.
            </p>

            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">Naam</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">Telefoonnummer</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="06 12345678"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">
                E-mailadres <span className="text-neutral-300 font-normal">(optioneel)</span>
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
                Gewenste datum <span className="text-neutral-300 font-normal">(optioneel)</span>
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
                Omschrijving <span className="text-neutral-300 font-normal">(optioneel)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Bijv. APK-keuring, bandenwissel..."
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
                Annuleren
              </button>
              <button
                type="submit"
                disabled={!customerName.trim() || !customerPhone.trim() || loading}
                className={cn('btn-primary flex-1', (!customerName.trim() || !customerPhone.trim() || loading) && 'opacity-50 cursor-not-allowed')}
              >
                {loading ? 'Versturen...' : 'Aanvraag versturen'}
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
