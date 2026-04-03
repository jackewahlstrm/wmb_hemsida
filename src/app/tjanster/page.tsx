'use client'

import { Paintbrush, Home, Building2, Layers, Wallpaper, Hammer, SprayCan, Ruler, Wrench, ClipboardList, Palette, Droplets } from 'lucide-react'
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
  {
    icon: ClipboardList,
    title: 'Projektledning',
    description: 'Vi tar ansvar för hela projektet från start till mål. Planering, samordning och kvalitetssäkring.',
    features: ['Projektplanering', 'Samordning', 'Tidplan', 'Kvalitetskontroll'],
  },
  {
    icon: Palette,
    title: 'Dekorationsmålning',
    description: 'Kreativ och dekorativ målning för unika uttryck. Från marmorering till muralmålning.',
    features: ['Marmorering', 'Muralmålning', 'Schablonmålning', 'Specialeffekter'],
  },
  {
    icon: Droplets,
    title: 'Epoxymålning',
    description: 'Tåliga och hållbara epoxygolv och ytor för garage, industri och kommersiella lokaler.',
    features: ['Garagegolv', 'Industrigolv', 'Våtrum', 'Betongytor'],
  },
]

function ServiceCard({ service, fromRight }: { service: typeof services[number]; fromRight: boolean }) {
  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center gap-6 p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-1 w-full lg:w-[65%] ${
        fromRight ? 'lg:ml-auto' : 'lg:mr-auto'
      }`}
    >
      <div className="shrink-0">
        <div className="w-16 h-16 bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <service.icon size={30} />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-wmb-red transition-colors">
          {service.title}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 text-sm">
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

      {/* Services Alternating Sides */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              fromRight={i % 2 === 1}
            />
          ))}
        </div>
      </section>
    </WithSkeleton>
  )
}
