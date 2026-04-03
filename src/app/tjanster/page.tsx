'use client'

import { Paintbrush, Home, Building2, Layers, Wallpaper, Hammer, SprayCan, Ruler, Wrench } from 'lucide-react'
import WithSkeleton from '@/components/WithSkeleton'
import { ServicesSkeleton } from '@/components/PageSkeleton'

const services = [
  {
    icon: Paintbrush,
    title: 'Invändig målning',
    description: 'Professionell invändig målning av väggar, tak och snickerier. Vi använder högkvalitativa färger för ett hållbart och vackert resultat.',
    features: ['Väggar & tak', 'Snickerier & lister', 'Dörrar & fönster', 'Kök & badrum'],
  },
  {
    icon: Home,
    title: 'Utvändig målning',
    description: 'Skydda och förnya ditt hus med utvändig målning. Vi hanterar alla typer av fasader och väderförhållanden.',
    features: ['Träfasader', 'Putsfasader', 'Fönster & dörrar', 'Altaner & trädäck'],
  },
  {
    icon: Layers,
    title: 'Spackling',
    description: 'Expert på spackling och ytbehandling. Vi skapar perfekt släta ytor inför målning eller tapetsering.',
    features: ['Hållagning', 'Skarvspackling', 'Bredspackling', 'Finspackling'],
  },
  {
    icon: Wallpaper,
    title: 'Tapetsering',
    description: 'Professionell tapetsering med precision och noggrannhet. Vi hjälper dig välja rätt tapet för ditt rum.',
    features: ['Tapetborttagning', 'Uppsättning', 'Mönsterpassning', 'Specialtapeter'],
  },

  {
    icon: Hammer,
    title: 'Byggtjänster',
    description: 'Vi erbjuder kompletterande byggtjänster för att kunna leverera helhetslösningar vid renoveringsprojekt.',
    features: ['Snickeri', 'Golvläggning', 'Kakel & klinker', 'Renoveringar'],
  },
  {
    icon: SprayCan,
    title: 'Lackering',
    description: 'Professionell lackering av möbler, snickerier och andra ytor. Vi ger nytt liv åt slitna möbler.',
    features: ['Möbellackering', 'Snickerilackering', 'Betsning', 'Oljning'],
  },
  {
    icon: Ruler,
    title: 'Färgsättning & rådgivning',
    description: 'Osäker på vilken färg du ska välja? Vi hjälper dig med professionell färgsättning och materialval.',
    features: ['Färgkonsultation', 'Materialrådgivning', 'NCS-färger', 'Provmålning'],
  },
  {
    icon: Wrench,
    title: 'Underhåll',
    description: 'Regelbundet underhåll av fastigheter för att bevara värdet och utseendet på din bostad eller lokal.',
    features: ['Löpande underhåll', 'Serviceavtal', 'Akutinsatser', 'Besiktning'],
  },
]

function ServiceCard({ service, large = false }: { service: typeof services[number]; large?: boolean }) {
  return (
    <div
      className={`group p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-1 ${
        large ? 'flex flex-col sm:flex-row sm:items-center gap-8' : ''
      }`}
    >
      <div className={`shrink-0 ${large ? 'sm:pl-4' : ''}`}>
        <div className={`${large ? 'w-20 h-20' : 'w-14 h-14'} bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-xl flex items-center justify-center mb-6 ${large ? 'sm:mb-0' : ''} group-hover:scale-110 transition-transform`}>
          <service.icon size={large ? 36 : 28} />
        </div>
      </div>

      <div className="flex-1">
        <h3 className={`${large ? 'text-2xl' : 'text-xl'} font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-wmb-red transition-colors`}>
          {service.title}
        </h3>
        <p className={`text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 ${large ? 'text-base' : 'text-sm'}`}>
          {service.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {service.features.map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TjansterPage() {
  const rows: { large: typeof services[number]; small: typeof services[number][] }[] = []
  let i = 0
  while (i < services.length) {
    const large = services[i]
    const small = services.slice(i + 1, i + 3)
    rows.push({ large, small })
    i += 1 + small.length
  }

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

      {/* Services Alternating */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {rows.map((row, idx) => (
            <div key={idx} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${idx % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
              {/* Stor tjänst */}
              <ServiceCard service={row.large} large />

              {/* Två små tjänster staplade */}
              <div className="grid grid-cols-1 gap-8">
                {row.small.map((service) => (
                  <ServiceCard key={service.title} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </WithSkeleton>
  )
}
