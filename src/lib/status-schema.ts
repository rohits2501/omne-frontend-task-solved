import { z } from 'zod'
import { STATUS_VALUES } from '../api/statuses'

export const statusFormSchema = z.object({
  project: z
    .string({ error: 'Project is required' })
    .trim()
    .min(1, { error: 'Project is required' }),
  teamId: z.string({ error: 'Team is required' }).trim().min(1, { error: 'Team is required' }),
  status: z.enum(STATUS_VALUES, { error: 'Status is required' }),
  body: z
    .string({ error: 'Update is required' })
    .trim()
    .min(1, { error: 'Update is required' })
    .max(500, { error: 'Update must be 500 characters or fewer' }),
  blockers: z.string().max(500, { error: 'Blockers must be 500 characters or fewer' }),
  statusDate: z
    .string({ error: 'Status date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Status date is required' }),
})

export type StatusFormValues = z.infer<typeof statusFormSchema>

/** Mock has no `/api/projects` — in a real app this would be a query. */
export const PROJECTS = [
  'Auth Overhaul',
  'Dashboard Redesign',
  'API v3 Migration',
  'Mobile App Launch',
  'Design System',
  'CI/CD Pipeline',
  'Analytics Dashboard',
  'User Onboarding',
  'Payment Integration',
  'Search Improvements',
] as const
