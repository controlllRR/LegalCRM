import { useCallback, useEffect, useState } from 'react'
import type { Client, ClientStatus, StatusCounts } from '../types/client'
import {
  addClient as addClientToStorage,
  countByStatus,
  deleteClient as deleteClientFromStorage,
  getClients,
  updateClientStatus as updateStatusInStorage,
} from '../lib/clients'
import { notifyNewClient, notifyStatusChange } from '../lib/notifications'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
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
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 4000)
  }

  const addClient = async (data: Pick<Client, 'name' | 'phone' | 'status'>) => {
    const client = addClientToStorage(data)
    refresh()
    const sent = await notifyNewClient(client)
    showNotification(
      sent
        ? `Клиент «${client.name}» добавлен. Уведомление отправлено в Telegram.`
        : `Клиент «${client.name}» успешно добавлен.`
    )
    return client
  }

  const updateStatus = async (id: string, status: ClientStatus) => {
    const prev = clients.find((c) => c.id === id)
    const updated = updateStatusInStorage(id, status)
    if (!updated || !prev) return null

    refresh()
    const sent = await notifyStatusChange(updated, prev.status)
    showNotification(
      sent
        ? `Статус «${updated.name}» изменён. Уведомление отправлено.`
        : `Статус «${updated.name}» обновлён.`
    )
    return updated
  }

  const deleteClient = (id: string) => {
    deleteClientFromStorage(id)
    refresh()
    showNotification('Клиент удалён.')
  }

  return {
    clients,
    counts,
    notification,
    addClient,
    updateStatus,
    deleteClient,
  }
}
