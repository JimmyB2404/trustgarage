export const COOKIE_CONSENT_KEY = 'tg_cookie_consent'
export const COOKIE_CONSENT_EVENT = 'tg-cookie-consent-changed'

export type CookieConsent = 'granted' | 'denied'

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  const value = localStorage.getItem(COOKIE_CONSENT_KEY)
  return value === 'granted' || value === 'denied' ? value : null
}

export function setCookieConsent(value: CookieConsent) {
  localStorage.setItem(COOKIE_CONSENT_KEY, value)
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT))
}
