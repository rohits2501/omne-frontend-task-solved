import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'flex w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground',
        'placeholder:text-foreground-subtle resize-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-danger-400 bg-danger-50' : 'border-border',
        className,
      )}
      {...props}
    />
  )
})
