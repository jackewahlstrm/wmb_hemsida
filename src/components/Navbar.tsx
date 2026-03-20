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
  { href: '/kontakt', label: 'Kontakt' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-26 py-2 sm:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/wmb_logo_real.webp"
              alt="Wahlströms Måleri & Bygg"
              width={220}
              height={72}
              className="h-14 sm:h-18 w-auto dark:hidden"
              priority
            />
            <Image
              src="/wmb_logo_dark.webp"
              alt="Wahlströms Måleri & Bygg"
              width={220}
              height={72}
              className="h-14 sm:h-18 w-auto hidden dark:block"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-wmb-red dark:hover:text-wmb-red rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Byt tema"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* CTA button */}
            <Link
              href="/kontakt"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-wmb-red hover:bg-wmb-red/90 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Kontakta oss
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Meny"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-zinc-600 dark:text-zinc-300 hover:text-wmb-red dark:hover:text-wmb-red rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 mt-2 text-center bg-wmb-red hover:bg-wmb-red/90 text-white font-medium rounded-lg transition-colors"
            >
              Kontakta oss
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
