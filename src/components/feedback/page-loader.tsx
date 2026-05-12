import { Spinner } from '../ui/spinner'

export interface PageLoaderProps {
  label?: string
}

export function PageLoader({ label = 'Loading…' }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Spinner size="lg" label={label} />
      <p className="text-sm text-foreground-muted">{label}</p>
    </div>
  )
}
