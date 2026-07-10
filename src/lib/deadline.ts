export function isOverdue(deadline?: string): boolean {
  if (!deadline) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(deadline + 'T00:00:00')
  return d < today
}

export function isToday(deadline?: string): boolean {
  if (!deadline) return false
  const today = new Date().toISOString().slice(0, 10)
  return deadline === today
}

export function isSoon(deadline?: string): boolean {
  if (!deadline || isOverdue(deadline) || isToday(deadline)) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(deadline + 'T00:00:00')
  const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  return diff <= 3
}

export function formatDeadline(deadline: string): string {
  return new Date(deadline + 'T00:00:00').toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
}

export function defaultDeadline(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}
