import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export function StatusCardSkeleton() {
  return (
    <Card className="px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </Card>
  )
}
