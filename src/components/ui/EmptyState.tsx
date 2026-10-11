import type { ReactNode } from 'react'

type EmptyStateProps = {
  action?: ReactNode
  description: string
  title: string
}

export function EmptyState({
  action,
  description,
  title,
}: EmptyStateProps) {
  return (
    <section
      aria-label={title}
      className="rounded-xl border border-dashed border-border bg-white px-5 py-8 text-center sm:px-8"
    >
      <h2 className="text-lg font-semibold text-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-secondary-text">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </section>
  )
}
