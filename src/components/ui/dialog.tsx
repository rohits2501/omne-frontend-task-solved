import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md'
}

const SIZE_CLASS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
} as const

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'sm',
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={cn(
            'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
            'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
            'transition-opacity duration-150',
          )}
        />
        <BaseDialog.Popup
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2',
            SIZE_CLASS[size],
            'rounded-lg bg-surface shadow-lg border border-border',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
            'transition-all duration-150',
          )}
        >
          <div className="flex items-start justify-between gap-4 p-6 pb-4">
            <div>
              <BaseDialog.Title className="text-lg font-semibold text-foreground">
                {title}
              </BaseDialog.Title>
              {description ? (
                <BaseDialog.Description className="mt-1 text-sm text-foreground-muted">
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
            <BaseDialog.Close
              aria-label="Close"
              className="rounded-md p-1 text-foreground-muted hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X className="h-4 w-4" />
            </BaseDialog.Close>
          </div>
          <div className="px-6 pb-2 text-sm text-foreground-muted">{children}</div>
          {footer ? (
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-muted mt-4">
              {footer}
            </div>
          ) : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}

export const DialogClose = BaseDialog.Close
