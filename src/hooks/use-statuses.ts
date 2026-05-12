import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  fetchStatus,
  fetchStatusList,
  type StatusListParams,
  type StatusListResponse,
  type StatusUpdate,
} from '../api/statuses'
import { statusKeys } from './status-keys'

/** Shared queryOptions — used by route loaders (`ensureQueryData`) and component hooks. */
export const statusListQueryOptions = (params: StatusListParams) =>
  queryOptions<StatusListResponse>({
    queryKey: statusKeys.list(params),
    queryFn: ({ signal }) => fetchStatusList(params, signal),
  })

export const statusDetailQueryOptions = (id: string) =>
  queryOptions<StatusUpdate>({
    queryKey: statusKeys.detail(id),
    queryFn: ({ signal }) => fetchStatus(id, signal),
  })

export function useStatusList(params: StatusListParams) {
  return useQuery({
    ...statusListQueryOptions(params),
    placeholderData: (prev) => prev,
  })
}

export function useStatus(id: string | undefined) {
  return useQuery({
    ...statusDetailQueryOptions(id ?? '__noop'),
    enabled: Boolean(id),
  })
}
