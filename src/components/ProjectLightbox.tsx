'use client'

import { useEffect, useCallback } from 'react'
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react'

interface Project {
  id: number
  title: string
  description: string
  image?: string
}

interface Props {
  projects: Project[]
  activeIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function ProjectLightbox({ projects, activeIndex, onClose, onPrev, onNext }: Props) {
  const project = projects[activeIndex]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-zinc-500/70 dark:bg-zinc-800/80" style={{ willChange: 'opacity' }} />
      <div
        className="relative z-40 max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[50vh] sm:h-[65vh] rounded-2xl overflow-hidden shadow-2xl">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-500 text-sm">Bild kommer</span>
            </div>
          )}

          {/* Stäng */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="Stäng"
          >
            <X size={20} weight="bold" />
          </button>

          {/* Räknare */}
          <div className="absolute top-3 left-3 z-50 px-2.5 py-1 bg-black/50 rounded-full text-white text-xs font-medium">
            {activeIndex + 1} / {projects.length}
          </div>

          {/* Föregående */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="Föregående"
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          {/* Nästa */}
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="Nästa"
          >
            <CaretRight size={22} weight="bold" />
          </button>

          {/* Info overlay i botten */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <h3 className="text-lg font-bold text-white">{project.title}</h3>
            <p className="text-white/70 text-sm mt-1">{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
