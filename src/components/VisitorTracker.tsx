'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SESSION_KEY = 'wmb_session_id'
const TRACKED_KEY = 'wmb_tracked'

export default function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Skippa admin-sidor
    if (pathname?.startsWith('/admin')) return

    try {
      // En session = en besökare. sessionStorage rensas när fliken stängs.
      let sessionId = sessionStorage.getItem(SESSION_KEY)
      const alreadyTracked = sessionStorage.getItem(TRACKED_KEY) === '1'
      if (sessionId && alreadyTracked) return

      if (!sessionId) {
        sessionId =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`
        sessionStorage.setItem(SESSION_KEY, sessionId)
      }

      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, path: pathname || '/' }),
        keepalive: true,
      })
        .then(() => sessionStorage.setItem(TRACKED_KEY, '1'))
        .catch(() => {})
    } catch {
      // sessionStorage kan vara blockerat — ignorera
    }
  }, [pathname])

  return null
}
