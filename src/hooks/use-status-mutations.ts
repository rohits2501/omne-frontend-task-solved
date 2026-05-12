import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createStatus,
  deleteStatus,
  type StatusInput,
  type StatusListResponse,
  type StatusUpdate,
  type StatusUpdateInput,
  updateStatus,
} from '../api/statuses'
import { statusKeys, teamSummaryKeys } from './status-keys'

/**
 * Cache strategy:
 *  - Create: invalidate `lists()` and the team summary on success.
 *    A naive optimistic prepend would lie when the active filter
 *    excludes the new row, so we let the server be the source of truth.
 *  - Update: optimistic — patch detail() and any matching list pages,
 *    rollback on error, then invalidate to converge with server.
 *  - Delete: optimistic removal from list pages, rollback on error.
 */

export function useCreateStatus() {
  const queryClient = useQueryClient()
  return useMutation<StatusUpdate, Error, StatusInput>({
    mutationFn: createStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statusKeys.lists() })
      queryClient.invalidateQueries({ queryKey: teamSummaryKeys.all })
    },
  })
}

interface UpdateContext {
  prevDetail?: StatusUpdate
  prevLists: Array<[readonly unknown[], StatusListResponse | undefined]>
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()
  return useMutation<StatusUpdate, Error, { id: string; input: StatusUpdateInput }, UpdateContext>({
    mutationFn: ({ id, input }) => updateStatus(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: statusKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: statusKeys.lists() })

      const prevDetail = queryClient.getQueryData<StatusUpdate>(statusKeys.detail(id))

      const prevLists = queryClient.getQueriesData<StatusListResponse>({
        queryKey: statusKeys.lists(),
      })

      if (prevDetail) {
        queryClient.setQueryData<StatusUpdate>(statusKeys.detail(id), {
          ...prevDetail,
          ...input,
          blockers: input.blockers ?? prevDetail.blockers,
          updatedAt: new Date().toISOString(),
        })
      }

      for (const [key, list] of prevLists) {
        if (!list) continue
        queryClient.setQueryData<StatusListResponse>(key, {
          ...list,
          data: list.data.map((row) =>
            row.id === id
              ? {
                  ...row,
                  ...input,
                  blockers: input.blockers ?? row.blockers,
                  updatedAt: new Date().toISOString(),
                }
              : row,
          ),
        })
      }

      return { prevDetail, prevLists }
    },
    onError: (_err, { id }, context) => {
      if (!context) return
      if (context.prevDetail) {
        queryClient.setQueryData(statusKeys.detail(id), context.prevDetail)
      }
      for (const [key, list] of context.prevLists) {
        queryClient.setQueryData(key, list)
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: statusKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: statusKeys.lists() })
      queryClient.invalidateQueries({ queryKey: teamSummaryKeys.all })
    },
  })
}

interface DeleteContext {
  prevLists: Array<[readonly unknown[], StatusListResponse | undefined]>
}

export function useDeleteStatus() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: deleteStatus,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: statusKeys.lists() })

      const prevLists = queryClient.getQueriesData<StatusListResponse>({
        queryKey: statusKeys.lists(),
      })

      for (const [key, list] of prevLists) {
        if (!list) continue
        queryClient.setQueryData<StatusListResponse>(key, {
          ...list,
          data: list.data.filter((row) => row.id !== id),
          pagination: { ...list.pagination, total: Math.max(0, list.pagination.total - 1) },
        })
      }

      return { prevLists }
    },
    onError: (_err, _id, context) => {
      if (!context) return
      for (const [key, list] of context.prevLists) {
        queryClient.setQueryData(key, list)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: statusKeys.lists() })
      queryClient.invalidateQueries({ queryKey: teamSummaryKeys.all })
    },
  })
}
