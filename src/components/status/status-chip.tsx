import { tv, type VariantProps } from 'tailwind-variants'
import { STATUS_LABELS, type StatusValue } from '../../api/statuses'
import { cn } from '../../lib/cn'

export const statusChipVariants = tv({
  base: 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
  variants: {
    status: {
      on_track: 'bg-success-100 text-success-800',
      blocked: 'bg-danger-100 text-danger-700',
      needs_review: 'bg-warning-100 text-warning-800',
      done: 'bg-primary-100 text-primary-800',
    },
  },
})

export type StatusChipVariants = VariantProps<typeof statusChipVariants>

export interface StatusChipProps {
  status: StatusValue
  className?: string
}

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span className={cn(statusChipVariants({ status }), className)}>{STATUS_LABELS[status]}</span>
  )
}
