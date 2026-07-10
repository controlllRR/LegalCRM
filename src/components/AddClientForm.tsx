import { useState, type FormEvent } from 'react'
import type { ClientStatus } from '../types/client'
import { STATUSES, defaultDeadline } from '../constants/statuses'
import { formatPhone, validatePhone } from '../lib/clients'

interface AddClientFormProps {
  onSubmit: (data: {
    name: string
    phone: string
    status: ClientStatus
    deadline?: string
    notes?: string
  }) => Promise<unknown>
  onClose: () => void
}

export function AddClientForm({ onSubmit, onClose }: AddClientFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<ClientStatus>('new')
  const [deadline, setDeadline] = useState(defaultDeadline())
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const next: { name?: string; phone?: string } = {}
    if (name.trim().length < 2) next.name = 'Введите имя (минимум 2 символа)'
    if (!validatePhone(phone)) next.phone = 'Введите корректный номер телефона'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({
        name: name.trim(),
        phone: formatPhone(phone),
        status,
        deadline,
        notes: notes.trim() || undefined,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-900">Новый клиент</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Имя клиента</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
              autoFocus
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="+7 (999) 123-45-67"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Статус</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Дедлайн</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Суть дела</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Краткое описание..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="flex-1 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60">
              {loading ? 'Сохранение...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
