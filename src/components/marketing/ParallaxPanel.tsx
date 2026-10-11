import type { HTMLAttributes, PointerEvent, ReactNode } from 'react'

type ParallaxPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  amount?: number
}

export function ParallaxPanel({
  amount = 8,
  children,
  className = '',
  onPointerMove,
  onPointerLeave,
  ...props
}: ParallaxPanelProps) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event)
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--pointer-x', `${x * amount}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${y * amount}px`)
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty('--pointer-x', '0px')
    event.currentTarget.style.setProperty('--pointer-y', '0px')
    onPointerLeave?.(event)
  }

  return (
    <div
      className={`parallax-panel ${className}`}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      {...props}
    >
      {children}
    </div>
  )
}
