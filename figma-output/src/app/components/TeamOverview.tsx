import { AlertCircle, CheckCircle, Clock, FileText, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { getRelativeTime, mockStatusUpdates, mockTeamMembers } from '../data/mockData'
import { StatusChip } from './StatusChip'

export function TeamOverview() {
  const [showEmpty, setShowEmpty] = useState(false)

  // Calculate metrics
  const thisWeekUpdates = mockStatusUpdates.length
  const onTrackCount = mockStatusUpdates.filter((u) => u.status === 'On Track').length
  const blockedCount = mockStatusUpdates.filter((u) => u.status === 'Blocked').length
  const needsReviewCount = mockStatusUpdates.filter((u) => u.status === 'Needs Review').length

  const metrics = [
    {
      label: 'Total Updates',
      value: thisWeekUpdates,
      subLabel: 'this week',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'On Track',
      value: onTrackCount,
      subLabel: 'projects',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Blocked',
      value: blockedCount,
      subLabel: 'projects',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Needs Review',
      value: needsReviewCount,
      subLabel: 'projects',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ]

  return (
    <div className="h-full overflow-auto">
      <div className="px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-neutral-900 mb-2">Team Overview</h2>
          <p className="text-neutral-600">Track team progress at a glance</p>
        </div>

        {/* Toggle for empty state demo */}
        <div className="mb-6">
          <button
            onClick={() => setShowEmpty(!showEmpty)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showEmpty ? 'Show data' : 'Show empty state'}
          </button>
        </div>

        {showEmpty ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-200 rounded-lg">
            <div className="w-32 h-32 mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <FileText className="w-16 h-16 text-neutral-400" />
            </div>
            <h3 className="text-neutral-900 mb-2">No updates yet</h3>
            <p className="text-neutral-600 mb-6 text-center max-w-sm">
              Your team hasn't posted any status updates yet. Be the first to share your progress!
            </p>
            <Link
              to="/create"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Update
            </Link>
          </div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <div
                    key={metric.label}
                    className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-neutral-600">{metric.label}</span>
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <Icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl text-neutral-900">{metric.value}</span>
                      <span className="text-sm text-neutral-500">{metric.subLabel}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Team Members Table */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="text-left px-6 py-3.5 text-sm text-neutral-600">Name</th>
                      <th className="text-left px-6 py-3.5 text-sm text-neutral-600">Team</th>
                      <th className="text-left px-6 py-3.5 text-sm text-neutral-600">
                        Last Update
                      </th>
                      <th className="text-left px-6 py-3.5 text-sm text-neutral-600">Status</th>
                      <th className="text-left px-6 py-3.5 text-sm text-neutral-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTeamMembers.map((member, index) => (
                      <tr
                        key={member.id}
                        className={`${
                          index !== mockTeamMembers.length - 1 ? 'border-b border-neutral-200' : ''
                        } hover:bg-neutral-50 transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-neutral-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-neutral-700">{member.team}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-neutral-600 text-sm">
                            {member.lastUpdate ? getRelativeTime(member.lastUpdate) : 'No updates'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {member.status ? (
                            <StatusChip status={member.status} />
                          ) : (
                            <span className="text-neutral-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
