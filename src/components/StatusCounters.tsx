import type { StatusCounts } from '../types/client'
import { STATUSES } from '../constants/statuses'

interface StatusCountersProps {
  counts: StatusCounts
}

export function StatusCounters({ counts }: StatusCountersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATUSES.map((status) => (
        <div
          key={status.value}
          className={`rounded-xl border p-4 ${status.bg} ${status.border}`}
        >
          <p className={`text-2xl font-bold ${status.color}`}>
            {counts[status.value]}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {status.label}
          </p>
        </div>
      ))}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-2xl font-bold text-navy-900">{counts.total}</p>
        <p className="mt-1 text-sm font-medium text-slate-600">Всего клиентов</p>
      </div>
    </div>
  )
}
