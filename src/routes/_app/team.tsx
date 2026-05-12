import { createFileRoute } from '@tanstack/react-router'
import { teamSummaryQueryOptions } from '../../hooks/use-team-summary'
import { TeamScreen } from '../../screens/team-screen'

export const Route = createFileRoute('/_app/team')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(teamSummaryQueryOptions()),
  component: TeamScreen,
})
