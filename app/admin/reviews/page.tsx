import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'
import AdminReviewsTable from './AdminReviewsTable'

export default async function AdminReviewsPage() {
  if (!(await isAdmin())) notFound()

  return (
    <div className="max-w-site mx-auto px-6 py-8">
      <nav className="flex gap-4 mb-6 text-[14px]">
        <Link href="/admin" className="text-neutral-500 hover:text-neutral-900">Statistieken</Link>
        <Link href="/admin/verificaties" className="text-neutral-500 hover:text-neutral-900">Verificaties</Link>
        <span className="font-medium text-primary">Reviews</span>
        <Link href="/admin/garages" className="text-neutral-500 hover:text-neutral-900">Garages</Link>
        <Link href="/admin/gebruikers" className="text-neutral-500 hover:text-neutral-900">Gebruikers</Link>
        <Link href="/admin/claims" className="text-neutral-500 hover:text-neutral-900">Claims</Link>
      </nav>
      <h1 className="text-[22px] font-medium text-neutral-900 mb-1">Reviews</h1>
      <p className="text-[13px] text-neutral-500 mb-6">
        Alle reviews op het platform. Verwijder spam, beledigende of nep-reviews — gerapporteerde
        reviews staan apart gefilterd.
      </p>
      <AdminReviewsTable />
    </div>
  )
}
