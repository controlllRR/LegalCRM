import type { Client } from '../types/client'
import { countUrgent } from './DeadlineBadge'

interface DaySummaryProps {
  clients: Client[]
}

export function DaySummary({ clients }: DaySummaryProps) {
  const { overdue, today, soon } = countUrgent(clients)
  const active = clients.filter((c) => c.status !== 'closed').length

  if (overdue === 0 && today === 0 && soon === 0) return null

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-navy-900">Сводка дня</h3>
          <p className="mt-1 text-sm text-slate-600">
            {active} активных дел
            {overdue > 0 && (
              <span className="ml-2 font-medium text-red-600">
                · {overdue} просрочено
              </span>
            )}
            {today > 0 && (
              <span className="ml-2 font-medium text-orange-600">
                · {today} дедлайн сегодня
              </span>
            )}
            {soon > 0 && (
              <span className="ml-2 text-amber-600">
                · {soon} на этой неделе
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
