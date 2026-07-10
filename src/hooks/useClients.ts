import { useCallback, useEffect, useState } from 'react'
import type { Client, ClientStatus, StatusCounts } from '../types/client'
import type { Activity } from '../types/activity'
import {
  addClient as addClientToStorage,
  countByStatus,
  deleteClient as deleteClientFromStorage,
  getClients,
  updateClient as updateClientInStorage,
  updateClientStatus as updateStatusInStorage,
} from '../lib/clients'
import {
  getActivities,
  getClientActivities,
  logActivity,
} from '../lib/activity'
import { notifyNewClient, notifyStatusChange } from '../lib/notifications'
import { STATUS_MAP } from '../constants/statuses'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [counts, setCounts] = useState<StatusCounts>({
    new: 0,
    in_progress: 0,
    closed: 0,
    total: 0,
  })
  const [notification, setNotification] = useState<string | null>(null)

  const refresh = useCallback(() => {
    const data = getClients()
    setClients(data)
    setCounts(countByStatus(data))
    setActivities(getActivities())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }

  const addClient = async (
    data: Pick<Client, 'name' | 'phone' | 'status' | 'deadline' | 'notes'>
  ) => {
    const client = addClientToStorage(data)
    logActivity(
      client.id,
      client.name,
      'created',
      `Добавлен клиент «${client.name}»`
    )
    refresh()
    const result = await notifyNewClient(client)
    showNotification(
      result.ok
        ? `Клиент «${client.name}» добавлен. Уведомление в Telegram.`
        : `Клиент «${client.name}» добавлен. Telegram: ${result.error}`
    )
    return client
  }

  const updateStatus = async (id: string, status: ClientStatus) => {
    const prev = clients.find((c) => c.id === id)
    const updated = updateStatusInStorage(id, status)
    if (!updated || !prev || prev.status === status) return null

    logActivity(
      id,
      updated.name,
      'status_changed',
      `Статус: ${STATUS_MAP[prev.status].label} → ${STATUS_MAP[status].label}`
    )
    refresh()
    const result = await notifyStatusChange(updated, prev.status)
    showNotification(
      result.ok
        ? `«${updated.name}» → ${STATUS_MAP[status].label}. Telegram ✓`
        : `Статус обновлён. Telegram: ${result.error}`
    )
    return updated
  }

  const updateClient = (
    id: string,
    patch: Partial<Pick<Client, 'notes' | 'deadline'>>
  ) => {
    const prev = clients.find((c) => c.id === id)
    const updated = updateClientInStorage(id, patch)
    if (!updated || !prev) return null

    if (patch.notes !== undefined && patch.notes !== prev.notes) {
      logActivity(id, updated.name, 'note_updated', 'Обновлены заметки по делу')
    }
    if (patch.deadline !== undefined && patch.deadline !== prev.deadline) {
      logActivity(
        id,
        updated.name,
        'deadline_set',
        `Дедлайн: ${patch.deadline}`
      )
    }
    refresh()
    showNotification('Дело обновлено.')
    return updated
  }

  const deleteClient = (id: string) => {
    deleteClientFromStorage(id)
    refresh()
    showNotification('Клиент удалён.')
  }

  const getTimeline = (clientId: string) => getClientActivities(clientId)

  return {
    clients,
    counts,
    activities,
    notification,
    addClient,
    updateStatus,
    updateClient,
    deleteClient,
    getTimeline,
  }
}
