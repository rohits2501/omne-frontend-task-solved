import { delay, HttpResponse, http } from 'msw'
import { setupWorker } from 'msw/browser'

// ─── Types ───

interface StatusUpdate {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  teamId: string
  teamName: string
  project: string
  status: 'on_track' | 'blocked' | 'needs_review' | 'done'
  body: string
  blockers: string | null
  statusDate: string
  createdAt: string
  updatedAt: string
}

interface Team {
  id: string
  name: string
  memberCount: number
}

// ─── Seed data ───

const teams: Team[] = [
  { id: 'team-1', name: 'Platform', memberCount: 6 },
  { id: 'team-2', name: 'Product', memberCount: 8 },
  { id: 'team-3', name: 'Design', memberCount: 4 },
  { id: 'team-4', name: 'Infrastructure', memberCount: 5 },
]

const authors = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
    teamId: 'team-1',
  },
  {
    id: 'user-2',
    name: 'Sarah Kim',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
    teamId: 'team-1',
  },
  {
    id: 'user-3',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus',
    teamId: 'team-2',
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Emily',
    teamId: 'team-2',
  },
  {
    id: 'user-5',
    name: 'James Wilson',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=James',
    teamId: 'team-3',
  },
  {
    id: 'user-6',
    name: 'Priya Patel',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
    teamId: 'team-3',
  },
  {
    id: 'user-7',
    name: 'David Lee',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=David',
    teamId: 'team-4',
  },
  {
    id: 'user-8',
    name: 'Nina Rodriguez',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Nina',
    teamId: 'team-4',
  },
  {
    id: 'user-9',
    name: 'Tom Baker',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Tom',
    teamId: 'team-2',
  },
  {
    id: 'user-10',
    name: 'Lisa Chang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa',
    teamId: 'team-1',
  },
]

const statuses: StatusUpdate['status'][] = ['on_track', 'blocked', 'needs_review', 'done']
const projects = [
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
]

const bodyTemplates = [
  'Completed the {project} feature spec and shared with stakeholders for review. Waiting on feedback before moving to implementation.',
  'Made solid progress on {project}. Core logic is done, working on edge cases and error handling now.',
  'Blocked on {project} — waiting for API changes from the backend team. Reached out to David about timeline.',
  'Shipped the first iteration of {project} to staging. Running through QA checklist this afternoon.',
  'Pairing with Sarah on {project} today. We identified a performance bottleneck in the list rendering — investigating virtualization.',
  'Wrapping up {project} documentation. Should be ready for handoff by EOD tomorrow.',
  "Started spike on {project}. Evaluating two approaches — will share findings in tomorrow's standup.",
  'Refactored the {project} component hierarchy. Reduced bundle size by ~15%. Ready for review.',
  '{project} is in good shape. Just need to add loading states and error boundaries before merging.',
  'Hit an unexpected issue with {project} — the third-party SDK has a breaking change in v3. Working on a workaround.',
  'Finished the responsive layout for {project}. Tested on tablet and mobile breakpoints.',
  'Code review feedback addressed for {project}. All comments resolved, CI is green.',
]

const blockerTemplates = [
  'Waiting on backend API endpoint — ETA unknown.',
  'Need design review for the empty state before proceeding.',
  'Third-party SDK has a regression in latest version.',
  'Dependency on infrastructure team to provision staging environment.',
  'Need access credentials for the test payment gateway.',
]

function randomDate(daysBack: number): string {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
  return date.toISOString().split('T')[0]
}

function randomDatetime(daysBack: number): string {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
  date.setHours(Math.floor(Math.random() * 10) + 8)
  date.setMinutes(Math.floor(Math.random() * 60))
  return date.toISOString()
}

function generateStatuses(): StatusUpdate[] {
  const items: StatusUpdate[] = []

  for (let i = 0; i < 47; i++) {
    const author = authors[i % authors.length]
    const team = teams.find((t) => t.id === author.teamId)!
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const project = projects[Math.floor(Math.random() * projects.length)]
    const bodyTemplate = bodyTemplates[Math.floor(Math.random() * bodyTemplates.length)]
    const createdAt = randomDatetime(14)

    items.push({
      id: `status-${i + 1}`,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      teamId: team.id,
      teamName: team.name,
      project,
      status,
      body: bodyTemplate.replace('{project}', project),
      blockers:
        status === 'blocked'
          ? blockerTemplates[Math.floor(Math.random() * blockerTemplates.length)]
          : null,
      statusDate: randomDate(14),
      createdAt,
      updatedAt: createdAt,
    })
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

let statusStore = generateStatuses()

// ─── Helpers ───

function simulateDelay() {
  return delay(200 + Math.random() * 400)
}

function maybeError() {
  return Math.random() < 0.05
}

function uuid() {
  return crypto.randomUUID()
}

// ─── Handlers ───

const handlers = [
  // GET /api/statuses — paginated list
  http.get('/api/statuses', async ({ request }) => {
    await simulateDelay()
    if (maybeError()) {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? 10)))
    const statusFilter = url.searchParams.get('status')
    const teamFilter = url.searchParams.get('team')
    const searchFilter = url.searchParams.get('search')?.toLowerCase()

    let filtered = [...statusStore]

    if (statusFilter) {
      filtered = filtered.filter((s) => s.status === statusFilter)
    }
    if (teamFilter) {
      filtered = filtered.filter((s) => s.teamId === teamFilter)
    }
    if (searchFilter) {
      filtered = filtered.filter(
        (s) =>
          s.body.toLowerCase().includes(searchFilter) ||
          s.authorName.toLowerCase().includes(searchFilter),
      )
    }

    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const data = filtered.slice(start, start + limit)

    return HttpResponse.json({
      data,
      pagination: { page, limit, total, totalPages },
    })
  }),

  // GET /api/statuses/:id — single status
  http.get('/api/statuses/:id', async ({ params }) => {
    await simulateDelay()
    if (maybeError()) {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const status = statusStore.find((s) => s.id === params.id)
    if (!status) {
      return HttpResponse.json({ error: 'Status not found' }, { status: 404 })
    }
    return HttpResponse.json(status)
  }),

  // POST /api/statuses — create
  http.post('/api/statuses', async ({ request }) => {
    await simulateDelay()
    if (maybeError()) {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const details: Record<string, string> = {}

    if (!body.project || typeof body.project !== 'string') {
      details.project = 'Project is required'
    }
    if (
      !body.body ||
      typeof body.body !== 'string' ||
      body.body.length < 1 ||
      body.body.length > 500
    ) {
      details.body = 'Body must be between 1 and 500 characters'
    }
    if (!body.status || !statuses.includes(body.status as StatusUpdate['status'])) {
      details.status = 'Status must be one of: on_track, blocked, needs_review, done'
    }
    if (!body.teamId || typeof body.teamId !== 'string') {
      details.teamId = 'Team is required'
    }
    if (!body.statusDate || typeof body.statusDate !== 'string') {
      details.statusDate = 'Status date is required'
    }

    if (Object.keys(details).length > 0) {
      return HttpResponse.json({ error: 'Validation failed', details }, { status: 400 })
    }

    const author = authors[Math.floor(Math.random() * authors.length)]
    const team = teams.find((t) => t.id === body.teamId)!
    const now = new Date().toISOString()

    const newStatus: StatusUpdate = {
      id: uuid(),
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      teamId: team.id,
      teamName: team.name,
      project: body.project as string,
      status: body.status as StatusUpdate['status'],
      body: body.body as string,
      blockers: (body.blockers as string) ?? null,
      statusDate: body.statusDate as string,
      createdAt: now,
      updatedAt: now,
    }

    statusStore = [newStatus, ...statusStore]
    return HttpResponse.json(newStatus, { status: 201 })
  }),

  // PUT /api/statuses/:id — update
  http.put('/api/statuses/:id', async ({ params, request }) => {
    await simulateDelay()
    if (maybeError()) {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const index = statusStore.findIndex((s) => s.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Status not found' }, { status: 404 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const updated: StatusUpdate = {
      ...statusStore[index],
      ...(body.project != null && { project: body.project as string }),
      ...(body.status != null && { status: body.status as StatusUpdate['status'] }),
      ...(body.body != null && { body: body.body as string }),
      ...(body.blockers !== undefined && { blockers: (body.blockers as string) ?? null }),
      ...(body.statusDate != null && { statusDate: body.statusDate as string }),
      ...(body.teamId != null && {
        teamId: body.teamId as string,
        teamName: teams.find((t) => t.id === body.teamId)?.name ?? statusStore[index].teamName,
      }),
      updatedAt: new Date().toISOString(),
    }

    statusStore[index] = updated
    return HttpResponse.json(updated)
  }),

  // DELETE /api/statuses/:id
  http.delete('/api/statuses/:id', async ({ params }) => {
    await simulateDelay()
    if (maybeError()) {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const index = statusStore.findIndex((s) => s.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Status not found' }, { status: 404 })
    }

    statusStore.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // GET /api/teams
  http.get('/api/teams', async () => {
    await simulateDelay()
    if (maybeError()) {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return HttpResponse.json(teams)
  }),

  // GET /api/team-summary
  http.get('/api/team-summary', async () => {
    await simulateDelay()
    if (maybeError()) {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const thisWeek = statusStore.filter((s) => new Date(s.createdAt) >= oneWeekAgo)

    const members = authors.map((author) => {
      const authorStatuses = statusStore
        .filter((s) => s.authorId === author.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      const team = teams.find((t) => t.id === author.teamId)!

      return {
        id: author.id,
        name: author.name,
        teamName: team.name,
        lastUpdate: authorStatuses[0]?.createdAt ?? null,
        lastStatus: authorStatuses[0]?.status ?? null,
      }
    })

    return HttpResponse.json({
      totalUpdatesThisWeek: thisWeek.length,
      onTrackCount: thisWeek.filter((s) => s.status === 'on_track').length,
      blockedCount: thisWeek.filter((s) => s.status === 'blocked').length,
      needsReviewCount: thisWeek.filter((s) => s.status === 'needs_review').length,
      members,
    })
  }),
]

export const worker = setupWorker(...handlers)
