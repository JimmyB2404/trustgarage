'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SERVICES, LANGUAGES, DAY_NAMES } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase'
import {
  IconCircleCheck,
  IconUpload,
  IconCheck,
  IconShieldCheck,
} from '@tabler/icons-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface HoursRow {
  closed: boolean
  open: string
  close: string
}

interface FormData {
  email: string
  password: string
  passwordConfirm: string
  garagenaam: string
  adres: string
  stad: string
  telefoon: string
  bedrijfsEmail: string
  website: string
  services: string[]
  languages: string[]
  kvkNumber: string
  description: string
  hours: Record<number, HoursRow>
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WEEKDAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]

const defaultHours: Record<number, HoursRow> = {
  0: { closed: true, open: '', close: '' },
  1: { closed: false, open: '08:00', close: '17:30' },
  2: { closed: false, open: '08:00', close: '17:30' },
  3: { closed: false, open: '08:00', close: '17:30' },
  4: { closed: false, open: '08:00', close: '17:30' },
  5: { closed: false, open: '08:00', close: '17:00' },
  6: { closed: true, open: '', close: '' },
}

const STEP_LABELS = ['Account', 'Bedrijfsgegevens', 'KVK verificatie', 'Profiel']

// ─── Component ───────────────────────────────────────────────────────────────

export default function GarageAanmeldenPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [kvkVerifying, setKvkVerifying] = useState(false)
  const [kvkVerified, setKvkVerified] = useState(false)
  const [kvkBusinessName, setKvkBusinessName] = useState('')

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    passwordConfirm: '',
    garagenaam: '',
    adres: '',
    stad: '',
    telefoon: '',
    bedrijfsEmail: '',
    website: '',
    services: [],
    languages: [],
    kvkNumber: '',
    description: '',
    hours: defaultHours,
  })

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  function toggleChip(field: 'services' | 'languages', value: string) {
    setFormData(prev => {
      const arr = prev[field]
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  function updateHours(day: number, patch: Partial<HoursRow>) {
    setFormData(prev => ({
      ...prev,
      hours: { ...prev.hours, [day]: { ...prev.hours[day], ...patch } },
    }))
  }

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  function handleNext() {
    setError('')

    if (step === 1) {
      if (!formData.email || !formData.password || !formData.passwordConfirm) {
        setError('Vul alle verplichte velden in.')
        return
      }
      if (formData.password.length < 8) {
        setError('Wachtwoord moet minimaal 8 tekens zijn.')
        return
      }
      if (formData.password !== formData.passwordConfirm) {
        setError('Wachtwoorden komen niet overeen.')
        return
      }
    }

    if (step === 2) {
      if (!formData.garagenaam || !formData.adres || !formData.stad || !formData.telefoon || !formData.bedrijfsEmail) {
        setError('Vul alle verplichte velden in.')
        return
      }
    }

    setStep(s => s + 1)
  }

  // ─── Final submit ──────────────────────────────────────────────────────────

  async function handleSubmit() {
    setError('')
    setLoading(true)

    const supabase = createClient()

    // 1. Maak auth account aan
    let userId: string | null = null
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('already')) {
        // Account bestaat al — probeer in te loggen
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (signInError) {
          setError('Dit e-mailadres is al in gebruik. Ga naar de inlogpagina.')
          setLoading(false)
          return
        }
        userId = signInData.user?.id ?? null
      } else {
        setError(signUpError.message)
        setLoading(false)
        return
      }
    } else {
      userId = signUpData.user?.id ?? null

      // Als e-mailbevestiging vereist is: toon bevestigingsstap
      if (!signUpData.session) {
        setLoading(false)
        setStep(5)
        return
      }
    }

    if (!userId) {
      setError('Account aanmaken mislukt. Probeer het opnieuw.')
      setLoading(false)
      return
    }

    // 2. Genereer slug
    const slug = `${slugify(formData.garagenaam)}-${slugify(formData.stad)}`

    // 3. Maak garage aan
    const { data: garage, error: garageError } = await supabase
      .from('garages')
      .insert({
        user_id: userId,
        name: formData.garagenaam,
        slug,
        address: formData.adres,
        city: formData.stad,
        phone: formData.telefoon,
        email: formData.bedrijfsEmail,
        website: formData.website || null,
        description: formData.description,
        kvk_number: formData.kvkNumber || null,
        kvk_verified: kvkVerified,
        plan: 'free',
      })
      .select('id')
      .single()

    if (garageError) {
      setError(`Fout bij aanmaken garage: ${garageError.message}`)
      setLoading(false)
      return
    }

    const garageId = garage.id

    // 4. Diensten opslaan
    if (formData.services.length > 0) {
      await supabase.from('garage_services').insert(
        formData.services.map(s => ({ garage_id: garageId, service_name: s }))
      )
    }

    // 5. Talen opslaan
    if (formData.languages.length > 0) {
      await supabase.from('garage_languages').insert(
        formData.languages.map(l => ({ garage_id: garageId, language: l }))
      )
    }

    // 6. Openingstijden opslaan
    await supabase.from('garage_hours').insert(
      Object.entries(formData.hours).map(([day, h]) => ({
        garage_id: garageId,
        day_of_week: parseInt(day),
        open_time: h.closed ? null : h.open || null,
        close_time: h.closed ? null : h.close || null,
        is_closed: h.closed,
      }))
    )

    // 7. Naar dashboard
    router.push('/dashboard')
    router.refresh()
  }

  function handleKvkVerify() {
    if (!formData.kvkNumber || formData.kvkNumber.length < 8) return
    setKvkVerifying(true)
    setTimeout(() => {
      setKvkVerifying(false)
      setKvkVerified(true)
      setKvkBusinessName(formData.garagenaam || 'Uw Garage B.V.')
    }, 1000)
  }

  // ─── Step indicator ────────────────────────────────────────────────────────

  function StepLabel({ index }: { index: number }) {
    const num = index + 1
    const isDone = step > num
    const isActive = step === num
    return (
      <span
        className={`text-[11px] font-sans ${
          isDone ? 'text-neutral-900' : isActive ? 'text-primary font-bold' : 'text-neutral-300'
        }`}
      >
        {STEP_LABELS[index]}
      </span>
    )
  }

  // ─── Chip ──────────────────────────────────────────────────────────────────

  function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`rounded-full px-3 py-[6px] text-[13px] font-sans transition-colors duration-150 ${
          selected
            ? 'bg-primary text-white border border-primary'
            : 'border border-neutral-100 text-neutral-900 hover:border-primary'
        }`}
      >
        {label}
      </button>
    )
  }

  // ─── Step content ──────────────────────────────────────────────────────────

  function StepOne() {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900">
          Maak een account aan
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">E-mailadres</label>
            <input
              type="email"
              className="input-field"
              placeholder="uw@email.nl"
              value={formData.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">Wachtwoord</label>
            <input
              type="password"
              className="input-field"
              placeholder="Minimaal 8 tekens"
              value={formData.password}
              onChange={e => set('password', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">Wachtwoord bevestigen</label>
            <input
              type="password"
              className="input-field"
              placeholder="Herhaal uw wachtwoord"
              value={formData.passwordConfirm}
              onChange={e => set('passwordConfirm', e.target.value)}
            />
          </div>
        </div>
      </div>
    )
  }

  function StepTwo() {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900">
          Uw bedrijfsgegevens
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">Garagenaam</label>
            <input
              type="text"
              className="input-field"
              placeholder="Naam van uw garage"
              value={formData.garagenaam}
              onChange={e => set('garagenaam', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">Adres</label>
            <input
              type="text"
              className="input-field"
              placeholder="Straatnaam en huisnummer"
              value={formData.adres}
              onChange={e => set('adres', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">Stad</label>
            <input
              type="text"
              className="input-field"
              placeholder="Plaatsnaam"
              value={formData.stad}
              onChange={e => set('stad', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">Telefoonnummer</label>
            <input
              type="tel"
              className="input-field"
              placeholder="010-123-4567"
              value={formData.telefoon}
              onChange={e => set('telefoon', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">E-mailadres garage</label>
            <input
              type="email"
              className="input-field"
              placeholder="info@uwgarage.nl"
              value={formData.bedrijfsEmail}
              onChange={e => set('bedrijfsEmail', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">
              Website <span className="text-neutral-300 font-normal">(optioneel)</span>
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="www.uwgarage.nl"
              value={formData.website}
              onChange={e => set('website', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-2">Diensten</label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(service => (
                <Chip
                  key={service}
                  label={service}
                  selected={formData.services.includes(service)}
                  onClick={() => toggleChip('services', service)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-2">Talen</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <Chip
                  key={lang}
                  label={lang}
                  selected={formData.languages.includes(lang)}
                  onClick={() => toggleChip('languages', lang)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function StepThree() {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900">
          KVK verificatie
        </h2>
        <p className="text-[14px] font-sans text-neutral-500 leading-relaxed">
          Om uw garage te registreren op TrustGarage.nl vragen wij u uw KVK-nummer te
          verifiëren. Dit waarborgt de betrouwbaarheid van ons platform voor zowel
          garages als klanten. Uw KVK-nummer bestaat uit 8 cijfers en is te vinden op
          uw KVK-uittreksel.
        </p>

        <div className="border-[1.5px] border-primary bg-[#F7FDF9] rounded-[9px] p-4 flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-sans text-neutral-900 mb-1">KVK-nummer</label>
            <input
              type="text"
              className="input-field font-mono tracking-widest"
              placeholder="12345678"
              maxLength={8}
              value={formData.kvkNumber}
              onChange={e => {
                setKvkVerified(false)
                set('kvkNumber', e.target.value.replace(/\D/g, ''))
              }}
            />
          </div>

          {kvkVerified ? (
            <div className="flex items-center gap-2 text-primary text-[14px] font-sans font-medium">
              <IconCircleCheck size={20} className="text-primary flex-shrink-0" />
              Geverifieerd: {kvkBusinessName}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleKvkVerify}
              disabled={kvkVerifying || formData.kvkNumber.length < 8}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {kvkVerifying ? 'Bezig met verifiëren…' : 'Verifieer KVK'}
            </button>
          )}
        </div>
      </div>
    )
  }

  function StepFour() {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900">
          Profiel afwerken
        </h2>

        <div>
          <label className="block text-[13px] font-sans text-neutral-900 mb-1">Beschrijving</label>
          <textarea
            className="input-field min-h-[100px] resize-y"
            placeholder="Vertel klanten over uw garage, specialisaties en wat u onderscheidt…"
            value={formData.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[13px] font-sans text-neutral-900 mb-2">Foto&#39;s</label>
          <div className="border-2 border-dashed border-neutral-100 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-[#F7FDF9] transition-colors duration-150">
            <IconUpload size={28} className="text-neutral-300" />
            <span className="text-[13px] font-sans text-neutral-500">Klik om foto&#39;s te uploaden</span>
            <span className="text-[11px] font-sans text-neutral-300">PNG, JPG tot 5 MB</span>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-sans text-neutral-900 mb-3">Openingstijden</label>
          <div className="flex flex-col gap-2">
            {WEEKDAYS_ORDER.map(dayNum => {
              const row = formData.hours[dayNum]
              const dayLabel = DAY_NAMES[dayNum]
              return (
                <div
                  key={dayNum}
                  className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0"
                >
                  <span className="w-[88px] text-[13px] font-sans text-neutral-900 flex-shrink-0">
                    {dayLabel}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateHours(dayNum, {
                        closed: !row.closed,
                        open: row.closed ? '08:00' : '',
                        close: row.closed ? '17:00' : '',
                      })
                    }
                    className={`text-[12px] font-sans px-3 py-[5px] rounded-full border transition-colors duration-150 flex-shrink-0 ${
                      row.closed
                        ? 'bg-neutral-100 border-neutral-100 text-neutral-500'
                        : 'bg-primary-light border-primary text-primary'
                    }`}
                  >
                    {row.closed ? 'Gesloten' : 'Open'}
                  </button>

                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      className="input-field py-[5px] text-[13px] flex-1 min-w-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      value={row.open}
                      disabled={row.closed}
                      onChange={e => updateHours(dayNum, { open: e.target.value })}
                    />
                    <span className="text-neutral-300 text-[13px] flex-shrink-0">–</span>
                    <input
                      type="time"
                      className="input-field py-[5px] text-[13px] flex-1 min-w-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      value={row.close}
                      disabled={row.closed}
                      onChange={e => updateHours(dayNum, { close: e.target.value })}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ─── Step 5: Email bevestiging ─────────────────────────────────────────────

  function StepConfirm() {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-4">
        <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
          <IconCircleCheck size={28} className="text-primary" />
        </div>
        <h2 className="text-[22px] font-normal font-serif text-neutral-900">
          Bevestig uw e-mailadres
        </h2>
        <p className="text-[14px] text-neutral-500 max-w-[340px] leading-relaxed">
          We hebben een bevestigingsmail gestuurd naar <strong className="text-neutral-900">{formData.email}</strong>.
          Klik op de link in de mail om uw account te activeren.
        </p>
        <p className="text-[13px] text-neutral-400">
          Na bevestiging kunt u inloggen via de inlogpagina.
        </p>
        <a href="/inloggen" className="btn-primary mt-2">
          Naar inloggen
        </a>
      </div>
    )
  }

  // ─── Sidebar ───────────────────────────────────────────────────────────────

  function Sidebar() {
    return (
      <aside className="hidden lg:flex flex-col gap-5 w-[300px] flex-shrink-0">
        <div className="card p-5 flex flex-col gap-3">
          <p className="text-[13px] font-sans font-medium text-neutral-900 mb-1">Voortgang</p>
          {STEP_LABELS.map((label, i) => {
            const num = i + 1
            const isDone = step > num
            const isActive = step === num
            return (
              <div key={num} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-150 ${
                    isDone
                      ? 'bg-primary border-primary'
                      : isActive
                      ? 'border-primary bg-white'
                      : 'border-neutral-100 bg-white'
                  }`}
                >
                  {isDone ? (
                    <IconCheck size={13} className="text-white" />
                  ) : isActive ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  ) : null}
                </div>
                <span
                  className={`text-[13px] font-sans ${
                    isDone ? 'text-neutral-900' : isActive ? 'text-primary font-medium' : 'text-neutral-300'
                  }`}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="card p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <IconShieldCheck size={18} className="text-primary" />
            <p className="text-[15px] font-sans font-medium text-neutral-900">Gratis plan</p>
          </div>
          <ul className="flex flex-col gap-2">
            {[
              'Vermeld op TrustGarage.nl',
              'Klantbeoordelingen ontvangen',
              'Openingstijden en diensten',
              'KVK-geverifieerd badge',
              'Contactgegevens zichtbaar',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-[13px] font-sans text-neutral-500">
                <IconCircleCheck size={15} className="text-primary mt-[2px] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <button type="button" className="btn-primary w-full text-[13px] mt-1">
            Upgrade naar Premium
          </button>
        </div>
      </aside>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* Progress bar */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <div className="flex gap-[3px] pt-3">
            {[1, 2, 3, 4].map(n => (
              <div
                key={n}
                className={`flex-1 h-[4px] rounded-full transition-colors duration-300 ${
                  step >= n ? 'bg-primary' : 'bg-neutral-100'
                }`}
              />
            ))}
          </div>
          <div className="flex pb-3 pt-[6px]">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex-1">
                <StepLabel index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-site mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-neutral-100 rounded-xl shadow-card p-6 sm:p-8">
              {step === 1 && StepOne()}
              {step === 2 && StepTwo()}
              {step === 3 && StepThree()}
              {step === 4 && StepFour()}
              {step === 5 && StepConfirm()}

              {/* Error message */}
              {error && (
                <p className="mt-4 text-[13px] text-danger bg-danger/5 border border-danger/20 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              {/* Navigation buttons */}
              {step < 5 && <div className="border-t border-neutral-100 mt-6 pt-4 flex justify-between items-center">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => { setError(''); setStep(s => s - 1) }}
                    disabled={loading}
                    className="btn-ghost disabled:opacity-50"
                  >
                    Terug
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary"
                  >
                    Volgende
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Bezig met aanmaken…' : 'Profiel aanmaken'}
                  </button>
                )}
              </div>}
            </div>
          </div>

          {step === 4 && Sidebar()}
        </div>
      </main>

      <Footer />
    </div>
  )
}
