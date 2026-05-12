import { createContext, type ReactNode, useContext, useMemo } from 'react'

/** Mock has no auth — `user-1` is hardcoded. See DECISIONS.md "Tradeoffs". */

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
