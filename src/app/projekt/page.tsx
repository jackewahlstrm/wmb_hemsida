'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Skeleton from '@mui/material/Skeleton'
import WithSkeleton from '@/components/WithSkeleton'
import { SectionSkeleton } from '@/components/PageSkeleton'
import ProjectLightbox from '@/components/ProjectLightbox'

const projects = [
  {
    id: 1,
    title: 'Jeffs funhouse',
    category: 'Utvändig',
    description: 'Komplett målning av min kompis Jeffs hus utanför Florida.',
    image: '/bluehouse_wmb.webp',
  },
  {
    id: 2,
    title: 'Kontorsrenovering Kungsholmen',
    category: 'Kommersiellt',
    description: 'Total renovering av kontorslokal på 400 kvm.',
  },
  {
    id: 3,
    title: 'Lägenhet Södermalm',
    category: 'Invändig',
    description: 'Invändig målning av 3:a på Södermalm.',
  },
  {
    id: 4,
    title: 'Radhus Enskede',
    category: 'Renovering',
    description: 'Helrenovering av radhus från 1960-talet.',
  },
  {
    id: 5,
    title: 'Restaurang Östermalm',
    category: 'Kommersiellt',
    description: 'Målning och specialeffekter för nyöppnad restaurang.',
  },
  {
    id: 6,
    title: 'Sekelskiftesfastighet Vasastan',
    category: 'Renovering',
    description: 'Varsam renovering av trapphus i sekelskiftesfastighet.',
  },
  {
    id: 7,
    title: 'Sommarstuga Roslagen',
    category: 'Utvändig',
    description: 'Utvändig målning av sommarhus med Falu Rödfärg.',
  },
  {
    id: 8,
    title: 'Penthouse Strandvägen',
    category: 'Invändig',
    description: 'Exklusiv invändig målning med specialfärger.',
  },
  {
    id: 9,
    title: 'BRF Kungsholmen',
    category: 'Kommersiellt',
    description: 'Komplett ommålning av trapphus och gemensamma utrymmen.',
  },
  {
    id: 10,
    title: 'Villa Saltsjöbaden',
    category: 'Utvändig',
    description: 'Utvändig målning och fönsterrenovering av sjönära villa.',
  },
  // Extra projekt som visas efter "Se mer"
  {
    id: 11,
    title: 'Kontor Södermalm',
    category: 'Kommersiellt',
    description: 'Modern kontorsrenovering med specialfärger och akustiktak.',
  },
  {
    id: 12,
    title: 'Townhouse Djurgården',
    category: 'Renovering',
    description: 'Totalrenovering av klassiskt townhouse med originaldetaljer.',
  },
  {
    id: 13,
    title: 'Café Vasastan',
    category: 'Kommersiellt',
    description: 'Invändig målning och inredning för nyöppnat café.',
  },
  {
    id: 14,
    title: 'Villa Lidingö',
    category: 'Utvändig',
    description: 'Fasadmålning med linoljefärg på sekelskiftesvilla.',
  },
  {
    id: 15,
    title: 'Lägenhet Östermalm',
    category: 'Invändig',
    description: 'Exklusiv spackling och målning i paradlägenhet.',
  },
  {
    id: 16,
    title: 'Skola Hägersten',
    category: 'Kommersiellt',
    description: 'Ommålning av klassrum och korridorer under sommarlovet.',
  },
  {
    id: 17,
    title: 'Fritidshus Vaxholm',
    category: 'Utvändig',
    description: 'Utvändig målning med Falu Rödfärg och fönsterbyte.',
  },
  {
    id: 18,
    title: 'Radhus Bromma',
    category: 'Renovering',
    description: 'Invändig totalrenovering med nytt kök och badrum.',
  },
  {
    id: 19,
    title: 'Restaurang Gamla Stan',
    category: 'Kommersiellt',
    description: 'Varsam målning med hänsyn till historisk interiör.',
  },
  {
    id: 20,
    title: 'Villa Täby',
    category: 'Invändig',
    description: 'Komplett invändig målning efter nybyggnation.',
  },
]

const INITIAL_COUNT = 10
const LOAD_MORE_COUNT = 10

const heights = ['h-52', 'h-96', 'h-64', 'h-80', 'h-44', 'h-72', 'h-96', 'h-56', 'h-80', 'h-44', 'h-64', 'h-96', 'h-52', 'h-80', 'h-44', 'h-72', 'h-96', 'h-56', 'h-44', 'h-80']

const floatDurations = [6, 7, 8, 5, 7.5, 6.5, 8.5, 5.5, 7, 6]

function ProjectCard({ project, height, delay, index, onClick }: { project: typeof projects[number]; height: string; delay: number; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Triggas varje gång kortet scrollas in/ut
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // -1 till 1 från center
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMouse({ x, y })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 })
  }, [])

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative break-inside-avoid overflow-hidden rounded-2xl cursor-pointer ${height}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {/* Parallax-bild */}
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{
            transform: `scale(1.1) translate(${mouse.x * -15}px, ${mouse.y * -15}px)`,
          }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 transition-transform duration-300 ease-out"
          style={{
            transform: `scale(1.1) translate(${mouse.x * -15}px, ${mouse.y * -15}px)`,
          }}
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
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const visibleProjects = projects.slice(0, visibleCount)
  const hasMore = visibleCount < projects.length

  // Fördela kort i 3 kolumner (round-robin)
  const columns: { project: typeof projects[number]; globalIndex: number }[][] = [[], [], []]
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

  return (
    <WithSkeleton skeleton={<SectionSkeleton cards={6} />}>
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
          projects={visibleProjects}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + visibleProjects.length) % visibleProjects.length)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % visibleProjects.length)}
        />
      )}
    </WithSkeleton>
  )
}
