import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'
import AdminGarageDetail from './AdminGarageDetail'

export default async function AdminGarageDetailPage({ params }: { params: { id: string } }) {
  if (!(await isAdmin())) notFound()

  return (
    <div className="max-w-site mx-auto px-6 py-8">
      <nav className="flex gap-4 mb-6 text-[14px]">
        <Link href="/admin" className="text-neutral-500 hover:text-neutral-900">Statistieken</Link>
        <Link href="/admin/verificaties" className="text-neutral-500 hover:text-neutral-900">Verificaties</Link>
        <Link href="/admin/reviews" className="text-neutral-500 hover:text-neutral-900">Reviews</Link>
        <Link href="/admin/garages" className="text-neutral-500 hover:text-neutral-900">Garages</Link>
        <Link href="/admin/gebruikers" className="text-neutral-500 hover:text-neutral-900">Gebruikers</Link>
      </nav>
      <Link href="/admin/garages" className="text-[12px] text-neutral-500 hover:text-neutral-900 mb-2 inline-block">
        ← Terug naar garages
      </Link>
      <h1 className="text-[22px] font-medium text-neutral-900 mb-6">Garagedetail</h1>
      <AdminGarageDetail garageId={params.id} />
    </div>
  )
}
