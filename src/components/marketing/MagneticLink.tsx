import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import type { ComponentProps, PointerEvent } from 'react'
import { Link } from 'react-router'

type MagneticLinkProps = ComponentProps<typeof Link> & {
  strength?: number
}

export function MagneticLink({
  children,
  className = '',
  strength = 0.12,
  ...props
}: MagneticLinkProps) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.24 })
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.24 })

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength)
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength)
  }

  function resetPosition() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className="inline-flex"
      onPointerLeave={resetPosition}
      onPointerMove={handlePointerMove}
      style={{ x: springX, y: springY }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      <Link className={className} {...props}>
        {children}
      </Link>
    </motion.div>
  )
}
