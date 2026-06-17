'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconHeart, IconSearch, IconChartBar, IconUser, IconLogout } from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GarageCard from '@/components/ui/GarageCard'
import { mockGarages } from '@/lib/mock-data'
import { getInitials } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const FAVORITE_IDS: string[] = []

const NAV_ITEMS = [
  { href: '/account/reviews', label: 'Mijn reviews', Icon: IconChartBar },
  { href: '/account/profiel', label: 'Mijn profiel', Icon: IconUser },
  { href: '/account/favorieten', label: 'Favorieten', Icon: IconHeart },
]

function StaticSidebar({ activePath }: { activePath: string }) {
  const router = useRouter()
  const { user, signOut } = useAuth()

  const displayName = user?.user_metadata?.name || user?.email || ''
  const displayEmail = user?.email || ''

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
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
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = activePath === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-4 py-[10px] text-[13px] transition-colors duration-100 ${active ? 'bg-primary-light text-primary font-medium' : 'text-neutral-900 hover:bg-surface'}`}
              >
                <Icon size={15} />
                {label}
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
  )
}

export default function FavorietenPage() {
  const favorites = mockGarages.filter(g => FAVORITE_IDS.includes(g.id))
  const isEmpty = favorites.length === 0

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">
          <StaticSidebar activePath="/account/favorieten" />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mb-6">
              Favorieten
            </h1>

            {isEmpty ? (
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card py-16 px-6 flex flex-col items-center text-center">
                <div className="w-[56px] h-[56px] rounded-full bg-primary-light flex items-center justify-center mb-4">
                  <IconHeart size={26} className="text-primary" />
                </div>
                <p className="text-[16px] font-medium text-neutral-900 mb-1">
                  U heeft nog geen favorieten
                </p>
                <p className="text-[14px] text-neutral-500 mb-6 max-w-[280px]">
                  Sla garages op als favoriet zodat u ze snel terug kunt vinden.
                </p>
                <Link href="/zoeken" className="btn-primary flex items-center gap-2">
                  <IconSearch size={15} />
                  Zoek een garage
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map(garage => (
                  <GarageCard key={garage.id} garage={garage} variant="vertical" />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
