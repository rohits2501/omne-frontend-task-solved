import { createFileRoute } from '@tanstack/react-router'
import { teamsQueryOptions } from '../../hooks/use-teams'
import { CreateStatusScreen } from '../../screens/create-status-screen'

export const Route = createFileRoute('/_app/statuses/new')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(teamsQueryOptions()),
  component: CreateStatusScreen,
})
