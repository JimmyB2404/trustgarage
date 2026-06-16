import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | TrustGarage.nl',
    default: 'TrustGarage.nl — Vind een betrouwbare garage',
  },
  description: 'Vind een betrouwbare garage in Nederland. Lees eerlijke reviews, vergelijk diensten en prijzen. Ideaal voor Nederlanders en expats.',
  keywords: ['garage', 'betrouwbaar', 'APK', 'autoonderhoud', 'reviews', 'Maastricht'],
  openGraph: {
    title: 'TrustGarage.nl — Vind een betrouwbare garage',
    description: 'Lees eerlijke reviews en vind de beste garage bij jou in de buurt.',
    type: 'website',
    locale: 'nl_NL',
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
        {children}
      </body>
    </html>
  )
}
