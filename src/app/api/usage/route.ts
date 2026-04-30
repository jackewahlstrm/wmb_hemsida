import { NextResponse } from 'next/server'

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({
      configured: false,
      message: 'CLOUDINARY_API_KEY och CLOUDINARY_API_SECRET saknas',
    })
  }

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({
        configured: true,
        error: `Cloudinary svarade ${res.status}`,
      })
    }

    const data = await res.json()
    return NextResponse.json({
      configured: true,
      plan: data.plan ?? 'Unknown',
      storageUsedBytes: data.storage?.usage ?? 0,
      storageLimitBytes: data.storage?.limit ?? 25 * 1024 * 1024 * 1024,
      bandwidthUsedBytes: data.bandwidth?.usage ?? 0,
      bandwidthLimitBytes: data.bandwidth?.limit ?? null,
      creditsUsed: data.credits?.usage ?? null,
      creditsLimit: data.credits?.limit ?? null,
      checkedAt: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json({ configured: true, error: 'Kunde inte nå Cloudinary' })
  }
}
