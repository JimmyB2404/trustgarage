'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { IconMenu2, IconX, IconUser } from '@tabler/icons-react'
import { useAuth } from '@/context/AuthContext'

// Pagina's die ook een Engelse variant onder /en/... hebben — alleen voor deze paden tonen we de
// taalschakelaar. /garage/aanmelden bewust uitgesloten: dat lijkt op een garage-slug maar is een
// losse, niet-vertaalde route.
function getOtherLocaleHref(pathname: string): string | null {
  const isEnglish = pathname.startsWith('/en')
  const base = isEnglish ? (pathname.slice(3) || '/') : pathname
  const translatable =
    base === '/' ||
    base === '/zoeken' ||
    base === '/voor-garages' ||
    base === '/tarieven' ||
    base === '/over-ons' ||
    (base.startsWith('/garage/') && base !== '/garage/aanmelden')
  if (!translatable) return null
  return isEnglish ? base : (base === '/' ? '/en' : `/en${base}`)
}

const TEXT = {
  nl: {
    navLinks: [
      { href: '/zoeken', hrefEn: '/en/zoeken', label: 'Zoek een garage' },
      { href: '/voor-garages', hrefEn: '/en/voor-garages', label: 'Voor garages' },
      { href: '/tarieven', hrefEn: '/en/tarieven', label: 'Tarieven' },
      { href: '/over-ons', hrefEn: '/en/over-ons', label: 'Over ons' },
    ],
    dashboard: 'Dashboard',
    myAccount: 'Mijn account',
    logout: 'Uitloggen',
    login: 'Inloggen',
    signup: 'Aanmelden',
    menuOpen: 'Menu openen',
    menuClose: 'Menu sluiten',
  },
  en: {
    navLinks: [
      { href: '/zoeken', hrefEn: '/en/zoeken', label: 'Find a garage' },
      { href: '/voor-garages', hrefEn: '/en/voor-garages', label: 'For garages' },
      { href: '/tarieven', hrefEn: '/en/tarieven', label: 'Pricing' },
      { href: '/over-ons', hrefEn: '/en/over-ons', label: 'About us' },
    ],
    dashboard: 'Dashboard',
    myAccount: 'My account',
    logout: 'Log out',
    login: 'Log in',
    signup: 'Sign up',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
  },
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, isGarageOwner, isAdmin, signOut } = useAuth()

  const isEnglish = pathname.startsWith('/en')
  const locale = isEnglish ? 'en' : 'nl'
  const t = TEXT[locale]
  const otherHref = getOtherLocaleHref(pathname)
  const nlHref = otherHref ? (isEnglish ? otherHref : pathname) : null
  const enHref = otherHref ? (isEnglish ? pathname : otherHref) : null

  const dashboardHref = isAdmin ? '/admin' : isGarageOwner ? '/dashboard' : '/account/reviews'
  const dashboardLabel = isAdmin || isGarageOwner ? t.dashboard : t.myAccount

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
    setMobileOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E8E8] h-[52px] flex items-center">
        <div className="max-w-site mx-auto px-6 w-full flex items-center justify-between">
          {/* Logo */}
          <Link href={isEnglish ? '/en' : '/'} className="font-serif text-[20px] text-primary font-normal tracking-tight">
            TrustGarage<span className="text-neutral-900">.nl</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {t.navLinks.map(link => {
              const href = isEnglish ? link.hrefEn : link.href
              return (
                <Link
                  key={link.href}
                  href={href}
                  className={`text-[13px] transition-colors duration-150 ${pathname === href ? 'text-primary font-medium' : 'text-neutral-500 hover:text-neutral-900'}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {nlHref && enHref && (
              <div className="flex items-center gap-1 text-[12px]">
                <Link href={nlHref} className={!isEnglish ? 'font-bold text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}>NL</Link>
                <span className="text-neutral-300">|</span>
                <Link href={enHref} className={isEnglish ? 'font-bold text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}>EN</Link>
              </div>
            )}
            {!loading && user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-[7px]"
                >
                  <IconUser size={15} />
                  {dashboardLabel}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn-ghost text-[13px] py-[7px] px-4 rounded-md"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <Link href="/inloggen" className="btn-ghost text-[13px] py-[7px] px-4 rounded-md">
                  {t.login}
                </Link>
                <Link href="/registreren" className="btn-primary text-[13px] py-[7px] px-4 rounded-md">
                  {t.signup}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-[#E8E8E8] rounded-md hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label={t.menuOpen}
          >
            <IconMenu2 size={28} color="#555" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 h-[52px] border-b border-[#E8E8E8]">
            <Link href={isEnglish ? '/en' : '/'} onClick={() => setMobileOpen(false)} className="font-serif text-[20px] text-primary">
              TrustGarage<span className="text-neutral-900">.nl</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label={t.menuClose}>
              <IconX size={24} color="#555" />
            </button>
          </div>
          <div className="flex flex-col flex-1 px-6 py-8 gap-6">
            {t.navLinks.map(link => {
              const href = isEnglish ? link.hrefEn : link.href
              return (
                <Link
                  key={link.href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[18px] text-neutral-900 font-medium"
                >
                  {link.label}
                </Link>
              )
            })}
            {nlHref && enHref && (
              <div className="flex items-center gap-2 text-[14px]">
                <Link href={nlHref} onClick={() => setMobileOpen(false)} className={!isEnglish ? 'font-bold text-neutral-900' : 'text-neutral-500'}>NL</Link>
                <span className="text-neutral-300">|</span>
                <Link href={enHref} onClick={() => setMobileOpen(false)} className={isEnglish ? 'font-bold text-neutral-900' : 'text-neutral-500'}>EN</Link>
              </div>
            )}
            <div className="mt-auto flex flex-col gap-3">
              {!loading && user ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="btn-ghost text-center w-full"
                  >
                    {dashboardLabel}
                  </Link>
                  <button onClick={handleSignOut} className="btn-danger text-center w-full">
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/inloggen" onClick={() => setMobileOpen(false)} className="btn-ghost text-center w-full">
                    {t.login}
                  </Link>
                  <Link href="/registreren" onClick={() => setMobileOpen(false)} className="btn-primary text-center w-full">
                    {t.signup}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
