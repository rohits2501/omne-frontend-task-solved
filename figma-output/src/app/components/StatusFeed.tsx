import { ChevronLeft, ChevronRight, Filter, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { getRelativeTime, mockStatusUpdates, StatusCategory } from '../data/mockData'
import { StatusChip } from './StatusChip'

export function StatusFeed() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [teamFilter, setTeamFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 6
  const totalPages = Math.ceil(mockStatusUpdates.length / itemsPerPage)

  const currentUpdates = mockStatusUpdates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-neutral-900">Status Feed</h2>
          <Link
            to="/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Update
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-neutral-100 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="Blocked">Blocked</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Done">Done</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>

          {/* Team Filter */}
          <div className="relative">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-neutral-100 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Teams</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-4xl space-y-4">
          {currentUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <img
                  src={update.userAvatar}
                  alt={update.userName}
                  className="w-10 h-10 rounded-full"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-neutral-900">{update.userName}</span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-500 text-sm">{update.team}</span>
                    <span className="text-neutral-400 text-sm">
                      {getRelativeTime(update.timestamp)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <StatusChip status={update.status} />
                  </div>

                  <p className="text-neutral-700 leading-relaxed">{update.summary}</p>

                  {update.project && (
                    <div className="mt-3 text-sm text-neutral-500">Project: {update.project}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-neutral-200 px-8 py-4">
        <div className="max-w-4xl flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, mockStatusUpdates.length)} of{' '}
            {mockStatusUpdates.length} updates
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[2.5rem] h-10 px-3 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
