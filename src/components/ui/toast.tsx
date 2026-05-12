import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '../../lib/cn'

/**
 * Lightweight toast — small surface (queue + auto-dismiss) and we already
 * own the design tokens, so no 13kb dep for one feature.
 */

type ToastVariant = 'success' | 'danger' | 'info'

interface Toast {
  id: number
  message: string
  description?: string
  variant: ToastVariant
}

interface ToastApi {
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const AUTO_DISMISS_MS = 3500

const toastVariants = tv({
  base: [
    'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border p-3',
    'shadow-md',
  ],
  variants: {
    variant: {
      success: 'border-success-200 bg-success-50 text-success-900',
      danger: 'border-danger-200 bg-danger-50 text-danger-900',
      info: 'border-border bg-surface text-foreground',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

type ToastVariantProps = VariantProps<typeof toastVariants>

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  danger: XCircle,
  info: Info,
}

const ICON_TONE: Record<ToastVariant, string> = {
  success: 'text-success-600',
  danger: 'text-danger-600',
  info: 'text-foreground-muted',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback((variant: ToastVariant, message: string, description?: string) => {
    idRef.current += 1
    const id = idRef.current
    setToasts((current) => [...current, { id, variant, message, description }])
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      success: (message, description) => push('success', message, description),
      error: (message, description) => push('danger', message, description),
      info: (message, description) => push('info', message, description),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: number) => void
}) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  const Icon = ICONS[toast.variant]

  return (
    <div
      className={toastVariants({ variant: toast.variant } as ToastVariantProps)}
      role={toast.variant === 'danger' ? 'alert' : 'status'}
      aria-live={toast.variant === 'danger' ? 'assertive' : 'polite'}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', ICON_TONE[toast.variant])} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.description ? (
          <p className="mt-0.5 text-xs opacity-80">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="-mr-1 -mt-1 inline-flex h-6 w-6 items-center justify-center rounded text-foreground-muted hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx
}
