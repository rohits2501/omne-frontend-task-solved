import { Link } from '@tanstack/react-router'
import { Activity } from 'lucide-react'
import { cn } from '../../lib/cn'
import { NAV_ITEMS } from './nav-items'

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Activity className="h-6 w-6 text-primary-600" aria-hidden />
        <span className="text-lg font-semibold text-foreground">Pulse</span>
      </div>
      <nav className="flex-1 p-3" aria-label="Primary">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  preload={item.preload}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    'text-foreground hover:bg-surface-raised',
                  )}
                  activeProps={{
                    className: 'bg-primary-50 text-primary-700 font-medium hover:bg-primary-50',
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
    </aside>
  )
}
