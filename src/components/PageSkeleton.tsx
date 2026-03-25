'use client'

import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'

export function HeroSkeleton() {
  return (
    <Box sx={{ width: '100%', minHeight: '90vh', bgcolor: 'transparent' }} className="relative flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton variant="rounded" width={40} height={40} sx={{ mx: 'auto', mb: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="text" width={80} height={36} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="text" width={100} height={16} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <Skeleton variant="text" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
            <Skeleton variant="text" height={60} width="80%" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />
            <Skeleton variant="text" height={24} width="90%" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }} />
            <Skeleton variant="text" height={24} width="70%" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 4 }} />
            <Skeleton variant="rounded" width={200} height={56} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          </div>
          <Skeleton variant="rounded" height={400} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }} />
        </div>
      </div>
    </Box>
  )
}

export function SectionSkeleton({ cards = 3, withHero = true }: { cards?: number; withHero?: boolean }) {
  return (
    <div>
      {withHero && (
        <div className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Skeleton variant="text" width={120} height={20} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width={400} height={48} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width={500} height={24} sx={{ mx: 'auto' }} />
          </div>
        </div>
      )}

      <div className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(cards)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: '16px', mb: 2 }} />
                <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={18} />
                <Skeleton variant="text" width="75%" height={18} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AboutSkeleton() {
  return (
    <div>
      <div className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={350} height={48} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={450} height={24} sx={{ mx: 'auto' }} />
        </div>
      </div>

      <div className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Skeleton variant="rounded" height={384} sx={{ borderRadius: '16px' }} />
            <div>
              <Skeleton variant="text" width={200} height={36} sx={{ mb: 3 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} width="80%" sx={{ mb: 3 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} width="60%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContactSkeleton() {
  return (
    <div>
      <div className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton variant="text" width={120} height={20} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={350} height={48} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={480} height={24} sx={{ mx: 'auto' }} />
        </div>
      </div>

      <div className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: '8px' }} />
                  <div className="flex-1">
                    <Skeleton variant="text" width={80} height={18} />
                    <Skeleton variant="text" width={150} height={18} />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Skeleton variant="rounded" height={48} sx={{ borderRadius: '12px' }} />
                <Skeleton variant="rounded" height={48} sx={{ borderRadius: '12px' }} />
              </div>
              <Skeleton variant="rounded" height={48} sx={{ borderRadius: '12px' }} />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton variant="rounded" height={48} sx={{ borderRadius: '12px' }} />
                <Skeleton variant="rounded" height={48} sx={{ borderRadius: '12px' }} />
              </div>
              <Skeleton variant="rounded" height={48} sx={{ borderRadius: '12px' }} />
              <Skeleton variant="rounded" height={150} sx={{ borderRadius: '12px' }} />
              <Skeleton variant="rounded" width={200} height={56} sx={{ borderRadius: '12px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ServicesSkeleton() {
  return (
    <div>
      <div className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton variant="text" width={120} height={20} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={350} height={48} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={500} height={24} sx={{ mx: 'auto' }} />
        </div>
      </div>

      <div className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: '16px' }} />
              <div className="grid grid-cols-1 gap-8">
                <Skeleton variant="rounded" height={100} sx={{ borderRadius: '16px' }} />
                <Skeleton variant="rounded" height={100} sx={{ borderRadius: '16px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
