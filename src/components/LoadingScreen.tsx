'use client'

import { useState, useEffect } from 'react'

const DURATION = 3000

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = Date.now()
    let raf = 0

    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(elapsed / (DURATION - 600), 1)
      setProgress(pct)
      if (pct < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const fadeTimer = setTimeout(() => setFadeOut(true), DURATION - 600)
    const doneTimer = setTimeout(() => setLoading(false), DURATION)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  return (
    <>
      {loading && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-opacity duration-500 ${
            fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <img
            src="/wmb_logo_real.webp"
            alt="WMB"
            className="w-48 sm:w-56 h-auto rounded-xl mb-8"
          />

          {/* Progress bar */}
          <div className="w-56 sm:w-64 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full origin-left"
              style={{
                background: 'linear-gradient(to right, #d6190c, #0d237d)',
                transform: `scaleX(${progress})`,
                transition: 'transform 0.1s linear',
                width: '100%',
              }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          opacity: fadeOut ? 1 : 0,
          transition: fadeOut ? 'opacity 0.8s ease-out' : 'none',
          visibility: loading && !fadeOut ? 'hidden' : 'visible',
        }}
      >
        {children}
      </div>
    </>
  )
}
