'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  isGarageOwner: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isGarageOwner: false,
  isAdmin: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGarageOwner, setIsGarageOwner] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  async function checkGarageOwner(userId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('garages')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
    setIsGarageOwner(!!data)
  }

  async function checkIsAdmin() {
    const { isAdmin } = await fetch('/api/admin/check').then(r => r.json()).catch(() => ({ isAdmin: false }))
    setIsAdmin(isAdmin)
  }

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        checkGarageOwner(session.user.id)
        checkIsAdmin()
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        checkGarageOwner(session.user.id)
        checkIsAdmin()
      } else {
        setIsGarageOwner(false)
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, isGarageOwner, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
