import type { Client } from '../types/client'
import { isOverdue, isToday, isSoon, formatDeadline } from '../lib/deadline'

export function DeadlineBadge({ deadline }: { deadline?: string }) {
  if (!deadline) return null

  if (isOverdue(deadline)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Просрочено · {formatDeadline(deadline)}
      </span>
    )
  }

  if (isToday(deadline)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
        Сегодня
      </span>
    )
  }

  if (isSoon(deadline)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        {formatDeadline(deadline)}
      </span>
    )
  }

  return (
    <span className="text-xs text-slate-400">{formatDeadline(deadline)}</span>
  )
}

export function countUrgent(clients: Client[]) {
  const active = clients.filter((c) => c.status !== 'closed')
  return {
    overdue: active.filter((c) => isOverdue(c.deadline)).length,
    today: active.filter((c) => isToday(c.deadline)).length,
    soon: active.filter((c) => isSoon(c.deadline)).length,
  }
}
