import type { LucideIcon } from 'lucide-react'
import { Activity, Home, Settings, Users } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  exact?: boolean
  /**
   * Per-Link override for the router's `defaultPreload: 'intent'`. Set to
   * `false` for routes whose data changes often (Feed, My Updates) so a
   * pointer brushing the sidebar doesn't fire a refetch the user never asked
   * for. See DECISIONS.md for the rationale.
   */
  preload?: 'intent' | false
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Feed', icon: Home, exact: true, preload: false },
  { to: '/my-updates', label: 'My Updates', icon: Activity, preload: false },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]
