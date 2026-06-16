'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconMenu2, IconX } from '@tabler/icons-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/zoeken', label: 'Zoek een garage' },
    { href: '/voor-garages', label: 'Voor garages' },
    { href: '/over-ons', label: 'Over ons' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E8E8] h-[52px] flex items-center">
        <div className="max-w-site mx-auto px-6 w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-[20px] text-primary font-normal tracking-tight">
            TrustGarage<span className="text-neutral-900">.nl</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] transition-colors duration-150 ${pathname === link.href ? 'text-primary font-medium' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/inloggen" className="btn-ghost text-[13px] py-[7px] px-4 rounded-md">
              Inloggen
            </Link>
            <Link href="/registreren" className="btn-primary text-[13px] py-[7px] px-4 rounded-md">
              Aanmelden
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-[#E8E8E8] rounded-md hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu openen"
          >
            <IconMenu2 size={28} color="#555" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 h-[52px] border-b border-[#E8E8E8]">
            <Link href="/" onClick={() => setMobileOpen(false)} className="font-serif text-[20px] text-primary">
              TrustGarage<span className="text-neutral-900">.nl</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Menu sluiten">
              <IconX size={24} color="#555" />
            </button>
          </div>
          <div className="flex flex-col flex-1 px-6 py-8 gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[18px] text-neutral-900 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-auto flex flex-col gap-3">
              <Link href="/inloggen" onClick={() => setMobileOpen(false)} className="btn-ghost text-center w-full">
                Inloggen
              </Link>
              <Link href="/registreren" onClick={() => setMobileOpen(false)} className="btn-primary text-center w-full">
                Aanmelden
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
