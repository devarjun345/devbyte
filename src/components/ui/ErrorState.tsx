import { useId, type ReactNode } from 'react'
import { Button } from './Button'

type ErrorStateProps = {
  action?: ReactNode
  actionLabel?: string
  description: string
  onAction?: () => void
  title?: string
}

export function ErrorState({
  action,
  actionLabel = 'Try again',
  description,
  onAction,
  title = 'Something went wrong',
}: ErrorStateProps) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-xl border border-error/30 bg-white px-5 py-8 text-center sm:px-8"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-black" id={titleId}>
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-secondary-text">
        {description}
      </p>
      {action ??
        (onAction && (
          <div className="mt-5">
            <Button onClick={onAction} variant="secondary">
              {actionLabel}
            </Button>
          </div>
        ))}
    </section>
  )
}
