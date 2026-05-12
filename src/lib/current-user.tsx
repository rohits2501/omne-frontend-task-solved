import { createContext, type ReactNode, useContext, useMemo } from 'react'

/**
 * The mock API has no auth, so we hardcode a single "current user".
 * This is the seam where real auth would slot in.
 *
 * Choice of `user-1` (Alex Chen) is deliberate: the seed data assigns
 * this author multiple statuses, so My Updates renders meaningfully on
 * first paint without needing to create one.
 */

export interface CurrentUser {
  id: string
  name: string
  avatar: string
  teamId: string
  teamName: string
}

const HARDCODED_USER: CurrentUser = {
  id: 'user-1',
  name: 'Alex Chen',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
  teamId: 'team-1',
  teamName: 'Platform',
}

const CurrentUserContext = createContext<CurrentUser | null>(null)

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => HARDCODED_USER, [])
  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}

export function useCurrentUser(): CurrentUser {
  const user = useContext(CurrentUserContext)
  if (!user) {
    throw new Error('useCurrentUser must be used inside <CurrentUserProvider>')
  }
  return user
}
