import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, path } = await request.json()
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId krävs' }, { status: 400 })
    }

    // Skippa admin-trafik
    const pathStr = typeof path === 'string' ? path : '/'
    if (pathStr.startsWith('/admin')) {
      return NextResponse.json({ skipped: true })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return NextResponse.json({ skipped: true })
    }

    const { error } = await supabase
      .from('page_views')
      .insert([{ session_id: sessionId.slice(0, 64), path: pathStr.slice(0, 200) }])

    if (error) {
      console.error('Track error:', error)
      return NextResponse.json({ error: 'Kunde inte logga' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Fel' }, { status: 500 })
  }
}
