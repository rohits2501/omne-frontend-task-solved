import type { LucideIcon } from 'lucide-react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '../../lib/cn'
import { Card } from '../ui/card'

export const metricIconVariants = tv({
  base: 'flex h-9 w-9 items-center justify-center rounded-md',
  variants: {
    tone: {
      primary: 'bg-primary-50 text-primary-600',
      success: 'bg-success-100 text-success-700',
      danger: 'bg-danger-100 text-danger-600',
      warning: 'bg-warning-100 text-warning-700',
    },
  },
  defaultVariants: { tone: 'primary' },
})

export type MetricIconTone = NonNullable<VariantProps<typeof metricIconVariants>['tone']>

export interface MetricCardProps {
  label: string
  value: number | string
  subLabel?: string
  icon: LucideIcon
  tone?: MetricIconTone
  className?: string
}

export function MetricCard({
  label,
  value,
  subLabel,
  icon: Icon,
  tone = 'primary',
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('px-5 py-4 sm:px-6 sm:py-5 transition-shadow hover:shadow-sm', className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-foreground-muted">{label}</span>
        <span className={metricIconVariants({ tone })}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-foreground">{value}</span>
        {subLabel ? <span className="text-sm text-foreground-muted">{subLabel}</span> : null}
      </div>
    </Card>
  )
}
