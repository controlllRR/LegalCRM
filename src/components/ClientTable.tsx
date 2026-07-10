import { useState } from 'react'
import type { Client, ClientStatus } from '../types/client'
import { STATUSES, STATUS_MAP } from '../constants/statuses'
import { DeadlineBadge } from './DeadlineBadge'

interface ClientTableProps {
  clients: Client[]
  onStatusChange: (id: string, status: ClientStatus) => void
  onDelete: (id: string) => void
  onOpenClient: (client: Client) => void
}

export function ClientTable({
  clients,
  onStatusChange,
  onDelete,
  onOpenClient,
}: ClientTableProps) {
  const [filter, setFilter] = useState<ClientStatus | 'all'>('all')

  const filtered =
    filter === 'all' ? clients : clients.filter((c) => c.status === filter)

  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-lg font-medium text-slate-700">Клиентов пока нет</p>
        <p className="mt-2 text-sm text-slate-500">
          Добавьте первого клиента, нажав кнопку выше
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className="text-sm text-slate-500">Фильтр:</span>
        {(['all', ...STATUSES.map((s) => s.value)] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === f
                ? 'bg-navy-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'all'
              ? `Все (${clients.length})`
              : STATUS_MAP[f].label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-4 py-3 font-semibold text-slate-700">Клиент</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Телефон</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Дедлайн</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Статус</th>
              <th className="px-4 py-3 font-semibold text-slate-700" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => {
              const meta = STATUS_MAP[client.status]
              return (
                <tr
                  key={client.id}
                  className="border-b border-slate-50 transition hover:bg-slate-50/50 cursor-pointer"
                  onClick={() => onOpenClient(client)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{client.name}</p>
                    {client.notes && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                        {client.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{client.phone}</td>
                  <td className="px-4 py-3">
                    <DeadlineBadge deadline={client.deadline} />
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={client.status}
                      onChange={(e) =>
                        onStatusChange(client.id, e.target.value as ClientStatus)
                      }
                      className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-navy-700/30 ${meta.bg} ${meta.border} ${meta.color}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        if (confirm(`Удалить клиента «${client.name}»?`)) {
                          onDelete(client.id)
                        }
                      }}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Удалить"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-slate-500">
          Нет клиентов с выбранным статусом
        </p>
      )}
    </div>
  )
}
