import { createFileRoute } from '@tanstack/react-router'
import { statusListQueryOptions } from '../../hooks/use-statuses'
import { MyUpdatesScreen } from '../../screens/my-updates-screen'

export const Route = createFileRoute('/_app/my-updates')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(statusListQueryOptions({ page: 1, limit: 50 })),
  component: MyUpdatesScreen,
})
