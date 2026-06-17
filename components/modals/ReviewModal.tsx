'use client'
import { useState } from 'react'
import { IconX, IconStarFilled, IconStar } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'

interface ReviewModalProps {
  garageId: string
  garageName: string
  onClose: () => void
  onSubmit?: () => void
}

const CATEGORIES = [
  { key: 'eerlijkheid', label: 'Eerlijkheid' },
  { key: 'prijs', label: 'Prijs/kwaliteit' },
  { key: 'snelheid', label: 'Snelheid' },
  { key: 'communicatie', label: 'Communicatie' },
  { key: 'engels', label: 'Engelstalig' },
]

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

export default function ReviewModal({ garageId, garageName, onClose, onSubmit }: ReviewModalProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('nl')
  const [subRatings, setSubRatings] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0 || !text.trim() || !user) return

    setLoading(true)
    setError('')

    const supabase = createClient()

    // 1. Review opslaan
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
      })
      .select('id')
      .single()

    if (reviewError) {
      setError('Er is een fout opgetreden. Probeer opnieuw.')
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
          <h2 className="text-[16px] font-medium text-neutral-900">Review schrijven</h2>
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
            <h3 className="text-[18px] font-medium text-neutral-900 mb-2">Review verzonden!</h3>
            <p className="text-[14px] text-neutral-500">Bedankt voor uw review. Hij is nu zichtbaar op het garageprofiel.</p>
            <button onClick={onClose} className="btn-primary mt-6">Sluiten</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            <div>
              <p className="text-[14px] text-neutral-500 mb-1">Garage</p>
              <p className="text-[15px] font-medium text-neutral-900">{garageName}</p>
            </div>

            {/* Overall rating */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-2">Uw beoordeling</label>
              <StarPicker value={rating} onChange={setRating} />
              {rating === 0 && <p className="text-[12px] text-neutral-300 mt-1">Selecteer een beoordeling</p>}
            </div>

            {/* Sub-ratings */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-3">
                Deelcijfers <span className="text-neutral-300 font-normal">(optioneel)</span>
              </label>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <div key={cat.key} className="flex items-center justify-between">
                    <span className="text-[13px] text-neutral-500 w-28">{cat.label}</span>
                    <StarPicker
                      value={subRatings[cat.key] ?? 0}
                      onChange={v => setSubRatings(prev => ({ ...prev, [cat.key]: v }))}
                      size={18}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Text */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-2">Uw ervaringen</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Beschrijf uw ervaringen bij deze garage..."
                className="w-full min-h-[100px] px-3 py-2.5 border border-[#D8D8D8] rounded-md text-[14px] text-neutral-900 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)] resize-none"
                required
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-[14px] font-medium text-neutral-900 mb-2">Taal van review</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="input-field"
              >
                <option value="nl">Nederlands</option>
                <option value="en">Engels</option>
                <option value="de">Duits</option>
                <option value="fr">Frans</option>
              </select>
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
                disabled={rating === 0 || !text.trim() || loading}
                className={cn('btn-primary flex-1', (rating === 0 || !text.trim() || loading) && 'opacity-50 cursor-not-allowed')}
              >
                {loading ? 'Verzenden...' : 'Review verzenden'}
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
