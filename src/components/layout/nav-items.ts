import type { LucideIcon } from 'lucide-react'
import { Activity, Home, Settings, Users } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  exact?: boolean
  /** Override for `defaultPreload: 'intent'`. See DECISIONS.md. */
  preload?: 'intent' | false
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Feed', icon: Home, exact: true, preload: false },
  { to: '/my-updates', label: 'My Updates', icon: Activity, preload: false },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]
