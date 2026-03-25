'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const slides = [
  { image: '/bluehouse_wmb.webp' },
  { image: '/bluehouse_wmb.webp' },
  { image: '/bluehouse_wmb.webp' },
]

const DURATION = 6000

export default function HeroSlideshow() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const startTime = useRef(Date.now())
  const rafRef = useRef<number>(0)
  const activeRef = useRef(0)
  const total = slides.length

  const advance = useCallback(() => {
    const next = (activeRef.current + 1) % total
    activeRef.current = next
    setActive(next)
    setProgress(0)
    startTime.current = Date.now()
  }, [total])

  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startTime.current
      const pct = Math.min(elapsed / DURATION, 1)
      setProgress(pct)

      if (pct >= 1) {
        advance()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    startTime.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [advance])

  return (
    <>
      {/* Bakgrundsbilder som crossfade */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Mörk overlay */}
      <div className="absolute inset-0 bg-zinc-900/70" />

      {/* Progressbar längst ned */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div className="flex h-full gap-1">
          {slides.map((_, i) => (
            <div key={i} className="flex-1 relative overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-white/20" />
              <div
                className="absolute inset-y-0 left-0 bg-white/60"
                style={{
                  width: i < active ? '100%' : i === active ? `${progress * 100}%` : '0%',
                  transition: i === active ? 'none' : 'width 0.3s ease',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
