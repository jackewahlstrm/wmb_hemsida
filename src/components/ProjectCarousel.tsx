'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const projects = [
  { title: 'Jeffs funhouse', description: 'Komplett målning av min kompis Jeffs hus utanför Florida.', image: '/bluehouse_wmb.webp' },
  { title: 'Villa Djursholm', description: 'Komplett utvändig ommålning av villa i Djursholm.', image: null },
  { title: 'Kontorsrenovering Kungsholmen', description: 'Total renovering av kontorslokal på 400 kvm.', image: null },
  { title: 'Lägenhet Södermalm', description: 'Invändig målning av 3:a på Södermalm.', image: null },
  { title: 'Radhus Enskede', description: 'Helrenovering av radhus från 1960-talet.', image: null },
  { title: 'Restaurang Östermalm', description: 'Målning och specialeffekter för nyöppnad restaurang.', image: null },
]

const DURATION = 6000

export default function ProjectCarousel() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const startTime = useRef(Date.now())
  const rafRef = useRef<number>(0)
  const touchStart = useRef<number | null>(null)
  const total = projects.length

  const goTo = useCallback((index: number) => {
    setTransitioning(true)
    setTimeout(() => {
      setActive(index)
      setProgress(0)
      startTime.current = Date.now()
      setTransitioning(false)
    }, 500)
  }, [])

  const next = useCallback(() => goTo((active + 1) % total), [active, total, goTo])
  const prev = useCallback(() => goTo((active - 1 + total) % total), [active, total, goTo])

  // Progressbar + autoplay
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startTime.current
      const pct = Math.min(elapsed / DURATION, 1)
      setProgress(pct)

      if (pct >= 1) {
        goTo((active + 1) % total)
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    startTime.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, total, goTo])

  // Touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return
    const diff = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(diff) > 60) {
      if (diff > 0) prev()
      else next()
    }
    touchStart.current = null
  }

  const project = projects[active]

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Tidigare projekt</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Ett urval av våra arbeten
          </h2>
        </div>
      </div>

      {/* Slider */}
      <div
        className="relative w-full h-[50vh] sm:h-[65vh] overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Bild */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/10 via-transparent to-wmb-blue/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
              </div>
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Info */}
        <div className={`absolute bottom-0 left-0 right-0 p-8 sm:p-12 transition-all duration-500 ${transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="max-w-7xl mx-auto flex items-end justify-between gap-8">
            <div>
              <span className="text-white/60 text-sm font-medium">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2">{project.title}</h3>
              <p className="text-white/80 text-sm sm:text-base mt-2 max-w-lg">{project.description}</p>
            </div>

            {/* Nav-knappar */}
            <div className="flex gap-3 shrink-0">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                aria-label="Föregående"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                aria-label="Nästa"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Progressbar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div className="flex h-full">
            {projects.map((_, i) => (
              <div key={i} className="flex-1 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-white transition-none"
                  style={{
                    width: i < active ? '100%' : i === active ? `${progress * 100}%` : '0%',
                    opacity: i <= active ? 1 : 0.2,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
