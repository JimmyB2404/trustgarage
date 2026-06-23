import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'
import AdminGaragesTable from './AdminGaragesTable'

export default async function AdminGaragesPage() {
  if (!(await isAdmin())) notFound()

  return (
    <div className="max-w-site mx-auto px-6 py-8">
      <nav className="flex gap-4 mb-6 text-[14px]">
        <Link href="/admin" className="text-neutral-500 hover:text-neutral-900">Statistieken</Link>
        <Link href="/admin/verificaties" className="text-neutral-500 hover:text-neutral-900">Verificaties</Link>
        <Link href="/admin/reviews" className="text-neutral-500 hover:text-neutral-900">Reviews</Link>
        <span className="font-medium text-primary">Garages</span>
        <Link href="/admin/gebruikers" className="text-neutral-500 hover:text-neutral-900">Gebruikers</Link>
        <Link href="/admin/claims" className="text-neutral-500 hover:text-neutral-900">Claims</Link>
      </nav>
      <h1 className="text-[22px] font-medium text-neutral-900 mb-1">Garages</h1>
      <p className="text-[13px] text-neutral-500 mb-6">
        Schorsen verbergt een garage uit zoekresultaten en het profiel (de eigenaar kan nog wel
        inloggen op het dashboard). Verwijderen is definitief en neemt reviews, foto&apos;s en
        overige data mee.
      </p>
      <AdminGaragesTable />
    </div>
  )
}
