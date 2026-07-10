import type { Client } from '../types/client'
import { STATUS_MAP } from '../constants/statuses'
import { formatDeadline } from './deadline'

const TEMPLATES: Record<Client['status'], string> = {
  new: `Здравствуйте, {name}!

Благодарим за обращение в нашу юридическую практику. Ваше дело зарегистрировано и находится на рассмотрении.

Мы свяжемся с вами в ближайшее время для уточнения деталей.

С уважением,
Юридическая компания`,

  in_progress: `Здравствуйте, {name}!

Информируем вас, что ваше дело находится в активной работе.

{deadline}Если у вас есть вопросы — звоните: {phone}

С уважением,
Ваш юрист`,

  closed: `Здравствуйте, {name}!

Рады сообщить, что ваше дело успешно завершено.

Благодарим за доверие! Будем рады помочь вам в будущем.

С уважением,
Юридическая компания`,
}

export function generateClientMessage(client: Client): string {
  const status = STATUS_MAP[client.status].label
  let text = TEMPLATES[client.status]
    .replace('{name}', client.name.split(' ')[0] || client.name)
    .replace('{phone}', client.phone)

  if (client.deadline && client.status === 'in_progress') {
    text = text.replace(
      '{deadline}',
      `Ориентировочный срок: ${formatDeadline(client.deadline)}.\n\n`
    )
  } else {
    text = text.replace('{deadline}', '')
  }

  return `${text}\n\n—\nСтатус дела: ${status}`
}

export function whatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
