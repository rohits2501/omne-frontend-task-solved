import { z } from 'zod'
import { STATUS_VALUES } from '../api/statuses'

/** TanStack Router `validateSearch`. Unknown values coerce to `undefined` to keep the query key stable. */
export const feedSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1).default(1),
  status: z.enum(STATUS_VALUES).optional().catch(undefined),
  team: z.string().min(1).optional().catch(undefined),
  search: z.string().min(1).optional().catch(undefined),
})

export type FeedSearch = z.infer<typeof feedSearchSchema>

export const DEFAULT_PAGE_SIZE = 6
