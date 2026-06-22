'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type AdminUser = {
  id: string
  email: string | undefined
  created_at: string
  banned: boolean
  garageName: string | null
}

export default function AdminUsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(({ users }) => setUsers(users ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function handleToggleBan(user: AdminUser) {
    if (!user.banned && !confirm(`${user.email} blokkeren? Dit account kan dan niet meer inloggen.`)) return
    setBusyId(user.id)
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, banned: !user.banned }),
    })
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, banned: !u.banned } : u))
    setBusyId(null)
  }

  const visible = users.filter(u => (u.email ?? '').toLowerCase().includes(query.toLowerCase()))

  if (loading) return <p className="text-[14px] text-neutral-400">Laden...</p>

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Zoek op e-mailadres..."
        className="input-field max-w-[320px] mb-4"
      />

      {visible.length === 0 ? (
        <p className="text-[14px] text-neutral-400">Geen gebruikers gevonden.</p>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-[9px] overflow-hidden max-w-[860px]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface text-left text-neutral-500 border-b border-neutral-100">
                <th className="px-4 py-2 font-medium">E-mail</th>
                <th className="px-4 py-2 font-medium">Rol</th>
                <th className="px-4 py-2 font-medium">Aangemaakt</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map(u => (
                <tr key={u.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-2 text-neutral-900">{u.email}</td>
                  <td className="px-4 py-2 text-neutral-500">
                    {u.garageName ? `Garage-eigenaar (${u.garageName})` : 'Klant'}
                  </td>
                  <td className="px-4 py-2 text-neutral-500">
                    {new Date(u.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-2">
                    <span className={cn(
                      'text-[11px] font-medium px-2 py-[2px] rounded-sm',
                      u.banned ? 'bg-danger/10 text-danger' : 'bg-primary-light text-primary'
                    )}>
                      {u.banned ? 'Geblokkeerd' : 'Actief'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleToggleBan(u)}
                      disabled={busyId === u.id}
                      className={cn('text-[12px] hover:underline disabled:opacity-50', u.banned ? 'text-primary' : 'text-danger')}
                    >
                      {u.banned ? 'Deblokkeren' : 'Blokkeren'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
