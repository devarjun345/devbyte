import type { HTMLAttributes, ReactNode } from 'react'

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function PageContainer({
  children,
  className = '',
  ...props
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
