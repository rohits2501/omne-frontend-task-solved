import type { ReactNode } from 'react'
import type { StatusUpdate } from '../../api/statuses'
import { formatRelative } from '../../lib/format'
import { Avatar } from '../ui/avatar'
import { Card } from '../ui/card'
import { StatusChip } from './status-chip'

export interface StatusCardProps {
  status: StatusUpdate
  actions?: ReactNode
}

export function StatusCard({ status, actions }: StatusCardProps) {
  return (
    <Card className="px-5 py-4 sm:px-6 sm:py-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-4">
        <Avatar src={status.authorAvatar} alt={status.authorName} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-medium text-foreground">{status.authorName}</span>
            <span aria-hidden className="text-foreground-subtle">
              ·
            </span>
            <span className="text-foreground-muted">{status.teamName}</span>
            <span className="text-foreground-subtle">{formatRelative(status.createdAt)}</span>
          </div>
          <div className="mt-2">
            <StatusChip status={status.status} />
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
            {status.body}
          </p>
          {status.blockers ? (
            <p className="mt-2 rounded-md border border-danger-100 bg-danger-50 px-3 py-2 text-xs text-danger-700">
              <span className="font-medium">Blocker: </span>
              {status.blockers}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-foreground-muted">
            <span>Project: {status.project}</span>
            {actions ? <span className="flex items-center gap-1">{actions}</span> : null}
          </div>
        </div>
      </div>
    </Card>
  )
}
