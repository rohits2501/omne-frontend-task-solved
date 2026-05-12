import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '../../lib/cn'

export const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  variants: {
    variant: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
      secondary:
        'bg-surface text-foreground border border-border hover:bg-surface-raised active:bg-neutral-100',
      ghost: 'text-foreground hover:bg-surface-raised',
      danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800',
      'danger-ghost': 'text-danger-600 hover:bg-danger-50',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-5 text-base',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})
