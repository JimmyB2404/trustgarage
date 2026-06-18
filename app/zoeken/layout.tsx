import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zoekresultaten',
  description: 'Zoek en vergelijk betrouwbare garages bij jou in de buurt. Filter op diensten, taal en KVK-verificatie.',
}

export default function ZoekenLayout({ children }: { children: React.ReactNode }) {
  return children
}
