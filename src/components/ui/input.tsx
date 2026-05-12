import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border bg-surface px-3 text-sm text-foreground',
        'placeholder:text-foreground-subtle',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-danger-400 bg-danger-50' : 'border-border',
        className,
      )}
      {...props}
    />
  )
})
