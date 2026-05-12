import { Plus, User } from 'lucide-react'
import { Link } from 'react-router'

export function MyUpdates() {
  return (
    <div className="h-full overflow-auto bg-neutral-50">
      <div className="px-8 py-6">
        <div className="mb-8">
          <h2 className="text-neutral-900 mb-2">My Updates</h2>
          <p className="text-neutral-600">View and manage your status updates</p>
        </div>

        <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-200 rounded-lg shadow-sm">
          <div className="w-32 h-32 mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-neutral-400" />
          </div>
          <h3 className="text-neutral-900 mb-2">No updates yet</h3>
          <p className="text-neutral-600 mb-6 text-center max-w-sm">
            You haven't posted any status updates yet. Create your first update to get started.
          </p>
          <Link
            to="/create"
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Update
          </Link>
        </div>
      </div>
    </div>
  )
}
