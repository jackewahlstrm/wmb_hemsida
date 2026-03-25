'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-wmb-blue-dark text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/wmb_logo_real.webp"
                alt="Wahlströms Måleri & Bygg"
                width={200}
                height={70}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Professionellt måleri och byggarbete med kvalitet i fokus. Vi har lång erfarenhet av både privata och kommersiella projekt.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Snabblänkar</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Hem' },
                { href: '/tjanster', label: 'Tjänster' },
                { href: '/projekt', label: 'Projekt' },
                { href: '/om-oss', label: 'Om oss' },
                { href: '/kontakt', label: 'Kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-wmb-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tjänster</h3>
            <ul className="space-y-2">
              {['Invändig målning', 'Utvändig målning', 'Spackling', 'Tapetsering', 'Fasadrenovering'].map((service) => (
                <li key={service}>
                  <span className="text-sm text-zinc-400">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-wmb-blue shrink-0" />
                <a href="tel:+46707358181" className="text-sm text-zinc-400 hover:text-wmb-red transition-colors">
                  0707358181
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-wmb-blue shrink-0" />
                <a href="mailto:Tomas.wmb@telia.com" className="text-sm text-zinc-400 hover:text-wmb-red transition-colors">
                  Tomas.wmb@telia.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-wmb-blue shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-400">
                  Stockholm, Sverige
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Wahlströms Måleri & Bygg. Alla rättigheter förbehållna.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/kontakt" className="text-sm text-zinc-500 hover:text-wmb-red transition-colors">
              Integritetspolicy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
