import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-white p-5 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
