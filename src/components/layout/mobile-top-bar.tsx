import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { Link, useLocation } from '@tanstack/react-router'
import { Activity, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/cn'
import { NAV_ITEMS } from './nav-items'

export function MobileTopBar() {
  const [open, setOpen] = useState(false)
  const pathname = useLocation({ select: (state) => state.pathname })

  // biome-ignore lint/correctness/useExhaustiveDependencies: closes drawer on path change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="lg:hidden flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary-600" aria-hidden />
        <span className="text-base font-semibold text-foreground">Pulse</span>
      </div>
      <BaseDialog.Root open={open} onOpenChange={setOpen}>
        <BaseDialog.Trigger
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <Menu className="h-5 w-5" />
        </BaseDialog.Trigger>
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
              'fixed left-0 top-0 z-50 h-full w-72 max-w-[85vw] bg-surface border-r border-border',
              'data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
              'transition-transform duration-200',
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <BaseDialog.Title className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" aria-hidden />
                <span className="text-base font-semibold text-foreground">Pulse</span>
              </BaseDialog.Title>
              <BaseDialog.Close
                aria-label="Close menu"
                className="rounded-md p-1.5 text-foreground-muted hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <X className="h-5 w-5" />
              </BaseDialog.Close>
            </div>
            <nav className="p-3" aria-label="Primary">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        activeOptions={{ exact: item.exact }}
                        preload={item.preload}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface-raised"
                        activeProps={{
                          className:
                            'bg-primary-50 text-primary-700 font-medium hover:bg-primary-50',
                        }}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </header>
  )
}
