import { sendToTelegram } from '../lib/telegram'

export default async function handler(req: {
  method?: string
  body?: { text?: string }
}, res: {
  status: (code: number) => { json: (data: unknown) => void }
}) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  const { text } = req.body ?? {}

  if (!text) {
    return res.status(400).json({ error: 'Missing text' })
  }

  const result = await sendToTelegram(text, token ?? '', chatId ?? '')

  if (!result.ok) {
    return res.status(503).json({ error: result.error })
  }

  return res.status(200).json({ ok: true })
}
