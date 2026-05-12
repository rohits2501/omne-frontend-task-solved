import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface SelectProps<T extends string = string> {
  value: T | null
  onValueChange: (value: T | null) => void
  options: ReadonlyArray<SelectOption<T>>
  placeholder?: string
  className?: string
  triggerLabel?: ReactNode
  invalid?: boolean
  disabled?: boolean
  id?: string
  ariaLabel?: string
}

export function Select<T extends string = string>({
  value,
  onValueChange,
  options,
  placeholder = 'Select…',
  className,
  triggerLabel,
  invalid,
  disabled,
  id,
  ariaLabel,
}: SelectProps<T>) {
  return (
    <BaseSelect.Root<T> value={value} onValueChange={onValueChange} disabled={disabled}>
      <BaseSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          'inline-flex h-10 items-center justify-between gap-2 rounded-md border bg-surface px-3 text-sm',
          'text-foreground placeholder:text-foreground-subtle',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent',
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          'min-w-[140px]',
          invalid ? 'border-danger-400 bg-danger-50' : 'border-border',
          className,
        )}
      >
        <BaseSelect.Value className={cn('truncate text-left', !value && 'text-foreground-muted')}>
          {triggerLabel ??
            (value ? (options.find((opt) => opt.value === value)?.label ?? value) : placeholder)}
        </BaseSelect.Value>
        <BaseSelect.Icon>
          <ChevronDown className="h-4 w-4 text-foreground-muted" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} className="z-50">
          <BaseSelect.Popup
            className={cn(
              'min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-border',
              'bg-surface shadow-md',
              'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
              'transition-opacity duration-100',
            )}
          >
            <BaseSelect.List className="max-h-[18rem] overflow-y-auto py-1">
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm',
                    'text-foreground outline-none',
                    'data-[highlighted]:bg-surface-raised data-[selected]:font-medium',
                  )}
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator>
                    <Check className="h-4 w-4 text-primary-600" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
