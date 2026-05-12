import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  fetchStatus,
  fetchStatusList,
  type StatusListParams,
  type StatusListResponse,
  type StatusUpdate,
} from '../api/statuses'
import { statusKeys } from './status-keys'

/**
 * Shared query options. Routes use these via `ensureQueryData` to warm the
 * cache on hover (the router has `defaultPreload: 'intent'`), and the hooks
 * below use the same shape so the loader and the component agree on key + fn.
 */
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
