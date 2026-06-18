import { getSessionUser } from './session'

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser()
  if (!user?.email || !process.env.ADMIN_EMAIL) return false
  return user.email.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim()
}
