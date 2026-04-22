import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type Check = {
  status: 'ok' | 'error' | 'warning'
  label: string
  latencyMs?: number
}

async function checkSupabase(): Promise<Check> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || url.includes('placeholder')) {
    return { status: 'error', label: 'Inte konfigurerad' }
  }
  const start = Date.now()
  const { error } = await supabase.from('projects').select('id', { count: 'exact', head: true })
  const latencyMs = Date.now() - start
  if (error) return { status: 'error', label: error.message, latencyMs }
  return { status: 'ok', label: 'Ansluten', latencyMs }
}

async function checkCloudinary(): Promise<Check> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) return { status: 'error', label: 'Inte konfigurerad' }
  const start = Date.now()
  try {
    const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg`, {
      method: 'HEAD',
      cache: 'no-store',
    })
    const latencyMs = Date.now() - start
    if (res.ok) return { status: 'ok', label: 'Ansluten', latencyMs }
    return { status: 'warning', label: `Oväntat svar (${res.status})`, latencyMs }
  } catch (e) {
    return { status: 'error', label: 'Kunde inte nå tjänsten' }
  }
}

async function checkResend(): Promise<Check> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { status: 'error', label: 'Inte konfigurerad' }
  const start = Date.now()
  try {
    // POST /emails med tom payload. Med en giltig nyckel får vi 422/400 (validering-fel)
    // vilket bekräftar att nyckeln är autentiserad utan att faktiskt skicka mejl.
    // 401 = ogiltig nyckel.
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      cache: 'no-store',
    })
    const latencyMs = Date.now() - start
    if (res.status === 401) return { status: 'error', label: 'Ogiltig API-nyckel', latencyMs }
    if (res.status === 403) return { status: 'error', label: 'Saknar behörighet', latencyMs }
    // 400/422 = validering-fel men nyckeln är giltig
    if (res.status === 400 || res.status === 422 || res.ok) {
      return { status: 'ok', label: 'API-nyckel giltig', latencyMs }
    }
    let detail = ''
    try {
      const body = await res.json()
      detail = body?.message ? ` — ${body.message}` : ''
    } catch {}
    return { status: 'warning', label: `Oväntat svar (${res.status})${detail}`, latencyMs }
  } catch {
    return { status: 'error', label: 'Kunde inte nå tjänsten' }
  }
}

export async function GET() {
  const [database, cloudinary, email] = await Promise.all([
    checkSupabase(),
    checkCloudinary(),
    checkResend(),
  ])
  return NextResponse.json({
    server: { status: 'ok', label: 'Online' } satisfies Check,
    database,
    cloudinary,
    email,
    checkedAt: new Date().toISOString(),
  })
}
