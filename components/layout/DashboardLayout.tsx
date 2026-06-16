'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconLayoutDashboard, IconUser, IconStar, IconCreditCard, IconLogout, IconMenu2, IconX } from '@tabler/icons-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Overzicht', icon: IconLayoutDashboard },
    { href: '/dashboard/profiel', label: 'Profiel', icon: IconUser },
    { href: '/dashboard/reviews', label: 'Reviews', icon: IconStar, badge: 2 },
    { href: '/dashboard/abonnement', label: 'Abonnement', icon: IconCreditCard },
  ]

  const Sidebar = () => (
    <div className="flex flex-col h-full py-4 px-3">
      <Link href="/" className="font-serif text-[18px] text-primary px-2 mb-6 block">
        TrustGarage<span className="text-neutral-900">.nl</span>
      </Link>
      <nav className="flex-1 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-[14px] transition-colors duration-150 relative ${active ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-[#F0F0F0] hover:text-neutral-900'}`}
            >
              <item.icon size={16} />
              {item.label}
              {item.badge && !active && (
                <span className="ml-auto bg-danger text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          )
        })}
      </nav>
      <button className="flex items-center gap-2 px-3 py-2 text-[14px] text-danger hover:bg-red-50 rounded-md transition-colors mt-4 border-t border-neutral-100 pt-4 w-full">
        <IconLogout size={16} />
        Uitloggen
      </button>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[200px] bg-white border-r border-neutral-100 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[200px] bg-white h-full shadow-modal">
            <button className="absolute top-4 right-4 text-neutral-500" onClick={() => setSidebarOpen(false)}>
              <IconX size={20} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center gap-3 bg-white border-b border-neutral-100 px-4 h-[52px]">
          <button onClick={() => setSidebarOpen(true)}>
            <IconMenu2 size={22} color="#555" />
          </button>
          <span className="font-serif text-[18px] text-primary">TrustGarage<span className="text-neutral-900">.nl</span></span>
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
