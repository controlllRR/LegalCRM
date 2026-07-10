import type { Activity } from '../types/activity'

interface ActivityFeedProps {
  activities: Activity[]
}

const ICONS: Record<Activity['type'], string> = {
  created: '🆕',
  status_changed: '🔄',
  note_updated: '📝',
  deadline_set: '📅',
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-navy-900">
        Последние действия
      </h3>
      <div className="space-y-2">
        {activities.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 text-sm"
          >
            <span className="text-base leading-none">{ICONS[item.type]}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-slate-700">
                <span className="font-medium">{item.clientName}</span>
                {' — '}
                {item.message}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(item.timestamp).toLocaleString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
