import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'
import AdminUsersTable from './AdminUsersTable'

export default async function AdminUsersPage() {
  if (!(await isAdmin())) notFound()

  return (
    <div className="max-w-site mx-auto px-6 py-8">
      <nav className="flex gap-4 mb-6 text-[14px]">
        <Link href="/admin" className="text-neutral-500 hover:text-neutral-900">Statistieken</Link>
        <Link href="/admin/verificaties" className="text-neutral-500 hover:text-neutral-900">Verificaties</Link>
        <Link href="/admin/reviews" className="text-neutral-500 hover:text-neutral-900">Reviews</Link>
        <Link href="/admin/garages" className="text-neutral-500 hover:text-neutral-900">Garages</Link>
        <span className="font-medium text-primary">Gebruikers</span>
      </nav>
      <h1 className="text-[22px] font-medium text-neutral-900 mb-1">Gebruikers</h1>
      <p className="text-[13px] text-neutral-500 mb-6">
        Alle accounts (klanten en garage-eigenaren). Geblokkeerde accounts kunnen niet meer
        inloggen.
      </p>
      <AdminUsersTable />
    </div>
  )
}
