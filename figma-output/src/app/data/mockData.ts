export type StatusCategory = 'On Track' | 'Blocked' | 'Needs Review' | 'Done'

export interface StatusUpdate {
  id: string
  userId: string
  userName: string
  userAvatar: string
  team: string
  timestamp: Date
  status: StatusCategory
  summary: string
  project?: string
}

export interface TeamMember {
  id: string
  name: string
  team: string
  avatar: string
  lastUpdate?: Date
  status?: StatusCategory
}

export const mockTeams = ['Engineering', 'Design', 'Product', 'Marketing']

export const mockProjects = [
  'Mobile App Redesign',
  'API v2 Migration',
  'Dashboard Analytics',
  'User Onboarding Flow',
  'Performance Optimization',
]

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    team: 'Engineering',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'On Track',
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    team: 'Design',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastUpdate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: 'Blocked',
  },
  {
    id: '3',
    name: 'Emily Watson',
    team: 'Product',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: 'Needs Review',
  },
  {
    id: '4',
    name: 'James Park',
    team: 'Engineering',
    avatar: 'https://i.pravatar.cc/150?img=13',
    lastUpdate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'On Track',
  },
  {
    id: '5',
    name: 'Alicia Thompson',
    team: 'Marketing',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastUpdate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'Done',
  },
  {
    id: '6',
    name: 'David Kim',
    team: 'Engineering',
    avatar: 'https://i.pravatar.cc/150?img=14',
    lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'On Track',
  },
]

export const mockStatusUpdates: StatusUpdate[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    team: 'Engineering',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'On Track',
    summary:
      'Completed API integration for user authentication. Moving on to profile management endpoints.',
    project: 'API v2 Migration',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Marcus Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    team: 'Design',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'Blocked',
    summary:
      "Waiting on stakeholder feedback for the new dashboard layout. Can't proceed with high-fidelity mockups.",
    project: 'Dashboard Analytics',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Emily Watson',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    team: 'Product',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'Needs Review',
    summary:
      'User research findings documented. Need team review before proceeding to wireframing phase.',
    project: 'User Onboarding Flow',
  },
  {
    id: '4',
    userId: '4',
    userName: 'James Park',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    team: 'Engineering',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'On Track',
    summary:
      'Optimized database queries, reduced load time by 40%. Running final performance tests.',
    project: 'Performance Optimization',
  },
  {
    id: '5',
    userId: '5',
    userName: 'Alicia Thompson',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    team: 'Marketing',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'Done',
    summary: 'Q1 campaign assets finalized and approved. Ready for launch next Monday.',
    project: 'Mobile App Redesign',
  },
  {
    id: '6',
    userId: '6',
    userName: 'David Kim',
    userAvatar: 'https://i.pravatar.cc/150?img=14',
    team: 'Engineering',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'On Track',
    summary:
      'Implemented dark mode toggle and updated component library. Testing across different themes.',
    project: 'Mobile App Redesign',
  },
]

export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`
}
