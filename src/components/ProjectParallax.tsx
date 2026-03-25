'use client'

import { useState } from 'react'

const projects = [
  { title: 'Jeffs funhouse', description: 'Komplett målning av min kompis Jeffs hus utanför Florida.', image: '/bluehouse_wmb.webp' },
  { title: 'Villa Djursholm', description: 'Komplett utvändig ommålning av villa i Djursholm.', image: null },
  { title: 'Kontorsrenovering Kungsholmen', description: 'Total renovering av kontorslokal på 400 kvm.', image: null },
  { title: 'Lägenhet Södermalm', description: 'Invändig målning av 3:a på Södermalm.', image: null },
  { title: 'Radhus Enskede', description: 'Helrenovering av radhus från 1960-talet.', image: null },
  { title: 'Restaurang Östermalm', description: 'Målning och specialeffekter för nyöppnad restaurang.', image: null },
  { title: 'Sekelskiftesfastighet Vasastan', description: 'Varsam renovering av trapphus i sekelskiftesfastighet.', image: null },
  { title: 'Sommarstuga Roslagen', description: 'Utvändig målning av sommarhus med Falu Rödfärg.', image: null },
]

const topRow = [0, 1, 2, 3]
const bottomRow = [4, 5, 6, 7]

function ProjectCard({ project }: { project: typeof projects[number] }) {
  return (
    <div className="relative w-72 sm:w-80 h-48 sm:h-56 rounded-2xl overflow-hidden shrink-0 group">
      {project.image ? (
        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
          <h3 className="text-white font-bold text-sm mb-1">{project.title}</h3>
          <p className="text-white/70 text-xs">{project.description}</p>
        </div>
      </div>
    </div>
  )
}

function TickerRow({ items, reverse }: { items: number[]; reverse?: boolean }) {
  const [paused, setPaused] = useState(false)
  const tripled = [...items, ...items, ...items]

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-6 w-max"
        style={{
          animation: `${reverse ? 'ticker-right' : 'ticker-left'} 35s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {tripled.map((projectIndex, i) => (
          <ProjectCard key={i} project={projects[projectIndex]} />
        ))}
      </div>
    </div>
  )
}

export default function ProjectParallax() {
  return (
    <section className="overflow-hidden">
      <div className="py-20 sm:py-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Tidigare projekt</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Ett urval av våra arbeten
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-6 py-12">
        <TickerRow items={topRow} />
        <TickerRow items={bottomRow} reverse />
      </div>

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
