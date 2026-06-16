import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { kvkNumber } = await req.json()

  if (!kvkNumber || kvkNumber.length < 8) {
    return NextResponse.json({ verified: false, error: 'Ongeldig KVK-nummer' }, { status: 400 })
  }

  // When KVK_API_KEY is set, use the real API:
  // const apiKey = process.env.KVK_API_KEY
  // if (apiKey) { ... real API call ... }

  // Mock response for development
  const mockCompanies: Record<string, string> = {
    '12345678': 'Garage Van den Berg BV',
    '23456789': 'AutoService Janssen',
    '34567890': 'Peters Autospecialisten',
  }

  const naam = mockCompanies[kvkNumber]
  if (naam) {
    return NextResponse.json({ verified: true, naam, kvkNummer: kvkNumber })
  }

  // Accept any 8-digit number in dev mode
  if (/^\d{8}$/.test(kvkNumber)) {
    return NextResponse.json({ verified: true, naam: 'Uw Bedrijf BV', kvkNummer: kvkNumber })
  }

  return NextResponse.json({ verified: false, error: 'KVK-nummer niet gevonden' })
}
