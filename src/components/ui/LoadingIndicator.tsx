type LoadingIndicatorProps = {
  label?: string
}

export function LoadingIndicator({
  label = 'Loading',
}: LoadingIndicatorProps) {
  return (
    <div
      aria-label={label}
      className="inline-flex items-center gap-3 text-sm text-secondary-text"
      role="status"
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-deep-olive border-r-transparent"
      />
      <span>{label}</span>
    </div>
  )
}
