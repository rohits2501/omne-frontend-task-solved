import { z } from 'zod'
import { STATUS_VALUES } from '../api/statuses'

/**
 * Zod schema for the feed page's search params. Used by TanStack Router's
 * `validateSearch` so the URL is the single source of truth for filter state.
 *
 * Empty / unknown values are normalized to `undefined` so the query key
 * collapses to a stable shape.
 */
export const feedSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1).default(1),
  status: z.enum(STATUS_VALUES).optional().catch(undefined),
  team: z.string().min(1).optional().catch(undefined),
  search: z.string().min(1).optional().catch(undefined),
})

export type FeedSearch = z.infer<typeof feedSearchSchema>

export const DEFAULT_PAGE_SIZE = 6
