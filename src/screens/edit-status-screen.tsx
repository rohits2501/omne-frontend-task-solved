import { useNavigate, useParams } from '@tanstack/react-router'
import { ErrorState } from '../components/feedback/error-state'
import { PageLoader } from '../components/feedback/page-loader'
import { StatusForm } from '../components/status/status-form'
import { useStatus } from '../hooks/use-statuses'
import { useTeams } from '../hooks/use-teams'
import { useCurrentUser } from '../lib/current-user'

export function EditStatusScreen() {
  const navigate = useNavigate()
  const params = useParams({ from: '/_app/statuses/$id/edit' })
  const currentUser = useCurrentUser()
  const status = useStatus(params.id)
  const teams = useTeams()

  const isPending = status.isPending || teams.isPending
  const isError = status.isError || teams.isError

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Edit Status Update</h1>
          <p className="mt-1 text-sm text-foreground-muted">Update your post and resave.</p>
        </header>

        {isPending ? (
          <PageLoader label="Loading update…" />
        ) : isError ? (
          <ErrorState
            title="Couldn’t load update"
            message={status.error?.message ?? teams.error?.message ?? 'Please try again.'}
            onRetry={() => {
              status.refetch()
              teams.refetch()
            }}
          />
        ) : (
          <StatusForm
            mode="edit"
            statusId={params.id}
            teams={teams.data}
            defaultTeamId={currentUser.teamId}
            initialValues={{
              project: status.data.project,
              teamId: status.data.teamId,
              status: status.data.status,
              body: status.data.body,
              blockers: status.data.blockers ?? '',
              statusDate: status.data.statusDate,
            }}
            onCancel={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  )
}
