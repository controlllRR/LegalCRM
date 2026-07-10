import { useState } from 'react'
import type { Client } from '../types/client'
import type { Activity } from '../types/activity'
import { STATUS_MAP } from '../constants/statuses'
import { DeadlineBadge } from './DeadlineBadge'
import { generateClientMessage, whatsAppLink } from '../lib/messageTemplate'

interface ClientDetailPanelProps {
  client: Client
  timeline: Activity[]
  onClose: () => void
  onUpdate: (patch: Partial<Pick<Client, 'notes' | 'deadline'>>) => void
}

export function ClientDetailPanel({
  client,
  timeline,
  onClose,
  onUpdate,
}: ClientDetailPanelProps) {
  const [notes, setNotes] = useState(client.notes ?? '')
  const [deadline, setDeadline] = useState(client.deadline ?? '')
  const [copied, setCopied] = useState(false)

  const meta = STATUS_MAP[client.status]
  const message = generateClientMessage(client)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onUpdate({ notes, deadline: deadline || undefined })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-navy-950/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-start justify-between">
            <div>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg} ${meta.color}`}
              >
                {meta.label}
              </span>
              <h2 className="mt-2 text-lg font-semibold text-navy-900">
                {client.name}
              </h2>
              <p className="text-sm text-slate-500">{client.phone}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3">
            <DeadlineBadge deadline={client.deadline} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Дедлайн
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Заметки по делу
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Суть дела, ключевые детали..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-navy-900 py-2 text-sm font-medium text-white hover:bg-navy-800"
          >
            Сохранить
          </button>

          <div className="rounded-xl border border-gold-400/30 bg-gold-400/5 p-4">
            <h3 className="text-sm font-semibold text-navy-900">
              Сообщение клиенту
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Готовый шаблон по статусу дела — скопируйте или отправьте в WhatsApp
            </p>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-slate-700 leading-relaxed border border-slate-100">
              {message}
            </pre>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 rounded-lg border border-slate-300 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {copied ? 'Скопировано ✓' : 'Копировать'}
              </button>
              <a
                href={whatsAppLink(client.phone, message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-center text-xs font-medium text-white hover:bg-emerald-700"
              >
                WhatsApp →
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              История дела
            </h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-slate-400">Пока нет записей</p>
            ) : (
              <div className="space-y-3">
                {timeline.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-navy-300" />
                    <div>
                      <p className="text-sm text-slate-700">{item.message}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
