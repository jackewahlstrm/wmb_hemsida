'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function CTASection() {
  const pathname = usePathname()

  if (pathname === '/kontakt' || pathname.startsWith('/admin')) return null

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-6">
          Behöver du hjälp med ett projekt?
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
          Kontakta oss för en kostnadsfri offert. Vi anpassar våra tjänster efter dina behov.
        </p>
        <Link
          href="/kontakt"
          className="relative inline-flex items-center gap-2 px-8 py-4 text-zinc-600 dark:text-zinc-200 font-semibold overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-600 transition-all duration-300 hover:scale-105 group" style={{ backgroundColor: '#ffffff' }}
        >
          <span className="absolute inset-x-0 top-0 h-1.5 z-10 rounded-t-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: '#d6190c' }} />
          <span className="absolute inset-x-0 bottom-0 h-1.5 z-10 rounded-b-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" style={{ backgroundColor: '#0d237d' }} />
          <span className="relative z-10">Begär offert</span>
          <ArrowRight size={18} className="relative z-10" />
        </Link>
      </div>
    </section>
  )
}
