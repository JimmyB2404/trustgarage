'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconChartBar,
  IconStar,
  IconCircleCheck,
  IconShieldCheck,
  IconMenu2,
  IconX,
  IconLogout,
  IconUpload,
  IconCheck,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { SERVICES, LANGUAGES, DAY_NAMES } from '@/lib/mock-data'
import { useAuth } from '@/context/AuthContext'
import { useGarage } from '@/hooks/useGarage'

// ─── Shared Dashboard Layout ──────────────────────────────────────────────────

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: <IconChartBar size={16} /> },
  { href: '/dashboard/profiel', label: 'Profiel', icon: <IconShieldCheck size={16} /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <IconStar size={16} /> },
  { href: '/dashboard/abonnement', label: 'Abonnement', icon: <IconCircleCheck size={16} /> },
]

function DashboardSidebar({ onClose, reviewBadge }: { onClose?: () => void; reviewBadge?: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full py-4 px-3">
      <div className="flex items-center justify-between mb-6 px-3">
        <Link href="/" className="font-serif text-[18px] text-primary font-normal tracking-tight">
          TrustGarage<span className="text-neutral-900">.nl</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 md:hidden">
            <IconX size={20} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const badge = item.href === '/dashboard/reviews' ? reviewBadge : undefined
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-[14px] transition-colors duration-150',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-neutral-900 hover:bg-[#F0F0F0]'
              )}
            >
              <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {badge != null && badge > 0 && !isActive && (
                <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-danger text-white text-[10px] font-medium">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-neutral-100 pt-3">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-[14px] text-danger hover:bg-red-50 w-full transition-colors duration-150"
        >
          <IconLogout size={16} />
          Uitloggen
        </button>
      </div>
    </div>
  )
}

function DashboardLayout({ children, reviewBadge }: { children: React.ReactNode; reviewBadge?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-[200px] bg-white border-r border-neutral-100 flex-col sticky top-0 h-screen">
        <DashboardSidebar reviewBadge={reviewBadge} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[220px] bg-white h-full shadow-modal flex flex-col">
            <DashboardSidebar onClose={() => setMobileOpen(false)} reviewBadge={reviewBadge} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center gap-3 bg-white border-b border-neutral-100 px-4 h-[52px]">
          <button onClick={() => setMobileOpen(true)} className="text-neutral-500 hover:text-neutral-900" aria-label="Menu openen">
            <IconMenu2 size={22} />
          </button>
          <span className="font-serif text-[17px] text-primary">
            TrustGarage<span className="text-neutral-900">.nl</span>
          </span>
        </div>
        <main className="flex-1 bg-surface p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

// ─── Hours display order: Mon–Sun ─────────────────────────────────────────────

const ORDERED_DAYS = [1, 2, 3, 4, 5, 6, 0]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfielPage() {
  const { garage, loading, refetch } = useGarage()

  const [naam, setNaam] = useState('')
  const [adres, setAdres] = useState('')
  const [stad, setStad] = useState('')
  const [telefoon, setTelefoon] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [omschrijving, setOmschrijving] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [hours, setHours] = useState(
    ORDERED_DAYS.map((day) => ({ day, open: '08:00', close: '17:00', closed: false }))
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoError, setLogoError] = useState('')

  const unanswered = garage?.reviews.filter(r => r.garage_replies.length === 0).length ?? 0

  useEffect(() => {
    if (!garage) return
    setNaam(garage.name ?? '')
    setAdres(garage.address ?? '')
    setStad(garage.city ?? '')
    setTelefoon(garage.phone ?? '')
    setEmail(garage.email ?? '')
    setWebsite(garage.website ?? '')
    setOmschrijving(garage.description ?? '')
    setSelectedServices(garage.garage_services.map(s => s.service_name))
    setSelectedLanguages(garage.garage_languages.map(l => l.language))
    setPhotos(garage.garage_photos ?? [])
    setLogoUrl(garage.logo_url ?? null)
    setHours(
      ORDERED_DAYS.map((dayNum) => {
        const h = garage.garage_hours.find(x => x.day_of_week === dayNum)
        return {
          day: dayNum,
          open: h?.open_time ?? '08:00',
          close: h?.close_time ?? '17:00',
          closed: h?.is_closed ?? false,
        }
      })
    )
  }, [garage])

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || !garage) return
    if (photos.length + files.length > 8) {
      setPhotoError("Maximum 8 foto's toegestaan.")
      return
    }
    setUploadingPhotos(true)
    setPhotoError('')
    const formData = new FormData()
    formData.append('garageId', garage.id)
    Array.from(files).forEach(f => formData.append('files', f))
    const res = await fetch('/api/garage/photos', { method: 'POST', body: formData })
    const result = await res.json()
    setUploadingPhotos(false)
    if (!res.ok) {
      setPhotoError(result.error ?? 'Upload mislukt.')
    } else {
      setPhotos(prev => [...prev, ...result.photos])
    }
    e.target.value = ''
  }

  async function handlePhotoDelete(photoId: string) {
    await fetch('/api/garage/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId }),
    })
    setPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !garage) return
    setUploadingLogo(true)
    setLogoError('')
    const formData = new FormData()
    formData.append('garageId', garage.id)
    formData.append('file', file)
    const res = await fetch('/api/garage/logo', { method: 'POST', body: formData })
    const result = await res.json()
    setUploadingLogo(false)
    if (!res.ok) {
      setLogoError(result.error ?? 'Upload mislukt.')
    } else {
      setLogoUrl(result.logo_url)
    }
    e.target.value = ''
  }

  async function handleLogoDelete() {
    if (!garage) return
    setLogoError('')
    await fetch('/api/garage/logo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ garageId: garage.id }),
    })
    setLogoUrl(null)
  }

  function toggleService(s: string) {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  function toggleLanguage(l: string) {
    setSelectedLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])
  }

  function updateHour(index: number, field: 'open' | 'close' | 'closed', value: string | boolean) {
    setHours(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!garage) return
    setSaving(true)
    setError('')
    const res = await fetch('/api/garage/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        garageId: garage.id,
        naam, adres, stad, telefoon, email, website,
        description: omschrijving,
        services: selectedServices,
        languages: selectedLanguages,
        hours,
      }),
    })
    const result = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(result.error ?? 'Er is een fout opgetreden.')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    await refetch()
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <span className="text-neutral-400 text-[14px]">Laden...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!garage) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <span className="text-neutral-400 text-[14px]">Geen garage gevonden.</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout reviewBadge={unanswered}>
      <h3 className="text-[22px] font-medium text-neutral-900 mb-6">Profiel bewerken</h3>

      <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-[720px]">

        {/* Logo */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-5">
          <p className="text-[14px] font-semibold text-neutral-900 mb-1">Logo</p>
          <p className="text-[12px] text-neutral-500 mb-4">Zichtbaar in zoekresultaten en op uw profielpagina.</p>
          <div className="flex items-center gap-5">
            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-primary-light flex-shrink-0 flex items-center justify-center">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-serif text-3xl select-none">{naam.charAt(0) || '?'}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={cn(
                'btn-secondary text-[13px] cursor-pointer inline-flex items-center gap-2',
                uploadingLogo && 'opacity-50 cursor-not-allowed'
              )}>
                <IconUpload size={14} />
                {uploadingLogo ? 'Uploaden...' : 'Logo uploaden'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploadingLogo}
                  onChange={handleLogoUpload}
                />
              </label>
              {logoUrl && (
                <button
                  type="button"
                  onClick={handleLogoDelete}
                  className="text-[12px] text-danger hover:underline text-left"
                >
                  Logo verwijderen
                </button>
              )}
              <span className="text-[11px] text-neutral-300">JPG, PNG, WEBP — max. 5 MB</span>
            </div>
          </div>
          {logoError && <p className="text-[12px] text-danger mt-3">{logoError}</p>}
        </div>

        {/* Basisgegevens */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-5">
          <p className="text-[14px] font-semibold text-neutral-900 mb-4">Basisgegevens</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Naam garage</label>
              <input className="input-field" value={naam} onChange={e => setNaam(e.target.value)} placeholder="Naam garage" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Telefoon</label>
              <input className="input-field" value={telefoon} onChange={e => setTelefoon(e.target.value)} placeholder="043-000-0000" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Adres</label>
              <input className="input-field" value={adres} onChange={e => setAdres(e.target.value)} placeholder="Straatnaam 1" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Stad</label>
              <input className="input-field" value={stad} onChange={e => setStad(e.target.value)} placeholder="Stad" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">E-mailadres</label>
              <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@uwgarage.nl" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Website</label>
              <input className="input-field" value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.uwgarage.nl" />
            </div>
          </div>
        </div>

        {/* Omschrijving */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-5">
          <p className="text-[14px] font-semibold text-neutral-900 mb-1">Omschrijving</p>
          <p className="text-[12px] text-neutral-500 mb-3">Beschrijf uw garage voor klanten.</p>
          <textarea
            className="w-full min-h-[100px] px-3 py-2.5 border border-[#D8D8D8] rounded-md text-[14px] text-neutral-900 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)] resize-none"
            value={omschrijving}
            onChange={e => setOmschrijving(e.target.value)}
            placeholder="Vertel klanten meer over uw garage, specialisaties en aanpak..."
          />
        </div>

        {/* Diensten */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-5">
          <p className="text-[14px] font-semibold text-neutral-900 mb-1">Diensten</p>
          <p className="text-[12px] text-neutral-500 mb-3">Selecteer de diensten die u aanbiedt.</p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => {
              const active = selectedServices.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-[6px] rounded-md border text-[13px] transition-colors duration-150',
                    active
                      ? 'bg-primary-light border-primary text-primary font-medium'
                      : 'bg-white border-neutral-100 text-neutral-500 hover:border-neutral-300'
                  )}
                >
                  {active && <IconCheck size={12} />}
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* Talen */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-5">
          <p className="text-[14px] font-semibold text-neutral-900 mb-1">Gesproken talen</p>
          <p className="text-[12px] text-neutral-500 mb-3">Welke talen spreekt u in uw garage?</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => {
              const active = selectedLanguages.includes(l)
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => toggleLanguage(l)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-[6px] rounded-md border text-[13px] transition-colors duration-150',
                    active
                      ? 'bg-primary-light border-primary text-primary font-medium'
                      : 'bg-white border-neutral-100 text-neutral-500 hover:border-neutral-300'
                  )}
                >
                  {active && <IconCheck size={12} />}
                  {l}
                </button>
              )
            })}
          </div>
        </div>

        {/* Openingstijden */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-5">
          <p className="text-[14px] font-semibold text-neutral-900 mb-4">Openingstijden</p>
          <div className="flex flex-col gap-2">
            {hours.map((h, i) => (
              <div key={h.day} className="flex items-center gap-3">
                <span className="text-[13px] text-neutral-900 w-[80px] shrink-0">{DAY_NAMES[h.day]}</span>
                <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={!h.closed}
                    onChange={e => updateHour(i, 'closed', !e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-[12px] text-neutral-500">Open</span>
                </label>
                {!h.closed ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={h.open}
                      onChange={e => updateHour(i, 'open', e.target.value)}
                      className="input-field h-[34px] px-2 text-[13px] w-[100px]"
                    />
                    <span className="text-[12px] text-neutral-300">–</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={e => updateHour(i, 'close', e.target.value)}
                      className="input-field h-[34px] px-2 text-[13px] w-[100px]"
                    />
                  </div>
                ) : (
                  <span className="text-[12px] text-neutral-300 italic">Gesloten</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Foto's */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-5">
          <p className="text-[14px] font-semibold text-neutral-900 mb-1">{"Foto's"}</p>
          <p className="text-[12px] text-neutral-500 mb-4">{photos.length}/8 foto{"'"}s geüpload.</p>

          {/* Bestaande foto's */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt="Garagefoto"
                    className="w-full h-[80px] object-cover rounded-md border border-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => handlePhotoDelete(photo.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Foto verwijderen"
                  >
                    <IconX size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload zone */}
          {photos.length < 8 && (
            <label className={cn(
              'flex flex-col items-center justify-center gap-2 border-[1.5px] border-dashed border-neutral-100 rounded-[9px] p-6 cursor-pointer hover:border-primary hover:bg-primary-light/30 transition-colors duration-150',
              uploadingPhotos && 'opacity-50 cursor-not-allowed'
            )}>
              {uploadingPhotos ? (
                <span className="text-[13px] text-neutral-500">Uploaden...</span>
              ) : (
                <>
                  <IconUpload size={22} className="text-neutral-300" />
                  <span className="text-[13px] text-neutral-500">{"Klik om foto's te uploaden"}</span>
                  <span className="text-[11px] text-neutral-300">JPG, PNG, WEBP — max. 5 MB per foto</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                disabled={uploadingPhotos}
                onChange={handlePhotoUpload}
              />
            </label>
          )}

          {photoError && (
            <p className="text-[12px] text-danger mt-2">{photoError}</p>
          )}
        </div>

        {error && (
          <p className="text-[13px] text-danger bg-danger/5 border border-danger/20 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Save button */}
        <div className="flex items-center gap-3 pb-4">
          <button
            type="submit"
            disabled={saving}
            className={cn('btn-primary', saving && 'opacity-50 cursor-not-allowed')}
          >
            {saved ? (
              <span className="flex items-center gap-2">
                <IconCheck size={15} />
                Opgeslagen
              </span>
            ) : saving ? (
              'Opslaan...'
            ) : (
              'Opslaan'
            )}
          </button>
          {saved && <span className="text-[13px] text-primary">Wijzigingen zijn opgeslagen.</span>}
        </div>
      </form>
    </DashboardLayout>
  )
}
