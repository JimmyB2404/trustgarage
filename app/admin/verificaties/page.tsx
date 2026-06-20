import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'
import AdminVerificationsQueue from './AdminVerificationsQueue'

export default async function AdminVerificationsPage() {
  if (!(await isAdmin())) notFound()

  return (
    <div className="max-w-site mx-auto px-6 py-8">
      <nav className="flex gap-4 mb-6 text-[14px]">
        <Link href="/admin" className="text-neutral-500 hover:text-neutral-900">
          Statistieken
        </Link>
        <span className="font-medium text-primary">Verificaties</span>
      </nav>
      <h1 className="text-[22px] font-medium text-neutral-900 mb-1">Verificaties</h1>
      <p className="text-[13px] text-neutral-500 mb-6">
        Reviews die wachten op jouw laatste controle — via uitnodiging (nummer van garage en klant
        komen overeen) of spontaan (de garage heeft het bonnummer al blind bevestigd).
      </p>
      <AdminVerificationsQueue />
    </div>
  )
}
