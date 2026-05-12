import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchTeamSummary, type TeamSummary } from '../api/team-summary'
import { teamSummaryKeys } from './status-keys'

export const teamSummaryQueryOptions = () =>
  queryOptions<TeamSummary>({
    queryKey: teamSummaryKeys.summary(),
    queryFn: ({ signal }) => fetchTeamSummary(signal),
  })

export function useTeamSummary() {
  return useQuery(teamSummaryQueryOptions())
}
