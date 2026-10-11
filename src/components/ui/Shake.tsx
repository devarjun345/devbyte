import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type ShakeProps = {
  children: ReactNode
  trigger: number
  intensity?: number
  duration?: number
}

export function Shake({ children, trigger, intensity = 8, duration = 0.15 }: ShakeProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={reduceMotion ? {} : { x: [0, -intensity, intensity, -intensity, intensity, 0] }}
      transition={reduceMotion ? { duration: 0 } : { duration, ease: 'easeInOut' }}
      key={trigger}
    >
      {children}
    </motion.div>
  )
}