import type { ReactNode } from 'react'

type PageHeadingProps = {
  action?: ReactNode
  description?: string
  eyebrow?: string
  title: string
}

export function PageHeading({
  action,
  description,
  eyebrow,
  title,
}: PageHeadingProps) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-deep-olive uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-black sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-7 text-secondary-text">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
