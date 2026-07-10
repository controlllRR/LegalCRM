import type { ViewMode } from '../types/client'

interface ViewToggleProps {
  view: ViewMode
  onChange: (view: ViewMode) => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      <button
        onClick={() => onChange('table')}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
          view === 'table'
            ? 'bg-navy-900 text-white'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        Таблица
      </button>
      <button
        onClick={() => onChange('kanban')}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
          view === 'kanban'
            ? 'bg-navy-900 text-white'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        Канбан
      </button>
    </div>
  )
}
