import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'
import AdminStatsTable from './AdminStatsTable'

export default async function AdminStatsPage() {
  if (!(await isAdmin())) notFound()

  return (
    <div className="max-w-site mx-auto px-6 py-8">
      <nav className="flex gap-4 mb-6 text-[14px]">
        <span className="font-medium text-primary">Statistieken</span>
        <Link href="/admin/verificaties" className="text-neutral-500 hover:text-neutral-900">
          Verificaties
        </Link>
        <Link href="/admin/reviews" className="text-neutral-500 hover:text-neutral-900">Reviews</Link>
        <Link href="/admin/garages" className="text-neutral-500 hover:text-neutral-900">Garages</Link>
        <Link href="/admin/gebruikers" className="text-neutral-500 hover:text-neutral-900">Gebruikers</Link>
        <Link href="/admin/claims" className="text-neutral-500 hover:text-neutral-900">Claims</Link>
      </nav>
      <h1 className="text-[22px] font-medium text-neutral-900 mb-1">Garage-overzicht</h1>
      <p className="text-[13px] text-neutral-500 mb-6">
        Reviews ontvangen vs. uitnodigingen verstuurd per garage — let op garages met veel
        uitnodigingen maar weinig reviews.
      </p>
      <AdminStatsTable />
    </div>
  )
}
