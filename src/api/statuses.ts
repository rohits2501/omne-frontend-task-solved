import { apiFetch } from './client'

export const STATUS_VALUES = ['on_track', 'blocked', 'needs_review', 'done'] as const

export type StatusValue = (typeof STATUS_VALUES)[number]

export interface StatusUpdate {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  teamId: string
  teamName: string
  project: string
  status: StatusValue
  body: string
  blockers: string | null
  statusDate: string
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface StatusListResponse {
  data: StatusUpdate[]
  pagination: PaginationMeta
}

export interface StatusListParams {
  page?: number
  limit?: number
  status?: StatusValue
  team?: string
  search?: string
}

export interface StatusInput {
  teamId: string
  project: string
  status: StatusValue
  body: string
  blockers?: string | null
  statusDate: string
}

export type StatusUpdateInput = Partial<StatusInput>

export const STATUS_LABELS: Record<StatusValue, string> = {
  on_track: 'On Track',
  blocked: 'Blocked',
  needs_review: 'Needs Review',
  done: 'Done',
}

export function fetchStatusList(
  params: StatusListParams,
  signal?: AbortSignal,
): Promise<StatusListResponse> {
  return apiFetch<StatusListResponse>('/api/statuses', {
    searchParams: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      team: params.team,
      search: params.search,
    },
    signal,
  })
}

export function fetchStatus(id: string, signal?: AbortSignal): Promise<StatusUpdate> {
  return apiFetch<StatusUpdate>(`/api/statuses/${id}`, { signal })
}

export function createStatus(input: StatusInput): Promise<StatusUpdate> {
  return apiFetch<StatusUpdate>('/api/statuses', { method: 'POST', body: input })
}

export function updateStatus(id: string, input: StatusUpdateInput): Promise<StatusUpdate> {
  return apiFetch<StatusUpdate>(`/api/statuses/${id}`, { method: 'PUT', body: input })
}

export function deleteStatus(id: string): Promise<void> {
  return apiFetch<void>(`/api/statuses/${id}`, { method: 'DELETE' })
}
