'use client'

import { useState, useEffect } from 'react'
import { getProjectsByCategory, formatTitle } from '@/lib/projects'
import type { Project } from '@/lib/types'

function ProjectCard({ project }: { project: Project }) {
  const image = project.images?.[0] || null

  return (
    <div className="relative w-72 sm:w-80 h-48 sm:h-56 rounded-2xl overflow-hidden shrink-0 group">
      {image ? (
        <img src={image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      ) : (
        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/10 via-transparent to-wmb-blue/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-sm mb-1">{formatTitle(project)}</h3>
          <p className="text-white/70 text-xs">{project.description}</p>
        </div>
      </div>
    </div>
  )
}

function TickerRow({ items, reverse }: { items: Project[]; reverse?: boolean }) {
  const [paused, setPaused] = useState(false)
  // Säkerställ tillräckligt med kort för att fylla skärmbredden även med få bilder
  const MIN_BASE = 8
  const multiplier = items.length > 0 ? Math.max(1, Math.ceil(MIN_BASE / items.length)) : 1
  const expanded = Array.from({ length: multiplier }, () => items).flat()
  const tripled = [...expanded, ...expanded, ...expanded]

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-6 w-max"
        style={{
          animation: `${reverse ? 'ticker-right' : 'ticker-left'} 150s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {tripled.map((project, i) => (
          <ProjectCard key={`${project.id}-${i}`} project={project} />
        ))}
      </div>
    </div>
  )
}

export default function ProjectParallax() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    getProjectsByCategory('ticker').then((data) => {
      setProjects(data)
    })
  }, [])

  // Dela upp i två rader
  const mid = Math.ceil(projects.length / 2)
  const topRow = projects.slice(0, Math.max(mid, 1))
  const bottomRow = projects.slice(mid).length > 0 ? projects.slice(mid) : projects

  return (
    <section className="py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Tidigare projekt</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Ett urval av våra arbeten
          </h2>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-6">
          <TickerRow items={topRow} />
          <TickerRow items={bottomRow} reverse />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-400">Bilder laddas...</p>
        </div>
      )}

      <style jsx>{`
        @keyframes ticker-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes ticker-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
