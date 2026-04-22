'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Paintbrush, Home, Building2, Layers, Wallpaper, Hammer, SprayCan, Ruler, Wrench, ClipboardList, Palette, Droplets } from 'lucide-react'
import WithSkeleton from '@/components/WithSkeleton'
import { ServicesSkeleton } from '@/components/PageSkeleton'

const services = [
  {
    slug: 'invandig-malning',
    icon: Paintbrush,
    title: 'Invändig målning',
    description: 'Professionell invändig målning av väggar, tak och snickerier. Vi använder högkvalitativa färger för ett hållbart och vackert resultat.',
    features: ['Väggar & tak', 'Snickerier & lister', 'Dörrar & fönster', 'Kök & badrum'],
    image: '/bluehouse_wmb.webp',
  },
  {
    slug: 'utvandig-malning',
    icon: Home,
    title: 'Utvändig målning',
    description: 'Skydda och förnya ditt hus med utvändig målning. Vi hanterar alla typer av fasader och väderförhållanden.',
    features: ['Träfasader', 'Putsfasader', 'Fönster & dörrar', 'Altaner & trädäck'],
    image: null,
  },
  {
    slug: 'spackling',
    icon: Layers,
    title: 'Spackling',
    description: 'Expert på spackling och ytbehandling. Vi skapar perfekt släta ytor inför målning eller tapetsering.',
    features: ['Hållagning', 'Skarvspackling', 'Bredspackling', 'Finspackling'],
    image: null,
  },
  {
    slug: 'tapetsering',
    icon: Wallpaper,
    title: 'Tapetsering',
    description: 'Professionell tapetsering med precision och noggrannhet. Vi hjälper dig välja rätt tapet för ditt rum.',
    features: ['Tapetborttagning', 'Uppsättning', 'Mönsterpassning', 'Specialtapeter'],
    image: '/tapetsering.jpg',
  },
  {
    slug: 'fasadrenovering',
    icon: Building2,
    title: 'Fasadrenovering',
    description: 'Komplett fasadrenovering för att ge ditt hus nytt liv. Vi hanterar allt från rengöring till slutbehandling.',
    features: ['Fasadtvätt', 'Lagning & reparation', 'Ommålning', 'Energieffektivisering'],
    image: null,
  },
  {
    slug: 'byggtjanster',
    icon: Hammer,
    title: 'Byggtjänster',
    description: 'Vi erbjuder kompletterande byggtjänster för att kunna leverera helhetslösningar vid renoveringsprojekt.',
    features: ['Snickeri', 'Golvläggning', 'Kakel & klinker', 'Renoveringar'],
    image: null,
  },
  {
    slug: 'lackering',
    icon: SprayCan,
    title: 'Lackering',
    description: 'Professionell lackering av möbler, snickerier och andra ytor. Vi ger nytt liv åt slitna möbler.',
    features: ['Möbellackering', 'Snickerilackering', 'Betsning', 'Oljning'],
    image: null,
  },
  {
    slug: 'fargsattning',
    icon: Ruler,
    title: 'Färgsättning & rådgivning',
    description: 'Osäker på vilken färg du ska välja? Vi hjälper dig med professionell färgsättning och materialval.',
    features: ['Färgkonsultation', 'Materialrådgivning', 'NCS-färger', 'Provmålning'],
    image: null,
  },
  {
    slug: 'underhall',
    icon: Wrench,
    title: 'Underhåll',
    description: 'Regelbundet underhåll av fastigheter för att bevara värdet och utseendet på din bostad eller lokal.',
    features: ['Löpande underhåll', 'Serviceavtal', 'Akutinsatser', 'Besiktning'],
    image: null,
  },
  {
    slug: 'projektledning',
    icon: ClipboardList,
    title: 'Projektledning',
    description: 'Vi tar ansvar för hela projektet från start till mål. Planering, samordning och kvalitetssäkring.',
    features: ['Projektplanering', 'Samordning', 'Tidplan', 'Kvalitetskontroll'],
    image: null,
  },
  {
    slug: 'dekorationsmalning',
    icon: Palette,
    title: 'Dekorationsmålning',
    description: 'Kreativ och dekorativ målning för unika uttryck. Från marmorering till muralmålning.',
    features: ['Marmorering', 'Muralmålning', 'Schablonmålning', 'Specialeffekter'],
    image: null,
  },
  {
    slug: 'epoxymalning',
    icon: Droplets,
    title: 'Epoxymålning',
    description: 'Tåliga och hållbara epoxygolv och ytor för garage, industri och kommersiella lokaler.',
    features: ['Garagegolv', 'Industrigolv', 'Våtrum', 'Betongytor'],
    image: '/epoxy.jpg',
  },
]

function TjansterContent() {
  const searchParams = useSearchParams()
  const slugParam = searchParams.get('service')
  const initialIndex = slugParam ? services.findIndex((s) => s.slug === slugParam) : 0
  const [active, setActive] = useState(initialIndex >= 0 ? initialIndex : 0)

  useEffect(() => {
    if (slugParam) {
      const i = services.findIndex((s) => s.slug === slugParam)
      if (i >= 0) setActive(i)
    }
  }, [slugParam])

  const service = services[active]

  return (
    <WithSkeleton skeleton={<ServicesSkeleton />}>
      {/* Hero */}
      <section className="py-10 sm:py-14 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Våra tjänster</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Allt inom måleri & bygg
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Vi erbjuder ett brett utbud av tjänster inom måleri och bygg. Oavsett om det är ett litet
            hemmafix eller ett stort renoveringsprojekt — vi levererar alltid med kvalitet och omsorg.
          </p>
        </div>
      </section>

      {/* Tabs + preview */}
      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs (pillar) */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {services.map((s, i) => {
              const isActive = active === i
              return (
                <button
                  key={s.title}
                  onClick={() => setActive(i)}
                  className={`group/tab relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? 'bg-wmb-red text-white shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <s.icon size={14} className={isActive ? 'text-white' : 'text-wmb-blue'} />
                  <span>{s.title}</span>
                </button>
              )
            })}
          </div>

          {/* Preview-panel */}
          <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div key={active} className="animate-fade-in grid grid-cols-1 lg:grid-cols-2">
              {/* Bild */}
              <div className="relative h-72 lg:h-[480px]">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/10 via-transparent to-wmb-blue/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <service.icon size={22} className="text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="text-xs font-medium text-wmb-blue uppercase tracking-wider mb-3">
                  {String(active + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                </span>
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{service.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                <h4 className="text-xs font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">Vad vi erbjuder</h4>
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="w-1.5 h-1.5 bg-wmb-red rounded-full shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </WithSkeleton>
  )
}

export default function TjansterPage() {
  return (
    <Suspense fallback={<ServicesSkeleton />}>
      <TjansterContent />
    </Suspense>
  )
}
