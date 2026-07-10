import type { VercelRequest, VercelResponse } from '@vercel/node'

const TELEGRAM_BOT_TOKEN =
  '8644747541:AAGWsQnbtdL1A-lz6HJRu6vZkRtqNxEYfYw'
const TELEGRAM_CHAT_ID = '6079681789'

async function sendToTelegram(text: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    }
  )

  if (!response.ok) {
    const body = await response.text()
    if (body.includes('chat not found') || body.includes("can't initiate")) {
      return { ok: false, error: 'Нажмите /start у своего бота в Telegram' }
    }
    return { ok: false, error: body }
  }

  return { ok: true }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const text =
    typeof req.body === 'string'
      ? (JSON.parse(req.body) as { text?: string }).text
      : (req.body as { text?: string } | undefined)?.text

  if (!text) {
    return res.status(400).json({ error: 'Missing text' })
  }

  try {
    const result = await sendToTelegram(text)
    if (!result.ok) {
      return res.status(503).json({ error: result.error })
    }
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('[notify]', error)
    return res.status(500).json({ error: String(error) })
  }
}
