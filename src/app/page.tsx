import Link from 'next/link'
import { ArrowRight, Star, Users, Briefcase, Shield } from 'lucide-react'

const stats = [
  { icon: Briefcase, value: '500+', label: 'Genomförda projekt' },
  { icon: Users, value: '200+', label: 'Nöjda kunder' },
  { icon: Star, value: '15+', label: 'Års erfarenhet' },
  { icon: Shield, value: '100%', label: 'Kvalitetsgaranti' },
]

const featuredServices = [
  {
    title: 'Invändig målning',
    description: 'Professionell invändig målning för hem och kontor med högkvalitativa färger.',
  },
  {
    title: 'Utvändig målning',
    description: 'Skydda och förnya ditt hus med utvändig målning som håller i alla väder.',
  },
  {
    title: 'Spackling & renovering',
    description: 'Expert på spackling, hållagning och ytbehandling för perfekta väggar.',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-zinc-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/20 border border-amber-600/30 rounded-full text-amber-400 text-sm font-medium mb-8">
            <Star size={14} />
            Stockholms mest pålitliga måleriföretag
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Kvalitetsmåleri med
            <span className="block text-amber-500">precision & passion</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-300 mb-10 leading-relaxed">
            Wahlströms Måleri & Bygg levererar förstklassigt hantverk till privata hem
            och kommersiella fastigheter i hela Stockholmsområdet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/kontakt"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              Begär offert
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/projekt"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
            >
              Se våra projekt
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl mb-3">
                  <stat.icon size={24} />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">Våra tjänster</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Vad vi kan hjälpa dig med
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div
                key={service.title}
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tjanster"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              Se alla tjänster
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Redo att starta ditt projekt?
          </h2>
          <p className="text-lg text-amber-100 mb-10 max-w-2xl mx-auto">
            Kontakta oss idag för en kostnadsfri offert. Vi hjälper dig gärna med allt
            från små uppdrag till stora renoveringsprojekt.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-700 font-semibold rounded-xl hover:bg-zinc-100 transition-all hover:scale-105"
          >
            Kontakta oss
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
