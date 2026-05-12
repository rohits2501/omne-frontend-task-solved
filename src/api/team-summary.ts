import { apiFetch } from './client'
import type { StatusValue } from './statuses'

export interface TeamMemberSummary {
  id: string
  name: string
  teamName: string
  lastUpdate: string | null
  lastStatus: StatusValue | null
}

export interface TeamSummary {
  totalUpdatesThisWeek: number
  onTrackCount: number
  blockedCount: number
  needsReviewCount: number
  members: TeamMemberSummary[]
}

export function fetchTeamSummary(signal?: AbortSignal): Promise<TeamSummary> {
  return apiFetch<TeamSummary>('/api/team-summary', { signal })
}
