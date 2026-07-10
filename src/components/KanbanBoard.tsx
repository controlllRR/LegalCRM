import { useState } from 'react'
import type { Client, ClientStatus } from '../types/client'
import { STATUSES } from '../constants/statuses'
import { DeadlineBadge } from './DeadlineBadge'

interface KanbanBoardProps {
  clients: Client[]
  onStatusChange: (id: string, status: ClientStatus) => void
  onOpenClient: (client: Client) => void
}

export function KanbanBoard({
  clients,
  onStatusChange,
  onOpenClient,
}: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<ClientStatus | null>(null)

  const handleDrop = (status: ClientStatus) => {
    if (draggingId) {
      onStatusChange(draggingId, status)
    }
    setDraggingId(null)
    setOverColumn(null)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STATUSES.map((col) => {
        const columnClients = clients.filter((c) => c.status === col.value)
        const isOver = overColumn === col.value

        return (
          <div
            key={col.value}
            className={`rounded-xl border p-3 transition ${col.columnBg} ${col.border} ${
              isOver ? 'ring-2 ring-navy-400 ring-offset-2' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setOverColumn(col.value)
            }}
            onDragLeave={() => setOverColumn(null)}
            onDrop={(e) => {
              e.preventDefault()
              handleDrop(col.value)
            }}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h4 className={`text-sm font-semibold ${col.color}`}>
                {col.label}
              </h4>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-500">
                {columnClients.length}
              </span>
            </div>

            <div className="space-y-2 min-h-[120px]">
              {columnClients.map((client) => (
                <div
                  key={client.id}
                  draggable
                  onDragStart={() => setDraggingId(client.id)}
                  onDragEnd={() => {
                    setDraggingId(null)
                    setOverColumn(null)
                  }}
                  onClick={() => onOpenClient(client)}
                  className={`cursor-grab rounded-lg border border-white bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing ${
                    draggingId === client.id ? 'opacity-50' : ''
                  }`}
                >
                  <p className="font-medium text-slate-900 text-sm leading-tight">
                    {client.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{client.phone}</p>
                  {client.notes && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                      {client.notes}
                    </p>
                  )}
                  <div className="mt-2">
                    <DeadlineBadge deadline={client.deadline} />
                  </div>
                </div>
              ))}

              {columnClients.length === 0 && (
                <p className="py-8 text-center text-xs text-slate-400">
                  Перетащите дело сюда
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
