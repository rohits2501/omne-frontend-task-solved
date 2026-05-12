/**
 * Typed fetch wrapper used by all API modules.
 *
 * Two responsibilities:
 *  1. Stringify and parse JSON, returning narrowed result types.
 *  2. Normalize all non-2xx responses into a single `ApiError` shape so
 *     UI code (TanStack Query hooks, forms) can branch on `.status` and
 *     `.details` without re-implementing parsing in every hook.
 */

export interface ApiErrorBody {
  error: string
  details?: Record<string, string>
}

export class ApiError extends Error {
  readonly status: number
  readonly details?: Record<string, string>

  constructor(message: string, status: number, details?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }

  static isApiError(value: unknown): value is ApiError {
    return value instanceof ApiError
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
  searchParams?: Record<string, string | number | undefined | null>
}

function buildUrl(path: string, searchParams?: RequestOptions['searchParams']): string {
  if (!searchParams) return path
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, searchParams } = options
  const url = buildUrl(path, searchParams)

  const response = await fetch(url, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    let details: Record<string, string> | undefined
    if (isJson) {
      try {
        const parsed = (await response.json()) as ApiErrorBody
        message = parsed.error ?? message
        details = parsed.details
      } catch {
        // fall through with default message
      }
    }
    throw new ApiError(message, response.status, details)
  }

  if (!isJson) {
    return undefined as T
  }

  return (await response.json()) as T
}
