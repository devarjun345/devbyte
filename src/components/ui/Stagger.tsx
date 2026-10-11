import { motion, useReducedMotion } from 'motion/react'
import React, { type ReactNode, type ReactElement } from 'react'

type StaggerContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  staggerMs?: number
  viewportOnce?: boolean
  viewportAmount?: number
}

export function StaggerContainer({
  children,
  staggerMs = 60,
  viewportOnce = true,
  viewportAmount = 0.15,
  className = '',
  style,
  ...props
}: StaggerContainerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={className} style={style} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child as ReactElement<any>, {
          staggerIndex: index,
          staggerMs: reduceMotion ? 0 : staggerMs,
          viewportOnce,
          viewportAmount,
        })
      })}
    </div>
  )
}

type AllowedProps = {
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
  'data-testid'?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>
  onFocus?: React.FocusEventHandler<HTMLElement>
  onBlur?: React.FocusEventHandler<HTMLElement>
  role?: string
  tabIndex?: number
}

type StaggerItemProps = AllowedProps & {
  staggerIndex?: number
  staggerMs?: number
  viewportOnce?: boolean
  viewportAmount?: number
  initialY?: number
  duration?: number
}

function extractMotionProps(props: StaggerItemProps): AllowedProps {
  const { staggerIndex: _staggerIndex, staggerMs: _staggerMs, viewportOnce: _viewportOnce, viewportAmount: _viewportAmount, initialY: _initialY, duration: _duration, ...rest } = props
  return rest
}

export function StaggerItem({
  children,
  staggerIndex = 0,
  staggerMs = 60,
  viewportOnce = true,
  viewportAmount = 0.15,
  initialY = 12,
  duration = 0.28,
  className = '',
  ...props
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion()
  const motionProps = extractMotionProps({ ...props, staggerIndex, staggerMs, viewportOnce, viewportAmount, initialY, duration, className })

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: initialY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : duration, delay: staggerIndex * (staggerMs / 1000), ease: [0.22, 1, 0.36, 1] }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewportOnce, amount: viewportAmount }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItemArticle({
  children,
  staggerIndex = 0,
  staggerMs = 60,
  viewportOnce = true,
  viewportAmount = 0.15,
  initialY = 12,
  duration = 0.28,
  className = '',
  ...props
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion()
  const motionProps = extractMotionProps({ ...props, staggerIndex, staggerMs, viewportOnce, viewportAmount, initialY, duration, className })

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: initialY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : duration, delay: staggerIndex * (staggerMs / 1000), ease: [0.22, 1, 0.36, 1] }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewportOnce, amount: viewportAmount }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.article>
  )
}