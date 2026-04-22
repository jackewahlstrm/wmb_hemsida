'use client'

import Link from 'next/link'
import { ArrowRight, Star, Users, Briefcase, Shield, Paintbrush, SprayCan, Droplets } from 'lucide-react'
import HeroHeading from '@/components/HeroHeading'
import HeroSlideshow from '@/components/HeroSlideshow'
import ProjectParallax from '@/components/ProjectParallax'

const stats = [
  { icon: Briefcase, value: '500+', label: 'Genomförda projekt' },
  { icon: Users, value: '200+', label: 'Nöjda kunder' },
  { icon: Star, value: '15+', label: 'Års erfarenhet' },
  { icon: Shield, value: '100%', label: 'Kvalitetsgaranti' },
]

const featuredServices = [
  {
    icon: Paintbrush,
    title: 'Invändig målning',
    description: 'Professionell invändig målning för hem och kontor med högkvalitativa färger.',
    slug: 'invandig-malning',
    image: '/bluehouse_wmb.webp',
  },
  {
    icon: SprayCan,
    title: 'Lackering',
    description: 'Professionell lackering av möbler, snickerier och andra ytor.',
    slug: 'lackering',
    image: null,
  },
  {
    icon: Droplets,
    title: 'Epoxymålning',
    description: 'Tåliga epoxygolv och ytor för garage, industri och kommersiella lokaler.',
    slug: 'epoxymalning',
    image: '/epoxy.jpg',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Slideshow bakgrund */}
        <HeroSlideshow />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-white/10 text-white rounded-xl mb-2">
                  <stat.icon size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center flex flex-col items-center">
            <div>
              <HeroHeading />

              <p className="text-lg text-zinc-300 mb-8 leading-relaxed max-w-lg mx-auto">
                Wahlströms Måleri & Bygg levererar förstklassigt hantverk till privata hem
                och kommersiella fastigheter i hela Stockholmsområdet.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/projekt"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                >
                  Se våra projekt
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-wmb-red hover:bg-wmb-red/90 text-white font-semibold rounded-xl transition-all"
                >
                  Kontakta oss
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Project Parallax */}
      <ProjectParallax />

      {/* Services Preview */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Våra tjänster</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Vad vi kan hjälpa dig med
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <Link
                key={service.title}
                href={`/tjanster?service=${service.slug}`}
                className="group/svc relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Bild */}
                <div className="relative h-52 overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/svc:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800">
                      <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/10 via-transparent to-wmb-blue/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <service.icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{service.title}</h3>
                  </div>
                </div>

                {/* Stripes */}
                <span className="absolute inset-x-0 top-0 h-1.5 z-20 scale-x-0 group-hover/svc:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: '#d6190c' }} />
                <span className="absolute inset-x-0 bottom-0 h-1.5 z-20 scale-x-0 group-hover/svc:scale-x-100 transition-transform duration-300 origin-right" style={{ backgroundColor: '#0d237d' }} />

                {/* Info */}
                <div className="p-5">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tjanster"
              className="group inline-flex items-center gap-2 text-wmb-blue hover:text-wmb-red font-semibold text-sm transition-colors"
            >
              <span className="relative">
                Se alla tjänster
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
