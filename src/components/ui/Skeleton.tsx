import { useReducedMotion } from 'motion/react'
import type { HTMLAttributes } from 'react'

const skeletonBase = 'bg-light-gray rounded'

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  variant = 'rectangular',
  width = '100%',
  height = '16px',
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const reduceMotion = useReducedMotion()

  const variants = {
    text: `${skeletonBase} h-4`,
    circular: `${skeletonBase} rounded-full`,
    rectangular: skeletonBase,
  }

  const animations = {
    pulse: reduceMotion ? '' : 'animate-[pulse_1.5s_ease-in-out_infinite]',
    wave: reduceMotion ? '' : 'animate-[wave_1.2s_ease-in-out_infinite] bg-gradient-to-r from-light-gray via-border to-light-gray bg-[length:200%_100%]',
    none: '',
  }

  return (
    <div
      className={`${variants[variant]} ${animations[animation]} ${className}`}
      style={{ width, height, ...style } as React.CSSProperties}
      aria-hidden="true"
      {...props}
    />
  )
}

export function CardSkeleton({ className = '', hasImage = false, lines = 3 }: { className?: string; hasImage?: boolean; lines?: number }) {
  return (
    <div className={`rounded-xl border border-border bg-white p-5 sm:p-6 ${className}`} aria-busy="true" aria-label="Loading card">
      {hasImage && (
        <Skeleton width="100%" height="160px" variant="rectangular" className="mb-4 -mx-5 -mt-5 rounded-t-xl" />
      )}
      <Skeleton variant="circular" width="40px" height="40px" className="mb-3" />
      <Skeleton width="60%" height="24px" className="mb-2" />
      <Skeleton width="40%" height="16px" className="mb-4" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} width={i === lines - 1 ? '70%' : '100%'} height="12px" />
        ))}
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 4, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid gap-4 ${className}`} aria-busy="true" aria-label="Loading list">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function MetricCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`min-h-[150px] rounded-xl border border-border bg-white p-5 ${className}`} aria-busy="true" aria-label="Loading metric">
      <div className="flex items-center justify-between gap-2 mb-3">
        <Skeleton variant="circular" width="30px" height="30px" />
        <Skeleton width="40px" height="12px" />
      </div>
      <Skeleton width="80px" height="32px" className="mb-2" />
      <Skeleton width="100px" height="16px" className="mb-2" />
      <Skeleton width="60px" height="12px" />
    </div>
  )
}

export function TableRowSkeleton({ columns = 4, className = '' }: { columns?: number; className?: string }) {
  return (
    <div className={`grid gap-4 ${className}`} aria-busy="true" role="row">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} width="100%" height="16px" />
      ))}
    </div>
  )
}