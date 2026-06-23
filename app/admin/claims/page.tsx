import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'
import AdminClaimsQueue from './AdminClaimsQueue'

export default async function AdminClaimsPage() {
  if (!(await isAdmin())) notFound()

  return (
    <div className="max-w-site mx-auto px-6 py-8">
      <nav className="flex gap-4 mb-6 text-[14px]">
        <Link href="/admin" className="text-neutral-500 hover:text-neutral-900">Statistieken</Link>
        <Link href="/admin/verificaties" className="text-neutral-500 hover:text-neutral-900">Verificaties</Link>
        <Link href="/admin/reviews" className="text-neutral-500 hover:text-neutral-900">Reviews</Link>
        <Link href="/admin/garages" className="text-neutral-500 hover:text-neutral-900">Garages</Link>
        <Link href="/admin/gebruikers" className="text-neutral-500 hover:text-neutral-900">Gebruikers</Link>
        <span className="font-medium text-primary">Claims</span>
      </nav>
      <h1 className="text-[22px] font-medium text-neutral-900 mb-1">Garage-claims</h1>
      <p className="text-[13px] text-neutral-500 mb-6">
        Aanvragen van klanten die zichzelf als eigenaar van een (nog) niet-geclaimde garage
        opgeven. Vergelijk het opgegeven telefoonnummer/KVK-nummer met wat al op het profiel
        staat voordat je goedkeurt.
      </p>
      <AdminClaimsQueue />
    </div>
  )
}
