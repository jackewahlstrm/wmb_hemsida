'use client'

import { useState, useEffect } from 'react'
import Skeleton from '@mui/material/Skeleton'
import RotatingText from './RotatingText'

export default function HeroHeading() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 0)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="mb-6">
        <Skeleton variant="rounded" height={56} width="90%" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1, borderRadius: '8px' }} />
        <Skeleton variant="rounded" height={56} width="75%" sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
      </div>
    )
  }

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 inline-flex flex-col items-center">
      <span className="text-white whitespace-nowrap px-2 w-full text-center" style={{ backgroundColor: '#d6190c' }}>Måleri med fokus på</span>
      <RotatingText
        texts={['precision i varje drag', 'passion i varje detalj', 'kvalitet i varje lager', 'perfektion i varje yta']}
        mainClassName="text-white px-2 w-full text-center bg-[#0d237d]"
        rotationInterval={5000}
        staggerDuration={0.03}
        staggerFrom="first"
      />
    </h1>
  )
}
