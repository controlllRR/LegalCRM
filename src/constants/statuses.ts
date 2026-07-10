import type { ClientStatus } from '../types/client'
import { defaultDeadline } from '../lib/deadline'

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const STATUSES: {
  value: ClientStatus
  label: string
  color: string
  bg: string
  border: string
  columnBg: string
}[] = [
  {
    value: 'new',
    label: 'Новый',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    columnBg: 'bg-blue-50/50',
  },
  {
    value: 'in_progress',
    label: 'В работе',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    columnBg: 'bg-amber-50/50',
  },
  {
    value: 'closed',
    label: 'Закрыт',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    columnBg: 'bg-emerald-50/50',
  },
]

export const STATUS_MAP = Object.fromEntries(
  STATUSES.map((s) => [s.value, s])
) as Record<ClientStatus, (typeof STATUSES)[number]>

export const STORAGE_KEY = 'legalcrm-clients-v2'

export const DEMO_CLIENTS = [
  {
    name: 'Иванов Петр Сергеевич',
    phone: '+7 (916) 123-45-67',
    status: 'in_progress' as ClientStatus,
    deadline: daysFromNow(2),
    notes: 'Иск о взыскании задолженности по договору подряда',
  },
  {
    name: 'Смирнова Анна Владимировна',
    phone: '+7 (903) 987-65-43',
    status: 'new' as ClientStatus,
    deadline: daysFromNow(-1),
    notes: 'Консультация по семейному праву, раздел имущества',
  },
  {
    name: 'ООО «СтройКом»',
    phone: '+7 (495) 555-00-11',
    status: 'closed' as ClientStatus,
    deadline: daysFromNow(-30),
    notes: 'Досудебное урегулирование — успешно завершено',
  },
]

export { defaultDeadline }
