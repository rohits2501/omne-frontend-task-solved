import { useNavigate } from '@tanstack/react-router'
import { ErrorState } from '../components/feedback/error-state'
import { PageLoader } from '../components/feedback/page-loader'
import { StatusForm } from '../components/status/status-form'
import { useTeams } from '../hooks/use-teams'
import { useCurrentUser } from '../lib/current-user'

export function CreateStatusScreen() {
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const teams = useTeams()

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Create Status Update
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">Share your progress with the team</p>
        </header>

        {teams.isPending ? (
          <PageLoader label="Loading form…" />
        ) : teams.isError ? (
          <ErrorState
            title="Couldn’t load form"
            message="We couldn’t fetch the list of teams. Please try again."
            onRetry={() => teams.refetch()}
          />
        ) : (
          <StatusForm
            mode="create"
            teams={teams.data}
            defaultTeamId={currentUser.teamId}
            onCancel={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  )
}
