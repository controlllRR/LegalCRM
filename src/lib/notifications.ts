import type { Client, ClientStatus } from '../types/client'
import { STATUS_MAP } from '../constants/statuses'

async function sendTelegramMessage(text: string): Promise<boolean> {
  const webhookUrl =
    import.meta.env.VITE_NOTIFY_WEBHOOK_URL || '/api/notify'

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    return response.ok
  } catch (error) {
    console.error('[LegalCRM] Ошибка отправки уведомления:', error)
    return false
  }
}

export async function notifyNewClient(client: Client): Promise<boolean> {
  const statusLabel = STATUS_MAP[client.status].label
  const text = [
    '🆕 Новый клиент в LegalCRM',
    '',
    `👤 ${client.name}`,
    `📞 ${client.phone}`,
    `📋 Статус: ${statusLabel}`,
    '',
    `🕐 ${new Date(client.createdAt).toLocaleString('ru-RU')}`,
  ].join('\n')

  return sendTelegramMessage(text)
}

export async function notifyStatusChange(
  client: Client,
  previousStatus: ClientStatus
): Promise<boolean> {
  const from = STATUS_MAP[previousStatus].label
  const to = STATUS_MAP[client.status].label
  const text = [
    '🔄 Изменение статуса дела',
    '',
    `👤 ${client.name}`,
    `📞 ${client.phone}`,
    `📋 ${from} → ${to}`,
    '',
    `🕐 ${new Date().toLocaleString('ru-RU')}`,
  ].join('\n')

  return sendTelegramMessage(text)
}
