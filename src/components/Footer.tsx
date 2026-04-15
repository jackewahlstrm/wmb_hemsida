'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getContactInfo, telHref, mailHref, formatPhone, DEFAULT_CONTACT, type ContactInfo } from '@/lib/contact'

export default function Footer() {
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT)

  useEffect(() => {
    getContactInfo().then(setContact)
  }, [])

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
                className="h-16 w-auto rounded-md"
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
                <a href={telHref(contact.phone)} className="text-sm text-zinc-400 hover:text-wmb-red transition-colors">
                  {formatPhone(contact.phone)}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-wmb-blue shrink-0" />
                <a href={mailHref(contact.email)} className="text-sm text-zinc-400 hover:text-wmb-red transition-colors">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-wmb-blue shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-400">
                  {contact.address}
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
