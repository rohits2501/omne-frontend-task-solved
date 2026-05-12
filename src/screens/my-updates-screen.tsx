import { useNavigate } from '@tanstack/react-router'
import { Pencil, Plus, Trash2, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { StatusUpdate } from '../api/statuses'
import { EmptyState } from '../components/feedback/empty-state'
import { ErrorState } from '../components/feedback/error-state'
import { PageHeader } from '../components/layout/page-header'
import { StatusCard } from '../components/status/status-card'
import { StatusCardSkeleton } from '../components/status/status-card-skeleton'
import { Button } from '../components/ui/button'
import { Dialog } from '../components/ui/dialog'
import { useToast } from '../components/ui/toast'
import { useDeleteStatus } from '../hooks/use-status-mutations'
import { useStatusList } from '../hooks/use-statuses'
import { useCurrentUser } from '../lib/current-user'

export function MyUpdatesScreen() {
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const toast = useToast()
  const list = useStatusList({ page: 1, limit: 50 })
  const deleteMutation = useDeleteStatus()
  const [pendingDelete, setPendingDelete] = useState<StatusUpdate | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const myUpdates = useMemo(
    () => (list.data?.data ?? []).filter((status) => status.authorId === currentUser.id),
    [list.data, currentUser.id],
  )

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    setDeleteError(null)
    try {
      await deleteMutation.mutateAsync(pendingDelete.id)
      setPendingDelete(null)
      toast.success('Update deleted')
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Could not delete the update.')
    }
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="My Updates" description="View and manage your status updates" />

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {list.isPending ? (
            <>
              <StatusCardSkeleton key="ms-1" />
              <StatusCardSkeleton key="ms-2" />
            </>
          ) : list.isError ? (
            <ErrorState
              title="Couldn’t load your updates"
              message="The server hiccupped. Please try again."
              onRetry={() => list.refetch()}
            />
          ) : myUpdates.length === 0 ? (
            <EmptyState
              icon={User}
              title="No updates yet"
              message="You haven’t posted any status updates yet. Create your first update to get started."
              action={
                <Button onClick={() => navigate({ to: '/statuses/new' })}>
                  <Plus className="h-4 w-4" aria-hidden />
                  Create Update
                </Button>
              }
            />
          ) : (
            <>
              <p className="text-xs text-foreground-muted">
                Showing your updates from the most recent 50 across the team.
              </p>
              {myUpdates.map((status) => (
                <StatusCard
                  key={status.id}
                  status={status}
                  actions={
                    <span className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate({
                            to: '/statuses/$id/edit',
                            params: { id: status.id },
                          })
                        }
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Edit
                      </Button>
                      <Button
                        variant="danger-ghost"
                        size="sm"
                        onClick={() => {
                          setDeleteError(null)
                          setPendingDelete(status)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Delete
                      </Button>
                    </span>
                  }
                />
              ))}
            </>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null)
            setDeleteError(null)
          }
        }}
        title="Delete this update?"
        description="This cannot be undone."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setPendingDelete(null)
                setDeleteError(null)
              }}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }
      >
        {deleteError ? (
          <p className="text-danger-600">{deleteError}</p>
        ) : (
          <p>The update will be permanently removed from your team’s feed.</p>
        )}
      </Dialog>
    </div>
  )
}
