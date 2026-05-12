import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { FileText, Plus } from 'lucide-react'
import { useCallback } from 'react'
import type { StatusValue } from '../api/statuses'
import { EmptyState } from '../components/feedback/empty-state'
import { ErrorState } from '../components/feedback/error-state'
import { PageHeader } from '../components/layout/page-header'
import { StatusCard } from '../components/status/status-card'
import { StatusCardSkeleton } from '../components/status/status-card-skeleton'
import { StatusFilters } from '../components/status/status-filters'
import { StatusPagination } from '../components/status/status-pagination'
import { Button } from '../components/ui/button'
import { useStatusList } from '../hooks/use-statuses'
import { useTeams } from '../hooks/use-teams'
import { DEFAULT_PAGE_SIZE, type FeedSearch } from '../lib/search-params'

export function FeedScreen() {
  const search = useSearch({ from: '/_app/' })
  const navigate = useNavigate({ from: '/_app/' })

  const updateSearch = useCallback(
    (next: Partial<FeedSearch>, opts: { resetPage?: boolean } = {}) => {
      navigate({
        to: '/',
        search: (prev: FeedSearch) => {
          const merged: FeedSearch = { ...prev, ...next }
          if (opts.resetPage) merged.page = 1
          return merged
        },
        replace: true,
      })
    },
    [navigate],
  )

  const { data: teamsData, isLoading: teamsLoading } = useTeams()

  const queryParams = {
    page: search.page,
    limit: DEFAULT_PAGE_SIZE,
    status: search.status,
    team: search.team,
    search: search.search,
  }
  const list = useStatusList(queryParams)

  const items = list.data?.data ?? []
  const pagination = list.data?.pagination
  const hasFilters = Boolean(search.status || search.team || search.search)

  const handleStatusChange = (status: StatusValue | null) => {
    updateSearch({ status: status ?? undefined }, { resetPage: true })
  }

  const handleTeamChange = (team: string | null) => {
    updateSearch({ team: team ?? undefined }, { resetPage: true })
  }

  const handleSearchChange = (value: string) => {
    updateSearch({ search: value.trim() || undefined }, { resetPage: true })
  }

  const handlePageChange = (page: number) => {
    updateSearch({ page })
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Status Feed"
        actions={
          <Link to="/statuses/new">
            <Button>
              <Plus className="h-4 w-4" aria-hidden />
              New Update
            </Button>
          </Link>
        }
      >
        <StatusFilters
          search={search.search ?? ''}
          onSearchChange={handleSearchChange}
          status={search.status ?? null}
          onStatusChange={handleStatusChange}
          team={search.team ?? null}
          onTeamChange={handleTeamChange}
          teams={teamsData}
          teamsLoading={teamsLoading}
        />
      </PageHeader>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {list.isPending ? (
            <FeedSkeletons />
          ) : list.isError ? (
            <ErrorState
              title="Couldn’t load updates"
              message="The server hiccupped. Give it another go."
              onRetry={() => list.refetch()}
            />
          ) : items.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={hasFilters ? 'No updates match your filters' : 'No updates yet'}
              message={
                hasFilters
                  ? 'Try clearing a filter or broadening your search.'
                  : 'Be the first to share progress with your team.'
              }
              action={
                hasFilters ? (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate({
                        to: '/',
                        search: { page: 1 },
                        replace: true,
                      })
                    }
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Link to="/statuses/new">
                    <Button>
                      <Plus className="h-4 w-4" aria-hidden />
                      Create update
                    </Button>
                  </Link>
                )
              }
            />
          ) : (
            <>
              {items.map((status) => (
                <StatusCard key={status.id} status={status} />
              ))}
            </>
          )}
        </div>
      </div>

      {pagination && items.length > 0 ? (
        <div className="border-t border-border bg-surface px-4 py-4 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <StatusPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              pageSize={pagination.limit}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function FeedSkeletons() {
  return (
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <StatusCardSkeleton key={`feed-skeleton-${i}`} />
      ))}
    </>
  )
}
