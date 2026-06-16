'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
import { mockGarages, SERVICES, LANGUAGES, DAY_NAMES } from '@/lib/mock-data'

// ─── Shared Dashboard Layout (copy) ──────────────────────────────────────────

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: <IconChartBar size={16} /> },
  { href: '/dashboard/profiel', label: 'Profiel', icon: <IconShieldCheck size={16} /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <IconStar size={16} />, badge: 2 },
  { href: '/dashboard/abonnement', label: 'Abonnement', icon: <IconCircleCheck size={16} /> },
]

function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

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
              {item.badge && !isActive && (
                <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-danger text-white text-[10px] font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-neutral-100 pt-3">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-[14px] text-danger hover:bg-red-50 w-full transition-colors duration-150">
          <IconLogout size={16} />
          Uitloggen
        </button>
      </div>
    </div>
  )
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-[200px] bg-white border-r border-neutral-100 flex-col sticky top-0 h-screen">
        <DashboardSidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[220px] bg-white h-full shadow-modal flex flex-col">
            <DashboardSidebar onClose={() => setMobileOpen(false)} />
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

// ─── Hours row orders: Mon–Sun display ───────────────────────────────────────

const ORDERED_DAYS = [1, 2, 3, 4, 5, 6, 0] // Mon–Sun

// ─── Page ─────────────────────────────────────────────────────────────────────

const garage = mockGarages[0]

export default function ProfielPage() {
  const [naam, setNaam] = useState(garage.name)
  const [adres, setAdres] = useState(garage.address)
  const [stad, setStad] = useState(garage.city)
  const [telefoon, setTelefoon] = useState(garage.phone)
  const [email, setEmail] = useState(garage.email)
  const [website, setWebsite] = useState(garage.website)
  const [selectedServices, setSelectedServices] = useState<string[]>(garage.services)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(garage.languages)
  const [saved, setSaved] = useState(false)

  // Openingstijden state
  const [hours, setHours] = useState(
    ORDERED_DAYS.map((dayNum) => {
      const h = garage.hours.find((x) => x.day === dayNum)
      return { day: dayNum, open: h?.open ?? '08:00', close: h?.close ?? '17:00', closed: h?.closed ?? false }
    })
  )

  function toggleService(s: string) {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  function toggleLanguage(l: string) {
    setSelectedLanguages((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    )
  }

  function updateHour(index: number, field: 'open' | 'close' | 'closed', value: string | boolean) {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout>
      <h3 className="text-[22px] font-medium text-neutral-900 mb-6">Profiel bewerken</h3>

      <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-[720px]">

        {/* Basisgegevens */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-5">
          <p className="text-[14px] font-semibold text-neutral-900 mb-4">Basisgegevens</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Naam garage</label>
              <input className="input-field" value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Naam garage" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Telefoon</label>
              <input className="input-field" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} placeholder="043-000-0000" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Adres</label>
              <input className="input-field" value={adres} onChange={(e) => setAdres(e.target.value)} placeholder="Straatnaam 1" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Stad</label>
              <input className="input-field" value={stad} onChange={(e) => setStad(e.target.value)} placeholder="Stad" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">E-mailadres</label>
              <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@uwgarage.nl" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-neutral-500">Website</label>
              <input className="input-field" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="www.uwgarage.nl" />
            </div>
          </div>
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
                    onChange={(e) => updateHour(i, 'closed', !e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-[12px] text-neutral-500">Open</span>
                </label>
                {!h.closed ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => updateHour(i, 'open', e.target.value)}
                      className="input-field h-[34px] px-2 text-[13px] w-[100px]"
                    />
                    <span className="text-[12px] text-neutral-300">–</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => updateHour(i, 'close', e.target.value)}
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
          <p className="text-[14px] font-semibold text-neutral-900 mb-1">Foto's</p>
          <p className="text-[12px] text-neutral-500 mb-4">Upload foto's van uw garage (max. 8).</p>
          <label className="flex flex-col items-center justify-center gap-2 border-[1.5px] border-dashed border-neutral-100 rounded-[9px] p-8 cursor-pointer hover:border-primary hover:bg-primary-light/30 transition-colors duration-150">
            <IconUpload size={24} className="text-neutral-300" />
            <span className="text-[13px] text-neutral-500">Klik om foto's te uploaden</span>
            <span className="text-[11px] text-neutral-300">JPG, PNG, WEBP — max. 5 MB per foto</span>
            <input type="file" accept="image/*" multiple className="hidden" />
          </label>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3 pb-4">
          <button type="submit" className="btn-primary">
            {saved ? (
              <span className="flex items-center gap-2">
                <IconCheck size={15} />
                Opgeslagen
              </span>
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
