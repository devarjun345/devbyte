import { useId, type InputHTMLAttributes } from 'react'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  error?: string
  helperText?: string
  id?: string
  label: string
}

export function Input({
  className = '',
  error,
  helperText,
  id,
  label,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-description`
  const message = error ?? helperText

  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-black" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={message ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
        className={`min-h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-black outline-none transition-colors placeholder:text-secondary-text/80 hover:border-deep-olive focus-visible:border-deep-olive focus-visible:ring-2 focus-visible:ring-sage-green/40 disabled:cursor-not-allowed disabled:bg-light-gray disabled:text-secondary-text ${error ? 'border-error focus-visible:border-error focus-visible:ring-error/30' : ''} ${className}`}
        id={inputId}
        {...props}
      />
      {message && (
        <p
          className={`text-sm ${error ? 'text-error' : 'text-secondary-text'}`}
          id={descriptionId}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  )
}
