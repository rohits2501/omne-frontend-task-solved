import type { StatusListParams } from '../api/statuses'

/** Hierarchical query key factory — invalidate broadly or narrowly. */
export const statusKeys = {
  all: ['statuses'] as const,
  lists: () => [...statusKeys.all, 'list'] as const,
  list: (params: StatusListParams) => [...statusKeys.lists(), params] as const,
  details: () => [...statusKeys.all, 'detail'] as const,
  detail: (id: string) => [...statusKeys.details(), id] as const,
}

export const teamKeys = {
  all: ['teams'] as const,
  list: () => [...teamKeys.all, 'list'] as const,
}

export const teamSummaryKeys = {
  all: ['team-summary'] as const,
  summary: () => [...teamSummaryKeys.all, 'summary'] as const,
}
