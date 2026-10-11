import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Badge, Button, Card } from '../ui'

export function FeaturePage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  actions?: ReactNode
  children: ReactNode
  description: string
  eyebrow: string
  title: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="feature-page"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="feature-page-heading">
        <div>
          <p className="feature-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="feature-lede">{description}</p>
        </div>
        {actions && <div className="feature-heading-actions">{actions}</div>}
      </header>
      <p className="feature-demo-note">
        <span aria-hidden="true">PREVIEW</span>
        Demo content only · no live accounts, availability, or requests are connected.
      </p>
      {children}
    </motion.div>
  )
}

export function FeatureTag({ children }: { children: ReactNode }) {
  return <Badge className="feature-tag">{children}</Badge>
}

export function FeatureBackLink({ to, children = 'Back' }: { children?: ReactNode; to: string }) {
  return (
    <Link className="feature-back-link" to={to}>
      <span aria-hidden="true">←</span> {children}
    </Link>
  )
}

export function EmptyResults({
  title,
  description,
  onReset,
}: {
  description: string
  onReset?: () => void
  title: string
}) {
  return (
    <Card className="feature-empty">
      <span aria-hidden="true" className="feature-empty-mark">⌕</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {onReset && (
        <Button onClick={onReset} variant="outline">
          Clear filters
        </Button>
      )}
    </Card>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  trailing,
}: {
  eyebrow?: string
  title: string
  trailing?: ReactNode
}) {
  return (
    <div className="feature-section-title">
      <div>
        {eyebrow && <p className="feature-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {trailing}
    </div>
  )
}

export function StatusNotice({
  children,
  title = 'Local preview only',
}: {
  children: ReactNode
  title?: string
}) {
  return (
    <div className="feature-status-notice" role="status">
      <span aria-hidden="true">✓</span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  )
}

export { CodeWorkspace } from './CodeWorkspace'
