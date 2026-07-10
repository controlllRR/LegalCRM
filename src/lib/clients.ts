import type { Client, ClientStatus, StatusCounts } from '../types/client'
import { DEMO_CLIENTS, STORAGE_KEY } from '../constants/statuses'
import { defaultDeadline } from './deadline'

function createClient(
  data: Pick<Client, 'name' | 'phone' | 'status'> & {
    deadline?: string
    notes?: string
  }
): Client {
  return {
    id: crypto.randomUUID(),
    deadline: data.deadline,
    notes: data.notes,
    ...data,
    createdAt: new Date().toISOString(),
  }
}

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Client[]
      if (parsed.length > 0) return parsed
    }
  } catch {
    /* ignore corrupt data */
  }

  const demo = DEMO_CLIENTS.map((d) => createClient(d))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo))
  return demo
}

function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
}

export function getClients(): Client[] {
  return loadClients()
}

export function addClient(
  data: Pick<Client, 'name' | 'phone' | 'status'> & {
    deadline?: string
    notes?: string
  }
): Client {
  const client = createClient({
    ...data,
    deadline: data.deadline || defaultDeadline(),
  })
  const clients = [...loadClients(), client]
  saveClients(clients)
  return client
}

export function updateClientStatus(
  id: string,
  status: ClientStatus
): Client | null {
  const clients = loadClients()
  const index = clients.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updated = { ...clients[index], status }
  clients[index] = updated
  saveClients(clients)
  return updated
}

export function updateClient(
  id: string,
  patch: Partial<Pick<Client, 'notes' | 'deadline' | 'status'>>
): Client | null {
  const clients = loadClients()
  const index = clients.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updated = { ...clients[index], ...patch }
  clients[index] = updated
  saveClients(clients)
  return updated
}

export function deleteClient(id: string): void {
  saveClients(loadClients().filter((c) => c.id !== id))
}

export function countByStatus(clients: Client[]): StatusCounts {
  return clients.reduce<StatusCounts>(
    (acc, client) => {
      acc[client.status] += 1
      acc.total += 1
      return acc
    },
    { new: 0, in_progress: 0, closed: 0, total: 0 }
  )
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''

  let normalized = digits
  if (normalized.startsWith('8') && normalized.length <= 11) {
    normalized = '7' + normalized.slice(1)
  }

  if (normalized.startsWith('7') && normalized.length <= 11) {
    const rest = normalized.slice(1)
    let result = '+7'
    if (rest.length > 0) result += ` (${rest.slice(0, 3)}`
    if (rest.length >= 3) result += ')'
    if (rest.length > 3) result += ` ${rest.slice(3, 6)}`
    if (rest.length > 6) result += `-${rest.slice(6, 8)}`
    if (rest.length > 8) result += `-${rest.slice(8, 10)}`
    return result
  }

  return value
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}
