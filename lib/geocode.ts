// Gratis OpenStreetMap-geocoding — geen API-key nodig, in tegenstelling tot Google's Geocoding
// API die geen browser-referrer-restrictie accepteert voor server-side calls. Ons gebruik (alleen
// bij aanmelden/adreswijziging) blijft ruim binnen Nominatim's gratis rate limit van 1 req/sec.
export async function geocodeAddress(address: string, city: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const query = encodeURIComponent(`${address}, ${city}, Nederland`)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { 'User-Agent': 'TrustGarage.nl (info@trustgarage.nl)' } }
    )
    if (!res.ok) return null
    const results = await res.json()
    const first = results?.[0]
    if (!first) return null
    return { latitude: parseFloat(first.lat), longitude: parseFloat(first.lon) }
  } catch {
    return null
  }
}
