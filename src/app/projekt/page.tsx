'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Skeleton from '@mui/material/Skeleton'
import ProjectLightbox from '@/components/ProjectLightbox'
import { getProjectsByCategory } from '@/lib/projects'
import type { Project } from '@/lib/types'

const INITIAL_COUNT = 10
const LOAD_MORE_COUNT = 10

const heights = ['h-52', 'h-96', 'h-64', 'h-80', 'h-44', 'h-72', 'h-96', 'h-56', 'h-80', 'h-44', 'h-64', 'h-96', 'h-52', 'h-80', 'h-44', 'h-72', 'h-96', 'h-56', 'h-44', 'h-80']

function ProjectCard({ project, height, delay, index, onClick }: { project: Project; height: string; delay: number; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const image = project.images?.[0] || null

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMouse({ x, y })
  }, [])

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      className={`group relative break-inside-avoid overflow-hidden rounded-2xl cursor-pointer ${height}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transform: `scale(1.1) translate(${mouse.x * -15}px, ${mouse.y * -15}px)` }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 transition-transform duration-300 ease-out"
          style={{ transform: `scale(1.1) translate(${mouse.x * -15}px, ${mouse.y * -15}px)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/10 via-transparent to-wmb-blue/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
        <p className="text-white/80 text-sm leading-relaxed">{project.description}</p>
      </div>
    </div>
  )
}

function MasonrySkeletons({ count }: { count: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={`skel-${i}`} className={`break-inside-avoid rounded-2xl overflow-hidden ${heights[i % heights.length]}`}>
          <Skeleton variant="rounded" width="100%" height="100%" sx={{ borderRadius: '16px' }} />
        </div>
      ))}
    </>
  )
}

export default function ProjektPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    getProjectsByCategory('projekt').then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [])

  const visibleProjects = projects.slice(0, visibleCount)
  const hasMore = visibleCount < projects.length

  const columns: { project: Project; globalIndex: number }[][] = [[], [], []]
  visibleProjects.forEach((project, i) => {
    columns[i % 3].push({ project, globalIndex: i })
  })

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, projects.length))
      setLoadingMore(false)
    }, 1500)
  }

  // Lightbox-data: konvertera till format som ProjectLightbox förväntar
  const lightboxProjects = visibleProjects.map((p) => ({
    id: typeof p.id === 'string' ? parseInt(p.id, 10) || 0 : 0,
    title: p.title,
    description: p.description,
    image: p.images?.[0] || undefined,
  }))

  if (loading) {
    return (
      <>
        <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Skeleton variant="text" width={120} height={20} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width={400} height={48} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width={500} height={24} sx={{ mx: 'auto' }} />
          </div>
        </section>
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: '16px' }} />
              ))}
            </div>
          </div>
        </section>
      </>
    )
  }

  if (projects.length === 0) {
    return (
      <>
        <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Våra projekt</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
              Arbeten vi är stolta över
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Projekt kommer snart. Håll utkik!
            </p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Våra projekt</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Arbeten vi är stolta över
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Här är ett urval av våra genomförda projekt. Varje uppdrag utförs med samma
            noggrannhet och kvalitet, oavsett storlek.
          </p>
        </div>
      </section>

      {/* Masonry */}
      <section className="py-20 sm:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {columns.map((col, colIndex) => (
              <div key={colIndex}>
                <div
                  className="flex flex-col gap-5"
                  style={{
                    animationName: `float-${colIndex}`,
                    animationDuration: `${[6, 7.5, 8][colIndex]}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${colIndex * 1.5}s`,
                  }}
                >
                  {col.map(({ project, globalIndex }) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      height={heights[globalIndex % heights.length]}
                      delay={(globalIndex % 3) * 0.1}
                      index={globalIndex}
                      onClick={() => setLightboxIndex(globalIndex)}
                    />
                  ))}

                  {loadingMore && (
                    <MasonrySkeletons count={Math.ceil(LOAD_MORE_COUNT / 3)} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {hasMore && !loadingMore && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-8 py-4 bg-wmb-red hover:bg-wmb-red/90 text-white font-semibold rounded-xl transition-all hover:scale-105"
              >
                Visa fler projekt
              </button>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <ProjectLightbox
          projects={lightboxProjects}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + visibleProjects.length) % visibleProjects.length)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % visibleProjects.length)}
        />
      )}
    </>
  )
}
