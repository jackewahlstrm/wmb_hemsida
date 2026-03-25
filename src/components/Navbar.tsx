'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const navLinks = [
  { href: '/', label: 'Hem' },
  { href: '/tjanster', label: 'Tjänster' },
  { href: '/projekt', label: 'Projekt' },
  { href: '/om-oss', label: 'Om oss' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-wmb-red border-b border-red-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-26 py-2 sm:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/wmb_logo_real.webp"
              alt="Wahlströms Måleri & Bygg"
              width={220}
              height={72}
              className="h-14 sm:h-18 w-auto rounded-lg"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-base font-medium text-white overflow-hidden rounded-lg transition-all duration-300 hover:scale-110 group"
              >
                <span className="absolute inset-x-0 top-0 h-1.5 z-20 rounded-t-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: '#d6190c' }} />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white dark:bg-zinc-100 rounded-lg transition-opacity duration-300" />
                <span className="absolute inset-x-0 bottom-0 h-1.5 z-20 rounded-b-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" style={{ backgroundColor: '#0d237d' }} />
                <span className="relative z-10 group-hover:text-zinc-900">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              aria-label="Byt tema"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* CTA button */}
            <Link
              href="/kontakt"
              className="hidden md:inline-flex items-center relative px-5 py-2.5 bg-white text-wmb-red text-sm font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-110 group/cta"
            >
              <span className="absolute inset-x-0 top-0 h-1.5 z-20 rounded-t-lg scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: '#d6190c' }} />
              <span className="absolute inset-x-0 bottom-0 h-1.5 z-20 rounded-b-lg scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-300 origin-right" style={{ backgroundColor: '#0d237d' }} />
              <span className="relative z-10">Kontakta oss</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              aria-label="Meny"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-red-700/30 bg-wmb-red">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-white hover:bg-white/20 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 mt-2 text-center bg-white text-wmb-red font-medium rounded-lg hover:bg-white/90 transition-colors"
            >
              Kontakta oss
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
