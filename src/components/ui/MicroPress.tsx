import { motion, useReducedMotion } from 'motion/react'
import React, { type ReactNode, type ReactElement } from 'react'

type MicroPressProps = {
  children: ReactNode
  scale?: number
  disabled?: boolean
  asChild?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  style?: React.CSSProperties
  'aria-label'?: string
  'aria-pressed'?: boolean
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-hidden'?: boolean
  id?: string
  role?: string
  tabIndex?: number
  type?: 'button' | 'submit' | 'reset'
}

export function MicroPress({
  children,
  scale = 0.98,
  disabled = false,
  asChild = false,
  className = '',
  onClick,
  style,
  ...props
}: MicroPressProps) {
  const reduceMotion = useReducedMotion()

  const tapTransition = reduceMotion
    ? undefined
    : { scale, transition: { type: 'spring' as const, stiffness: 400, damping: 17 } }

  const hoverTransition = reduceMotion
    ? undefined
    : { y: -1, transition: { type: 'spring' as const, stiffness: 400, damping: 17 } }

  const baseProps = {
    className,
    style,
    onClick: disabled ? undefined : onClick,
    ...props,
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as ReactElement<any>, {
      whileTap: tapTransition,
      whileHover: disabled ? undefined : hoverTransition,
      ...baseProps,
    })
  }

  return (
    <motion.div
      whileTap={disabled ? undefined : tapTransition}
      whileHover={disabled ? undefined : hoverTransition}
      {...baseProps}
    >
      {children}
    </motion.div>
  )
}

export function MicroPressCard({
  children,
  disabled = false,
  className = '',
  onClick,
  style,
  ...props
}: MicroPressProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.99 }}
      whileHover={disabled ? undefined : { y: -3, boxShadow: '0 12px 24px rgb(11 15 10 / 8%)', transition: { type: 'spring' as const, stiffness: 400, damping: 17 } }}
      className={className}
      style={style}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </motion.article>
  )
}

export function MicroPressButton({
  children,
  disabled = false,
  className = '',
  onClick,
  style,
  ...props
}: MicroPressProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.98 }}
      whileHover={disabled ? undefined : { scale: 1.01, transition: { type: 'spring' as const, stiffness: 400, damping: 17 } }}
      className={className}
      style={style}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}