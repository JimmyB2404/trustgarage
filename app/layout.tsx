import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import CookieConsent from '@/components/ui/CookieConsent'
import GoogleAnalytics from '@/components/ui/GoogleAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://trustgarage.nl'),
  title: {
    template: '%s | TrustGarage.nl',
    default: 'TrustGarage.nl — Vind een betrouwbare garage',
  },
  description: 'Vind een betrouwbare garage in Nederland. Lees eerlijke reviews, vergelijk diensten en prijzen. Ideaal voor Nederlanders en expats.',
  keywords: ['garage', 'betrouwbaar', 'APK', 'autoonderhoud', 'reviews', 'Nederland'],
  openGraph: {
    title: 'TrustGarage.nl — Vind een betrouwbare garage',
    description: 'Lees eerlijke reviews en vind de beste garage bij jou in de buurt.',
    type: 'website',
    locale: 'nl_NL',
    siteName: 'TrustGarage.nl',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustGarage.nl — Vind een betrouwbare garage',
    description: 'Lees eerlijke reviews en vind de beste garage bij jou in de buurt.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-white font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <CookieConsent />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
