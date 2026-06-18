import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TrustGarage.nl — Vind een betrouwbare garage'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #E1F5EE 0%, #ffffff 60%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 84,
            fontFamily: 'Georgia, serif',
          }}
        >
          <span style={{ color: '#0F6E56' }}>TrustGarage</span>
          <span style={{ color: '#1A1A1A' }}>.nl</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#666666',
            marginTop: 24,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Vind een betrouwbare garage in Nederland
        </div>
      </div>
    ),
    { ...size }
  )
}
