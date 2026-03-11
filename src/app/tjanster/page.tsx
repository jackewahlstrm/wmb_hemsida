import { Paintbrush, Home, Building2, Layers, Wallpaper, Hammer, SprayCan, Ruler, Wrench } from 'lucide-react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
    icon: Building2,
    title: 'Fasadrenovering',
    description: 'Komplett fasadrenovering för att ge ditt hus nytt liv. Vi hanterar allt från rengöring till slutbehandling.',
    features: ['Fasadtvätt', 'Lagning & reparation', 'Ommålning', 'Energieffektivisering'],
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

export default function TjansterPage() {
  return (
    <>
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

      {/* Services Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{service.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-5">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="w-1.5 h-1.5 bg-wmb-red rounded-full shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-6">
            Behöver du hjälp med ett projekt?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10">
            Kontakta oss för en kostnadsfri offert. Vi anpassar våra tjänster efter dina behov.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-wmb-red hover:bg-wmb-red/90 text-white font-semibold rounded-xl transition-all hover:scale-105"
          >
            Begär offert
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
