'use client'

import { useState, useEffect, ReactNode } from 'react'

export default function WithSkeleton({
  skeleton,
  children,
  delay = 0,
}: {
  skeleton: ReactNode
  children: ReactNode
  delay?: number
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (loading) return <>{skeleton}</>
  return <>{children}</>
}
