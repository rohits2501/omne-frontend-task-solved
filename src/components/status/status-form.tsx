import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ApiError } from '../../api/client'
import { STATUS_LABELS, STATUS_VALUES, type StatusValue } from '../../api/statuses'
import type { Team } from '../../api/teams'
import { useCreateStatus, useUpdateStatus } from '../../hooks/use-status-mutations'
import { cn } from '../../lib/cn'
import { todayIsoDate } from '../../lib/format'
import { PROJECTS, type StatusFormValues, statusFormSchema } from '../../lib/status-schema'
import { InlineError } from '../feedback/inline-error'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Select, type SelectOption } from '../ui/select'
import { Spinner } from '../ui/spinner'
import { Textarea } from '../ui/textarea'
import { useToast } from '../ui/toast'

export interface StatusFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<StatusFormValues>
  statusId?: string
  teams: Team[]
  defaultTeamId: string
  onCancel?: () => void
}

const PROJECT_OPTIONS: SelectOption<string>[] = PROJECTS.map((name) => ({
  value: name,
  label: name,
}))

function firstError(errors: Array<unknown> | undefined): string | undefined {
  if (!errors?.length) return undefined
  const first = errors[0]
  if (typeof first === 'string') return first
  if (first && typeof first === 'object' && 'message' in first) {
    const message = (first as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return undefined
}

export function StatusForm({
  mode,
  initialValues,
  statusId,
  teams,
  defaultTeamId,
  onCancel,
}: StatusFormProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const createMutation = useCreateStatus()
  const updateMutation = useUpdateStatus()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const teamOptions = useMemo<SelectOption<string>[]>(
    () => teams.map((team) => ({ value: team.id, label: team.name })),
    [teams],
  )

  const form = useForm({
    defaultValues: {
      project: initialValues?.project ?? '',
      teamId: initialValues?.teamId ?? defaultTeamId,
      status: initialValues?.status ?? ('on_track' as StatusValue),
      body: initialValues?.body ?? '',
      blockers: initialValues?.blockers ?? '',
      statusDate: initialValues?.statusDate ?? todayIsoDate(),
    } satisfies StatusFormValues,
    validators: {
      onSubmit: statusFormSchema,
      onChange: statusFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setSubmitError(null)
      const payload = {
        ...value,
        blockers: value.blockers.trim() ? value.blockers.trim() : null,
      }
      try {
        if (mode === 'create') {
          await createMutation.mutateAsync(payload)
          toast.success('Update posted')
        } else if (statusId) {
          await updateMutation.mutateAsync({ id: statusId, input: payload })
          toast.success('Changes saved')
        }
        navigate({ to: '/' })
      } catch (error) {
        if (ApiError.isApiError(error)) {
          if (error.details) {
            for (const [field, message] of Object.entries(error.details)) {
              const key = field as keyof StatusFormValues
              formApi.setFieldMeta(key, (prev) => ({
                ...prev,
                errorMap: { ...prev.errorMap, onServer: message },
                isTouched: true,
              }))
            }
          }
          setSubmitError(error.message)
        } else {
          setSubmitError('Something went wrong. Please try again.')
        }
      }
    },
  })

  const submitting = createMutation.isPending || updateMutation.isPending

  return (
    <Card className="p-6 sm:p-8">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
        noValidate
        className="space-y-6"
      >
        <form.Field name="project">
          {(field) => {
            const errorMessage = field.state.meta.isTouched
              ? firstError(field.state.meta.errors)
              : undefined
            const errorId = `${field.name}-error`
            return (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Project <span className="text-danger-500">*</span>
                </label>
                <Select<string>
                  id={field.name}
                  value={field.state.value || null}
                  onValueChange={(value) => field.handleChange(value ?? '')}
                  options={PROJECT_OPTIONS}
                  placeholder="Select a project"
                  invalid={Boolean(errorMessage)}
                  className="w-full"
                />
                <InlineError id={errorId} message={errorMessage} />
              </div>
            )
          }}
        </form.Field>

        <form.Field name="teamId">
          {(field) => {
            const errorMessage = field.state.meta.isTouched
              ? firstError(field.state.meta.errors)
              : undefined
            return (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Team <span className="text-danger-500">*</span>
                </label>
                <Select<string>
                  id={field.name}
                  value={field.state.value || null}
                  onValueChange={(value) => field.handleChange(value ?? '')}
                  options={teamOptions}
                  placeholder="Select a team"
                  invalid={Boolean(errorMessage)}
                  className="w-full"
                />
                <InlineError message={errorMessage} />
              </div>
            )
          }}
        </form.Field>

        <form.Field name="status">
          {(field) => {
            const errorMessage = field.state.meta.isTouched
              ? firstError(field.state.meta.errors)
              : undefined
            return (
              <div>
                <span className="mb-2 block text-sm font-medium text-foreground">
                  Status <span className="text-danger-500">*</span>
                </span>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Status">
                  {STATUS_VALUES.map((value) => {
                    const selected = field.state.value === value
                    return (
                      <label
                        key={value}
                        className={cn(
                          'flex cursor-pointer items-center justify-center rounded-md border px-4 py-3 text-sm font-medium transition-colors',
                          selected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-border bg-surface text-foreground hover:border-neutral-300',
                        )}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={value}
                          checked={selected}
                          onChange={() => field.handleChange(value)}
                          onBlur={field.handleBlur}
                          className="sr-only"
                        />
                        {STATUS_LABELS[value]}
                      </label>
                    )
                  })}
                </div>
                <InlineError message={errorMessage} />
              </div>
            )
          }}
        </form.Field>

        <form.Field name="body">
          {(field) => {
            const errorMessage = field.state.meta.isTouched
              ? firstError(field.state.meta.errors)
              : undefined
            const length = field.state.value?.length ?? 0
            return (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Update <span className="text-danger-500">*</span>
                </label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  rows={4}
                  placeholder="What have you been working on?"
                  invalid={Boolean(errorMessage)}
                  maxLength={500}
                />
                <div className="mt-1 flex items-start justify-between gap-2">
                  <InlineError message={errorMessage} className="mt-0" />
                  <span
                    className={cn(
                      'mt-1 text-xs tabular-nums',
                      length > 500 ? 'text-danger-600' : 'text-foreground-subtle',
                    )}
                  >
                    {length}/500
                  </span>
                </div>
              </div>
            )
          }}
        </form.Field>

        <form.Field name="blockers">
          {(field) => {
            const errorMessage = field.state.meta.isTouched
              ? firstError(field.state.meta.errors)
              : undefined
            return (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Blockers <span className="font-normal text-foreground-subtle">(optional)</span>
                </label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  rows={3}
                  placeholder="Any blockers or dependencies?"
                  invalid={Boolean(errorMessage)}
                  maxLength={500}
                />
                <InlineError message={errorMessage} />
              </div>
            )
          }}
        </form.Field>

        <form.Field name="statusDate">
          {(field) => {
            const errorMessage = field.state.meta.isTouched
              ? firstError(field.state.meta.errors)
              : undefined
            return (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Status Date <span className="text-danger-500">*</span>
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  invalid={Boolean(errorMessage)}
                />
                <InlineError message={errorMessage} />
              </div>
            )
          }}
        </form.Field>

        {submitError ? (
          <div
            role="alert"
            className="rounded-md border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700"
          >
            {submitError}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner size="sm" className="text-white" />
                {mode === 'create' ? 'Submitting…' : 'Saving…'}
              </>
            ) : mode === 'create' ? (
              'Submit Update'
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => (onCancel ? onCancel() : navigate({ to: '/' }))}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
