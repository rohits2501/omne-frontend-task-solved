import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface InlineErrorProps {
  message?: string | null
  id?: string
  className?: string
}

export function InlineError({ message, id, className }: InlineErrorProps) {
  if (!message) return null
  return (
    <p
      id={id}
      role="alert"
      className={cn('mt-2 flex items-center gap-1.5 text-sm text-danger-600', className)}
    >
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  )
}
