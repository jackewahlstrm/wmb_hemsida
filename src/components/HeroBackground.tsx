'use client'

import { useState, useEffect } from 'react'

export default function HeroBackground() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <img src="/bluehouse_wmb.webp" alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-zinc-900/70" />
    </div>
  )
}
