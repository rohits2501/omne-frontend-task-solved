import type { LucideIcon } from 'lucide-react'
import { User } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  message?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = User,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-border bg-surface px-6 py-16 text-center',
        className,
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-raised">
        <Icon className="h-10 w-10 text-foreground-subtle" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {message ? <p className="mt-1 max-w-sm text-sm text-foreground-muted">{message}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
