import { createFileRoute } from '@tanstack/react-router'
import { statusDetailQueryOptions } from '../../hooks/use-statuses'
import { teamsQueryOptions } from '../../hooks/use-teams'
import { EditStatusScreen } from '../../screens/edit-status-screen'

export const Route = createFileRoute('/_app/statuses/$id/edit')({
  loader: ({ context: { queryClient }, params: { id } }) =>
    Promise.all([
      queryClient.ensureQueryData(statusDetailQueryOptions(id)),
      queryClient.ensureQueryData(teamsQueryOptions()),
    ]),
  component: EditStatusScreen,
})
