import type { Client, ClientStatus } from '../types/client'
import { STATUS_MAP } from '../constants/statuses'

export type NotifyResult =
  | { ok: true }
  | { ok: false; error: string }

async function sendTelegramMessage(text: string): Promise<NotifyResult> {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string
      }
      return {
        ok: false,
        error: data.error ?? `Ошибка сервера (${response.status})`,
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      error: 'API недоступен. Перезапустите npm run dev.',
    }
  }
}

export async function notifyNewClient(client: Client): Promise<NotifyResult> {
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
): Promise<NotifyResult> {
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
