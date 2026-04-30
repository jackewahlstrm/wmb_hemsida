'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    try {
      localStorage.removeItem('wmb-theme')
    } catch {
      // ignore
    }
  }, [])

  return <>{children}</>
}

export function useTheme() {
  return { theme: 'light' as const, toggleTheme: () => {} }
}
