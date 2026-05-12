import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { STATUS_LABELS, STATUS_VALUES, type StatusValue } from '../../api/statuses'
import type { Team } from '../../api/teams'
import { Input } from '../ui/input'
import { Select, type SelectOption } from '../ui/select'

export interface StatusFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: StatusValue | null
  onStatusChange: (value: StatusValue | null) => void
  team: string | null
  onTeamChange: (value: string | null) => void
  teams: Team[] | undefined
  teamsLoading?: boolean
}

const STATUS_OPTIONS: ReadonlyArray<SelectOption<StatusValue | 'all'>> = [
  { value: 'all', label: 'All Statuses' },
  ...STATUS_VALUES.map((value) => ({ value, label: STATUS_LABELS[value] })),
] as const

export function StatusFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  team,
  onTeamChange,
  teams,
  teamsLoading,
}: StatusFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  useEffect(() => {
    if (localSearch === search) return
    const handle = setTimeout(() => onSearchChange(localSearch), 300)
    return () => clearTimeout(handle)
  }, [localSearch, search, onSearchChange])

  const teamOptions: SelectOption<string>[] = [
    { value: 'all', label: 'All Teams' },
    ...(teams ?? []).map((t) => ({ value: t.id, label: t.name })),
  ]

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle"
        />
        <Input
          type="search"
          aria-label="Search updates"
          placeholder="Search updates…"
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-3">
        <Select<StatusValue | 'all'>
          ariaLabel="Filter by status"
          value={status ?? 'all'}
          options={STATUS_OPTIONS}
          onValueChange={(value) => onStatusChange(value === 'all' || !value ? null : value)}
          className="flex-1 sm:flex-none"
        />
        <Select<string>
          ariaLabel="Filter by team"
          value={team ?? 'all'}
          options={teamOptions}
          onValueChange={(value) => onTeamChange(value === 'all' || !value ? null : value)}
          disabled={teamsLoading}
          className="flex-1 sm:flex-none"
        />
      </div>
    </div>
  )
}
