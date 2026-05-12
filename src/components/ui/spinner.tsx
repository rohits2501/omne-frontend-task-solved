import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const SIZE_CLASS = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
} as const

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span role="status" className={cn('inline-flex items-center', className)}>
      <Loader2 className={cn('animate-spin text-foreground-muted', SIZE_CLASS[size])} />
      <span className="sr-only">{label}</span>
    </span>
  )
}
