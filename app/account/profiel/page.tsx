'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconChartBar,
  IconHeart,
  IconCalendarEvent,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getInitials } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'

function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()

  const displayName = user?.user_metadata?.name || user?.email || ''
  const displayEmail = user?.email || ''

  const navItems = [
    { href: '/account/reviews', label: 'Mijn reviews', icon: IconChartBar },
    { href: '/account/profiel', label: 'Mijn profiel', icon: IconUser },
    { href: '/account/favorieten', label: 'Favorieten', icon: IconHeart },
    { href: '/account/aanvragen', label: 'Aanvragen', icon: IconCalendarEvent },
  ]

  const activeItem = navItems.find(item => pathname === item.href) ?? navItems[1]

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Mobile: dropdown trigger */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between gap-2 bg-white border border-neutral-100 rounded-xl px-4 py-3 shadow-card"
        >
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-full bg-primary text-white flex items-center justify-center text-[13px] font-medium flex-shrink-0">
              {getInitials(displayName)}
            </div>
            <span className="text-[14px] font-medium text-neutral-900">{activeItem.label}</span>
          </div>
          <IconChevronDown size={16} className={`text-neutral-500 transition-transform duration-150 ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileOpen && (
          <div className="mt-1 bg-white border border-neutral-100 rounded-xl shadow-card overflow-hidden">
            {navItems.map(item => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 text-[14px] transition-colors ${active ? 'bg-primary-light text-primary font-medium' : 'text-neutral-900 hover:bg-surface'}`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}
            <div className="border-t border-neutral-100">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-[14px] text-danger hover:bg-red-50 transition-colors"
              >
                <IconLogout size={16} />
                Uitloggen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: sidebar */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 flex-col">
        <div className="bg-white border border-neutral-100 rounded-xl shadow-card overflow-hidden">
          {/* User info */}
          <div className="px-4 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-[42px] h-[42px] rounded-full bg-primary text-white flex items-center justify-center text-[15px] font-medium flex-shrink-0">
                {getInitials(displayName)}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-neutral-900 truncate">{displayName}</div>
                <div className="text-[12px] text-neutral-500 truncate">{displayEmail}</div>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="py-1">
            {navItems.map(item => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-[10px] text-[13px] transition-colors duration-100 ${active ? 'bg-primary-light text-primary font-medium' : 'text-neutral-900 hover:bg-surface'}`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-neutral-100 py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-[10px] text-[13px] text-danger hover:bg-red-50 transition-colors duration-100"
            >
              <IconLogout size={15} />
              Uitloggen
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function ProfielPage() {
  const { user } = useAuth()
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setNaam(user.user_metadata?.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      email,
      data: { name: naam },
    })
    if (error) {
      setProfileError('Opslaan mislukt. Probeer het opnieuw.')
      return
    }
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword.length < 8) {
      setPasswordError('Wachtwoord moet minimaal 8 tekens bevatten.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Wachtwoorden komen niet overeen.')
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordError('Wachtwoord wijzigen mislukt. Probeer het opnieuw.')
      return
    }
    setPasswordSaved(true)
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">
          <AccountSidebar />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mb-6">
              Mijn profiel
            </h1>

            {/* Profile form card */}
            <div className="bg-white border border-neutral-100 rounded-xl shadow-card p-5 mb-5">
              <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-5">
                Persoonlijke gegevens
              </h2>

              {profileError && (
                <div className="flex items-center gap-2 bg-red-50 text-danger text-[13px] px-4 py-3 rounded-lg mb-4">
                  <IconAlertCircle size={15} />
                  {profileError}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="naam" className="block text-[13px] font-medium text-neutral-900 mb-1.5">
                    Naam
                  </label>
                  <input
                    id="naam"
                    type="text"
                    value={naam}
                    onChange={e => setNaam(e.target.value)}
                    className="input-field"
                    placeholder="Uw volledige naam"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[13px] font-medium text-neutral-900 mb-1.5">
                    E-mailadres
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="uw@email.nl"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button type="submit" className="btn-primary">
                    Opslaan
                  </button>
                  {profileSaved && (
                    <span className="flex items-center gap-1.5 text-[13px] text-primary">
                      <IconCheck size={15} />
                      Opgeslagen
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Password card */}
            <div className="bg-white border border-neutral-100 rounded-xl shadow-card p-5">
              <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-5">
                Wachtwoord wijzigen
              </h2>

              {passwordError && (
                <div className="flex items-center gap-2 bg-red-50 text-danger text-[13px] px-4 py-3 rounded-lg mb-4">
                  <IconAlertCircle size={15} />
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleSavePassword} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="new-password" className="block text-[13px] font-medium text-neutral-900 mb-1.5">
                    Nieuw wachtwoord
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="input-field"
                    placeholder="Minimaal 8 tekens"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-[13px] font-medium text-neutral-900 mb-1.5">
                    Bevestig nieuw wachtwoord
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="Herhaal nieuw wachtwoord"
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button type="submit" className="btn-primary">
                    Wachtwoord wijzigen
                  </button>
                  {passwordSaved && (
                    <span className="flex items-center gap-1.5 text-[13px] text-primary">
                      <IconCheck size={15} />
                      Wachtwoord gewijzigd
                    </span>
                  )}
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
