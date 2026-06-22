'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { IconX, IconStarFilled, IconStar } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import { trackEvent } from '@/lib/analytics'

interface ReviewModalProps {
  garageId: string
  garageName: string
  locale?: 'nl' | 'en'
  onClose: () => void
  onSubmit?: () => void
}

const CATEGORY_KEYS = ['eerlijkheid', 'prijs', 'snelheid', 'communicatie'] as const

const TEXT = {
  nl: {
    title: 'Review schrijven',
    garageLabel: 'Garage',
    overallRating: 'Uw beoordeling',
    selectRating: 'Selecteer een beoordeling',
    subRatings: 'Deelcijfers',
    optional: '(optioneel)',
    categories: { eerlijkheid: 'Eerlijkheid', prijs: 'Prijs/kwaliteit', snelheid: 'Snelheid', communicatie: 'Communicatie' },
    yourExperience: 'Uw ervaringen',
    textPlaceholder: 'Beschrijf uw ervaringen bij deze garage...',
    invoiceNumber: 'Factuurnummer',
    receiptNumber: 'Bonnummer / factuurnummer',
    receiptHelpInvite: 'Vul uw factuurnummer in om uw bezoek te verifiëren.',
    receiptHelpOrganic: 'Vul dit in en krijg een "Geverifieerd bezoek"-badge bij uw review.',
    receiptPlaceholder: 'Bijv. 2024-00123',
    reviewLanguage: 'Taal van review',
    languages: { nl: 'Nederlands', en: 'Engels', de: 'Duits', fr: 'Frans' },
    cancel: 'Annuleren',
    sending: 'Verzenden...',
    submit: 'Review verzenden',
    submittedTitle: 'Review verzonden!',
    submittedBody: 'Bedankt voor uw review. Hij is nu zichtbaar op het garageprofiel.',
    close: 'Sluiten',
  },
  en: {
    title: 'Write a review',
    garageLabel: 'Garage',
    overallRating: 'Your rating',
    selectRating: 'Select a rating',
    subRatings: 'Sub-ratings',
    optional: '(optional)',
    categories: { eerlijkheid: 'Honesty', prijs: 'Price/quality', snelheid: 'Speed', communicatie: 'Communication' },
    yourExperience: 'Your experience',
    textPlaceholder: 'Describe your experience at this garage...',
    invoiceNumber: 'Invoice number',
    receiptNumber: 'Receipt / invoice number',
    receiptHelpInvite: 'Enter your invoice number to verify your visit.',
    receiptHelpOrganic: 'Fill this in to get a "Verified visit" badge on your review.',
    receiptPlaceholder: 'E.g. 2024-00123',
    reviewLanguage: 'Review language',
    languages: { nl: 'Dutch', en: 'English', de: 'German', fr: 'French' },
    cancel: 'Cancel',
    sending: 'Sending...',
    submit: 'Submit review',
    submittedTitle: 'Review submitted!',
    submittedBody: 'Thank you for your review. It is now visible on the garage profile.',
    close: 'Close',
  },
}

function StarPicker({ value, onChange, size = 28 }: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          {star <= (hover || value) ? (
            <IconStarFilled size={size} style={{ color: '#EF9F27' }} />
          ) : (
            <IconStar size={size} style={{ color: '#EF9F27' }} />
          )}
        </button>
      ))}
    </div>
  )
}

export default function ReviewModal({ garageId, garageName, locale = 'nl', onClose, onSubmit }: ReviewModalProps) {
  const t = TEXT[locale]
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get('invite')
  const isInviteMode = !!inviteToken

  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('nl')
  const [subRatings, setSubRatings] = useState<Record<string, number>>({})
  const [bonnummer, setBonnummer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0 || !text.trim() || !user) return
    if (isInviteMode && !bonnummer.trim()) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const trimmedBonnummer = bonnummer.trim()

    // 1. Review opslaan — in uitnodigingsmodus laten we de verificatievelden op hun
    // standaardwaarde staan; de match-check (stap 3) bepaalt pas wat ze worden.
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        garage_id: garageId,
        user_id: user.id,
        user_name: user.user_metadata?.name || user.email || 'Anoniem',
        rating,
        text: text.trim(),
        language,
        is_expat: language !== 'nl',
        verified: false,
        receipt_number: isInviteMode ? null : (trimmedBonnummer || null),
        verification_path: isInviteMode ? null : (trimmedBonnummer ? 'organic' : null),
        verification_status: isInviteMode ? 'none' : (trimmedBonnummer ? 'pending_garage' : 'none'),
      })
      .select('id')
      .single()

    if (reviewError) {
      setError(reviewError.message)
      setLoading(false)
      return
    }

    // 2. Deelcijfers opslaan
    const subEntries = Object.entries(subRatings).filter(([, score]) => score > 0)
    if (subEntries.length > 0) {
      await supabase.from('review_ratings').insert(
        subEntries.map(([category, score]) => ({
          review_id: review.id,
          category,
          score,
        }))
      )
    }

    // 3. Bij uitnodiging: nummer laten matchen door het platform, niet door de garage.
    // Geen onderscheid in UI-feedback tussen match/mismatch — dat zou verklappen dat er
    // iets niet klopte.
    if (isInviteMode && inviteToken) {
      await fetch('/api/reviews/verify-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inviteToken, reviewId: review.id, customerInvoiceNumber: trimmedBonnummer }),
      }).catch(() => {})
    }

    // 4. Bevestigingsmail naar klant + notificatie naar garage — best-effort, blokkeert de
    // succesweergave niet als het mislukt.
    fetch('/api/reviews/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId: review.id }),
    }).catch(() => {})

    trackEvent('review_submitted', { garage_id: garageId, rating })
    setSubmitted(true)
    setLoading(false)
    onSubmit?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div
        className="bg-white rounded-xl shadow-modal w-full max-w-[500px] max-h-[90vh] overflow-y-auto"
        style={{ animation: 'modalIn 200ms cubic-bezier(0.4,0,0.2,1)' }}
      >
        {/* Header */}
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
            <p className="text-[14px] text-neutral-500">{t.submittedBody}</p>
            <button onClick={onClose} className="btn-primary mt-6">{t.close}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            <div>
              <p className="text-[14px] text-neutral-500 mb-1">{t.garageLabel}</p>
              <p className="text-[15px] font-medium text-neutral-900">{garageName}</p>
            </div>

            {/* Overall rating */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-2">{t.overallRating}</label>
              <StarPicker value={rating} onChange={setRating} />
              {rating === 0 && <p className="text-[12px] text-neutral-300 mt-1">{t.selectRating}</p>}
            </div>

            {/* Sub-ratings */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-3">
                {t.subRatings} <span className="text-neutral-300 font-normal">{t.optional}</span>
              </label>
              <div className="space-y-2">
                {CATEGORY_KEYS.map(key => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-[13px] text-neutral-500 w-28">{t.categories[key]}</span>
                    <StarPicker
                      value={subRatings[key] ?? 0}
                      onChange={v => setSubRatings(prev => ({ ...prev, [key]: v }))}
                      size={18}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Text */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-2">{t.yourExperience}</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t.textPlaceholder}
                className="w-full min-h-[100px] px-3 py-2.5 border border-[#D8D8D8] rounded-md text-[14px] text-neutral-900 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)] resize-none"
                required
              />
            </div>

            {/* Bonnummer */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-1">
                {isInviteMode ? (
                  t.invoiceNumber
                ) : (
                  <>{t.receiptNumber} <span className="text-neutral-300 font-normal">{t.optional}</span></>
                )}
              </label>
              <p className="text-[12px] text-neutral-500 mb-2">
                {isInviteMode ? t.receiptHelpInvite : t.receiptHelpOrganic}
              </p>
              <input
                type="text"
                value={bonnummer}
                onChange={e => setBonnummer(e.target.value)}
                placeholder={t.receiptPlaceholder}
                className="input-field"
                required={isInviteMode}
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-2">{t.reviewLanguage}</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="input-field"
              >
                <option value="nl">{t.languages.nl}</option>
                <option value="en">{t.languages.en}</option>
                <option value="de">{t.languages.de}</option>
                <option value="fr">{t.languages.fr}</option>
              </select>
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
                disabled={rating === 0 || !text.trim() || loading || (isInviteMode && !bonnummer.trim())}
                className={cn('btn-primary flex-1', (rating === 0 || !text.trim() || loading || (isInviteMode && !bonnummer.trim())) && 'opacity-50 cursor-not-allowed')}
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
