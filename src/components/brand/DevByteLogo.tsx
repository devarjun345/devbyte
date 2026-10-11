import { motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'

type LogoVariant = 'light' | 'dark' | 'monochrome'

type DevByteLogoProps = {
  animated?: boolean
  className?: string
  showWordmark?: boolean
  size?: number
  variant?: LogoVariant
}

const colors: Record<LogoVariant, { bracket: string; d: string; b: string; word: string }> = {
  light: {
    bracket: '#3F5128',
    d: '#3F5128',
    b: '#A7C957',
    word: '#0B0F0A',
  },
  dark: {
    bracket: '#A7C957',
    d: '#FAFAF8',
    b: '#A7C957',
    word: '#FAFAF8',
  },
  monochrome: {
    bracket: '#0B0F0A',
    d: '#0B0F0A',
    b: '#0B0F0A',
    word: '#0B0F0A',
  },
}

export function DevByteLogo({
  animated = false,
  className = '',
  showWordmark = true,
  size = 42,
  variant = 'light',
}: DevByteLogoProps) {
  const reduceMotion = useReducedMotion()
  const sweepId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const palette = colors[variant]
  const playReveal = animated && !reduceMotion

  return (
    <span
      aria-hidden="true"
      className={`devbyte-logo devbyte-logo-${variant} ${className}`}
    >
      <svg
        className="devbyte-logo-mark"
        fill="none"
        height={size}
        role="presentation"
        viewBox="0 0 64 64"
        width={size}
      >
        <defs>
          <clipPath id={`devbyte-sweep-${sweepId}`}>
            <rect height="54" rx="10" width="58" x="3" y="5" />
          </clipPath>
        </defs>
        <motion.path
          animate={playReveal ? { opacity: 1, x: 0 } : undefined}
          d="m11 18-6 14 6 14"
          initial={playReveal ? { opacity: 0, x: -10 } : false}
          stroke={palette.bracket}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
          transition={{ type: 'spring', stiffness: 220, damping: 23, delay: 0.02 }}
        />
        <motion.path
          animate={playReveal ? { opacity: 1, x: 0 } : undefined}
          d="M53 18l6 14-6 14"
          initial={playReveal ? { opacity: 0, x: 10 } : false}
          stroke={palette.bracket}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
          transition={{ type: 'spring', stiffness: 220, damping: 23, delay: 0.02 }}
        />
        <motion.path
          animate={playReveal ? { opacity: 1, pathLength: 1 } : undefined}
          d="M17 17h9a15 15 0 0 1 0 30h-9z"
          initial={playReveal ? { opacity: 0, pathLength: 0 } : false}
          stroke={palette.d}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.5"
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        />
        <motion.path
          animate={playReveal ? { opacity: 1, pathLength: 1 } : undefined}
          d="M29 17h8a8 8 0 0 1 0 16h-8m8 0a9 9 0 0 1 0 14h-8V17"
          initial={playReveal ? { opacity: 0, pathLength: 0 } : false}
          stroke={palette.b}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.5"
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
        {playReveal && (
          <motion.rect
            animate={{ x: 63, opacity: [0, 0.42, 0] }}
            clipPath={`url(#devbyte-sweep-${sweepId})`}
            fill="#A7C957"
            height="54"
            initial={{ x: -11, opacity: 0 }}
            rx="3"
            transition={{ duration: 0.45, delay: 0.56, ease: 'easeInOut' }}
            width="8"
            y="5"
          />
        )}
      </svg>
      {showWordmark && (
        <motion.span
          animate={playReveal ? { opacity: 1, x: 0 } : undefined}
          className="devbyte-logo-wordmark"
          initial={playReveal ? { opacity: 0, x: -6 } : false}
          style={{ color: palette.word }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1], delay: 0.62 }}
        >
          DEV BYTE
        </motion.span>
      )}
    </span>
  )
}
