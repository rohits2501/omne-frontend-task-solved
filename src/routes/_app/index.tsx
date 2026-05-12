import { createFileRoute } from '@tanstack/react-router'
import { statusListQueryOptions } from '../../hooks/use-statuses'
import { teamsQueryOptions } from '../../hooks/use-teams'
import { DEFAULT_PAGE_SIZE, type FeedSearch, feedSearchSchema } from '../../lib/search-params'
import { FeedScreen } from '../../screens/feed-screen'

export const Route = createFileRoute('/_app/')({
  validateSearch: feedSearchSchema,
  loaderDeps: ({ search }: { search: FeedSearch }) => ({ search }),
  loader: ({ context: { queryClient }, deps: { search } }) => {
    const params = {
      page: search.page,
      limit: DEFAULT_PAGE_SIZE,
      status: search.status,
      team: search.team,
      search: search.search,
    }
    return Promise.all([
      queryClient.ensureQueryData(statusListQueryOptions(params)),
      queryClient.ensureQueryData(teamsQueryOptions()),
    ])
  },
  component: FeedScreen,
})
