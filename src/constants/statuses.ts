import type { ClientStatus } from '../types/client'

export const STATUSES: {
  value: ClientStatus
  label: string
  color: string
  bg: string
  border: string
}[] = [
  {
    value: 'new',
    label: 'Новый',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    value: 'in_progress',
    label: 'В работе',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    value: 'closed',
    label: 'Закрыт',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
]

export const STATUS_MAP = Object.fromEntries(
  STATUSES.map((s) => [s.value, s])
) as Record<ClientStatus, (typeof STATUSES)[number]>

export const STORAGE_KEY = 'legalcrm-clients'

export const DEMO_CLIENTS = [
  {
    name: 'Иванов Петр Сергеевич',
    phone: '+7 (916) 123-45-67',
    status: 'in_progress' as ClientStatus,
  },
  {
    name: 'Смирнова Анна Владимировна',
    phone: '+7 (903) 987-65-43',
    status: 'new' as ClientStatus,
  },
  {
    name: 'ООО «СтройКом»',
    phone: '+7 (495) 555-00-11',
    status: 'closed' as ClientStatus,
  },
]
