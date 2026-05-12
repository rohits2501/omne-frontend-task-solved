import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, children, className }: PageHeaderProps) {
  return (
    <div className={cn('border-b border-border bg-surface px-6 py-5 sm:px-8', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-foreground-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  )
}
