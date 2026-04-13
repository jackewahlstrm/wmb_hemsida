'use client'

import { useRef, useState, useEffect } from 'react'
import { Paintbrush, Home, Building2, Layers, Wallpaper, Hammer, SprayCan, Ruler, Wrench, ClipboardList, Palette, Droplets } from 'lucide-react'
import WithSkeleton from '@/components/WithSkeleton'
import { ServicesSkeleton } from '@/components/PageSkeleton'

const services = [
  {
    icon: Paintbrush,
    title: 'Invändig målning',
    description: 'Professionell invändig målning av väggar, tak och snickerier. Vi använder högkvalitativa färger för ett hållbart och vackert resultat.',
    features: ['Väggar & tak', 'Snickerier & lister', 'Dörrar & fönster', 'Kök & badrum'],
    image: '/bluehouse_wmb.webp',
  },
  {
    icon: Home,
    title: 'Utvändig målning',
    description: 'Skydda och förnya ditt hus med utvändig målning. Vi hanterar alla typer av fasader och väderförhållanden.',
    features: ['Träfasader', 'Putsfasader', 'Fönster & dörrar', 'Altaner & trädäck'],
    image: null,
  },
  {
    icon: Layers,
    title: 'Spackling',
    description: 'Expert på spackling och ytbehandling. Vi skapar perfekt släta ytor inför målning eller tapetsering.',
    features: ['Hållagning', 'Skarvspackling', 'Bredspackling', 'Finspackling'],
    image: null,
  },
  {
    icon: Wallpaper,
    title: 'Tapetsering',
    description: 'Professionell tapetsering med precision och noggrannhet. Vi hjälper dig välja rätt tapet för ditt rum.',
    features: ['Tapetborttagning', 'Uppsättning', 'Mönsterpassning', 'Specialtapeter'],
    image: null,
  },
  {
    icon: Building2,
    title: 'Fasadrenovering',
    description: 'Komplett fasadrenovering för att ge ditt hus nytt liv. Vi hanterar allt från rengöring till slutbehandling.',
    features: ['Fasadtvätt', 'Lagning & reparation', 'Ommålning', 'Energieffektivisering'],
    image: null,
  },
  {
    icon: Hammer,
    title: 'Byggtjänster',
    description: 'Vi erbjuder kompletterande byggtjänster för att kunna leverera helhetslösningar vid renoveringsprojekt.',
    features: ['Snickeri', 'Golvläggning', 'Kakel & klinker', 'Renoveringar'],
    image: null,
  },
  {
    icon: SprayCan,
    title: 'Lackering',
    description: 'Professionell lackering av möbler, snickerier och andra ytor. Vi ger nytt liv åt slitna möbler.',
    features: ['Möbellackering', 'Snickerilackering', 'Betsning', 'Oljning'],
    image: null,
  },
  {
    icon: Ruler,
    title: 'Färgsättning & rådgivning',
    description: 'Osäker på vilken färg du ska välja? Vi hjälper dig med professionell färgsättning och materialval.',
    features: ['Färgkonsultation', 'Materialrådgivning', 'NCS-färger', 'Provmålning'],
    image: null,
  },
  {
    icon: Wrench,
    title: 'Underhåll',
    description: 'Regelbundet underhåll av fastigheter för att bevara värdet och utseendet på din bostad eller lokal.',
    features: ['Löpande underhåll', 'Serviceavtal', 'Akutinsatser', 'Besiktning'],
    image: null,
  },
  {
    icon: ClipboardList,
    title: 'Projektledning',
    description: 'Vi tar ansvar för hela projektet från start till mål. Planering, samordning och kvalitetssäkring.',
    features: ['Projektplanering', 'Samordning', 'Tidplan', 'Kvalitetskontroll'],
    image: null,
  },
  {
    icon: Palette,
    title: 'Dekorationsmålning',
    description: 'Kreativ och dekorativ målning för unika uttryck. Från marmorering till muralmålning.',
    features: ['Marmorering', 'Muralmålning', 'Schablonmålning', 'Specialeffekter'],
    image: null,
  },
  {
    icon: Droplets,
    title: 'Epoxymålning',
    description: 'Tåliga och hållbara epoxygolv och ytor för garage, industri och kommersiella lokaler.',
    features: ['Garagegolv', 'Industrigolv', 'Våtrum', 'Betongytor'],
    image: null,
  },
]

export default function TjansterPage() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2

      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[i]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= viewportCenter) {
          setActiveIndex(i)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const active = services[activeIndex]

  return (
    <WithSkeleton skeleton={<ServicesSkeleton />}>
      {/* Hero */}
      <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
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

      {/* Scroll-reveal */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Vänster — sticky bild */}
            <div className="hidden lg:block relative">
              <div className="sticky top-32 h-[60vh] py-8">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  {/* Alla bilder stackade, aktiv synlig */}
                  {services.map((service, i) => (
                    <div
                      key={service.title}
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{ opacity: i === activeIndex ? 1 : 0 }}
                    >
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800">
                          <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/10 via-transparent to-wmb-blue/10" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Ikon + titel på bilden */}
                  <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center transition-all duration-500">
                      <active.icon size={26} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{active.title}</h3>
                  </div>

                  {/* Progress */}
                  <div className="absolute right-6 top-6 bottom-6 w-1 bg-white/10 rounded-full z-20">
                    <div
                      className="w-full bg-white/60 rounded-full transition-all duration-500"
                      style={{ height: `${((activeIndex + 1) / services.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Höger — scrollande text-sektioner */}
            <div className="lg:pl-12">
              {services.map((service, i) => (
                <div
                  key={service.title}
                  ref={(el) => { sectionRefs.current[i] = el }}
                  className="min-h-[70vh] flex items-center py-16"
                >
                  <div
                    className="transition-all duration-500"
                    style={{
                      opacity: i === activeIndex ? 1 : 0.3,
                      transform: i === activeIndex ? 'translateY(0)' : 'translateY(20px)',
                    }}
                  >
                    {/* Mobil: visa bild */}
                    <div className="lg:hidden relative h-48 rounded-2xl overflow-hidden mb-6">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800">
                          <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/10 via-transparent to-wmb-blue/10" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
                          </div>
                        </div>
                      )}
                      <span className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: '#d6190c' }} />
                      <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: '#0d237d' }} />
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-xl flex items-center justify-center">
                        <service.icon size={26} />
                      </div>
                      <span className="text-xs font-semibold text-wmb-blue uppercase tracking-wider">
                        {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                      {service.title}
                    </h3>

                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 text-base">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </WithSkeleton>
  )
}
