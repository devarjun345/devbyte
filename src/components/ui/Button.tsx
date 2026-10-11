import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  loading?: boolean
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-deep-olive bg-deep-olive text-white hover:bg-deep-olive/90',
  secondary: 'border border-border bg-white text-black hover:bg-light-gray',
  outline:
    'border border-deep-olive bg-transparent text-deep-olive hover:bg-muted-green',
  ghost:
    'border border-transparent bg-transparent text-secondary-text hover:bg-light-gray hover:text-black',
  destructive: 'border border-error bg-error text-white hover:bg-error/90',
}

export function Button({
  children,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {children}
    </button>
  )
}
