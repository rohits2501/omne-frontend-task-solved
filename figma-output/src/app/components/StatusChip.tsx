import { StatusCategory } from '../data/mockData'

interface StatusChipProps {
  status: StatusCategory
}

export function StatusChip({ status }: StatusChipProps) {
  const styles = {
    'On Track': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Blocked: 'bg-red-100 text-red-700 border-red-200',
    'Needs Review': 'bg-amber-100 text-amber-700 border-amber-200',
    Done: 'bg-blue-100 text-blue-700 border-blue-200',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${styles[status]}`}
    >
      {status}
    </span>
  )
}
