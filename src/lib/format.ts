import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return ''
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true })
  } catch {
    return ''
  }
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  try {
    return format(parseISO(iso), 'MMM d, yyyy')
  } catch {
    return ''
  }
}

export function todayIsoDate(): string {
  return new Date().toISOString().split('T')[0]
}
