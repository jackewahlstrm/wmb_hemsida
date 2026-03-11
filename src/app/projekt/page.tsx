'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'

const categories = ['Alla', 'Invändig', 'Utvändig', 'Renovering', 'Kommersiellt']

const projects = [
  {
    id: 1,
    title: 'Villa Djursholm',
    category: 'Utvändig',
    client: 'Privat kund',
    description: 'Komplett utvändig ommålning av villa i Djursholm. Fasadtvätt, skrapning och två lager alkydoljefärg.',
  },
  {
    id: 2,
    title: 'Kontorsrenovering Kungsholmen',
    category: 'Kommersiellt',
    client: 'Företagskund',
    description: 'Total renovering av kontorslokal på 400 kvm. Spackling, målning och tapetsering.',
  },
  {
    id: 3,
    title: 'Lägenhet Södermalm',
    category: 'Invändig',
    client: 'Privat kund',
    description: 'Invändig målning av 3:a på Södermalm. Väggar, tak och snickerier i hela lägenheten.',
  },
  {
    id: 4,
    title: 'Radhus Enskede',
    category: 'Renovering',
    client: 'Privat kund',
    description: 'Helrenovering av radhus från 1960-talet. Nytt kök, badrum och komplett ommålning.',
  },
  {
    id: 5,
    title: 'Restaurang Östermalm',
    category: 'Kommersiellt',
    client: 'Restaurangkedja',
    description: 'Målning och specialeffekter för nyöppnad restaurang. Dekorativ bemålning och lackering.',
  },
  {
    id: 6,
    title: 'Sekelskiftesfastighet Vasastan',
    category: 'Renovering',
    client: 'BRF',
    description: 'Varsam renovering av trapphus i sekelskiftesfastighet. Restaurering av originaldetaljer.',
  },
  {
    id: 7,
    title: 'Sommarstuga Roslagen',
    category: 'Utvändig',
    client: 'Privat kund',
    description: 'Utvändig målning av sommarhus med Falu Rödfärg. Inklusive fönsterrenovering.',
  },
  {
    id: 8,
    title: 'Penthouse Strandvägen',
    category: 'Invändig',
    client: 'Privat kund',
    description: 'Exklusiv invändig målning med specialfärger. Marmoreffekter och gulddetaljer.',
  },
]

export default function ProjektPage() {
  const [activeCategory, setActiveCategory] = useState('Alla')

  const filtered = activeCategory === 'Alla'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

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

      {/* Filter & Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex items-center gap-2 mb-12 flex-wrap">
            <Filter size={18} className="text-zinc-400 mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-wmb-red text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image placeholder */}
                <div className="h-56 bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-wmb-red text-white text-xs font-medium rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs text-wmb-blue font-medium mb-1">{project.client}</p>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 dark:text-zinc-400">Inga projekt i denna kategori ännu.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
