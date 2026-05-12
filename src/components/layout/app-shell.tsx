import type { ReactNode } from 'react'
import { MobileTopBar } from './mobile-top-bar'
import { Sidebar } from './sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-surface-raised lg:flex-row">
      <Sidebar />
      <MobileTopBar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
