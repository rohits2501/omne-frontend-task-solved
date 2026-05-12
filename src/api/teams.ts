import { apiFetch } from './client'

export interface Team {
  id: string
  name: string
  memberCount: number
}

export function fetchTeams(signal?: AbortSignal): Promise<Team[]> {
  return apiFetch<Team[]>('/api/teams', { signal })
}
