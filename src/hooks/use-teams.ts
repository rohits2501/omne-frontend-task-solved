import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchTeams, type Team } from '../api/teams'
import { teamKeys } from './status-keys'

export const teamsQueryOptions = () =>
  queryOptions<Team[]>({
    queryKey: teamKeys.list(),
    queryFn: ({ signal }) => fetchTeams(signal),
    staleTime: 1000 * 60 * 5,
  })

export function useTeams() {
  return useQuery(teamsQueryOptions())
}
