import { Link } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Clock, FileText, Plus, Users } from 'lucide-react'
import type { TeamMemberSummary, TeamSummary } from '../api/team-summary'
import { EmptyState } from '../components/feedback/empty-state'
import { ErrorState } from '../components/feedback/error-state'
import { PageHeader } from '../components/layout/page-header'
import { MetricCard } from '../components/status/metric-card'
import { StatusChip } from '../components/status/status-chip'
import { Avatar } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { useTeamSummary } from '../hooks/use-team-summary'
import { formatRelative } from '../lib/format'

export function TeamScreen() {
  const summary = useTeamSummary()

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Team Overview" description="Track team progress at a glance" />

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {summary.isPending ? (
            <TeamSkeleton />
          ) : summary.isError ? (
            <ErrorState
              title="Couldn’t load team overview"
              message="The server hiccupped. Please try again."
              onRetry={() => summary.refetch()}
            />
          ) : (
            <TeamContent data={summary.data} />
          )}
        </div>
      </div>
    </div>
  )
}

function getMemberAvatar(member: TeamMemberSummary): string {
  const seed = encodeURIComponent(member.name.split(' ')[0] ?? member.name)
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`
}

function TeamContent({ data }: { data: TeamSummary }) {
  const hasUpdates =
    data.totalUpdatesThisWeek > 0 || data.members.some((m) => m.lastUpdate !== null)

  if (!hasUpdates) {
    return (
      <EmptyState
        icon={Users}
        title="No team activity yet"
        message="Once your team starts posting updates, you’ll see their progress and metrics here."
        action={
          <Link to="/statuses/new">
            <Button>
              <Plus className="h-4 w-4" aria-hidden />
              Post the first update
            </Button>
          </Link>
        }
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Updates"
          subLabel="this week"
          value={data.totalUpdatesThisWeek}
          icon={FileText}
          tone="primary"
        />
        <MetricCard
          label="On Track"
          subLabel="projects"
          value={data.onTrackCount}
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          label="Blocked"
          subLabel="projects"
          value={data.blockedCount}
          icon={AlertCircle}
          tone="danger"
        />
        <MetricCard
          label="Needs Review"
          subLabel="projects"
          value={data.needsReviewCount}
          icon={Clock}
          tone="warning"
        />
      </div>

      <Card className="hidden overflow-hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-raised text-left text-xs uppercase tracking-wide text-foreground-muted">
              <th scope="col" className="px-6 py-3 font-medium">
                Name
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Team
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Last Update
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.members.map((member) => (
              <tr key={member.id} className="transition-colors hover:bg-surface-raised">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={getMemberAvatar(member)} alt={member.name} size="sm" />
                    <span className="font-medium text-foreground">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-foreground-muted">{member.teamName}</td>
                <td className="px-6 py-3 text-foreground-muted">
                  {member.lastUpdate ? formatRelative(member.lastUpdate) : 'No updates'}
                </td>
                <td className="px-6 py-3">
                  {member.lastStatus ? (
                    <StatusChip status={member.lastStatus} />
                  ) : (
                    <span className="text-foreground-subtle">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ul className="space-y-3 md:hidden" aria-label="Team members">
        {data.members.map((member) => (
          <li key={member.id}>
            <Card className="px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar src={getMemberAvatar(member)} alt={member.name} size="sm" />
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                  {member.name}
                </span>
                {member.lastStatus ? (
                  <StatusChip status={member.lastStatus} />
                ) : (
                  <span className="text-xs text-foreground-subtle">—</span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-foreground-muted">
                <span className="truncate">{member.teamName}</span>
                <span className="shrink-0">
                  {member.lastUpdate ? formatRelative(member.lastUpdate) : 'No updates'}
                </span>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}

function TeamSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={`metric-skeleton-${i}`} className="px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
            <Skeleton className="mt-4 h-8 w-16" />
          </Card>
        ))}
      </div>

      <Card className="hidden md:block">
        <div className="space-y-3 p-6">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={`row-skeleton-${i}`} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="ml-auto h-4 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </Card>

      <ul className="space-y-3 md:hidden" aria-hidden>
        {Array.from({ length: 4 }, (_, i) => (
          <li key={`card-skeleton-${i}`}>
            <Card className="px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="ml-auto h-5 w-16" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
