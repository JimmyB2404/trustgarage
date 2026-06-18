import { getSessionUser } from './session'

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser()
  if (!user?.email || !process.env.ADMIN_EMAIL) return false
  const adminEmails = process.env.ADMIN_EMAIL.split(',').map(e => e.toLowerCase().trim())
  return adminEmails.includes(user.email.toLowerCase().trim())
}
