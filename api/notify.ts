import type { VercelRequest, VercelResponse } from '@vercel/node'

async function sendToTelegram(
  text: string,
  token: string,
  chatId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!token) {
    return { ok: false, error: 'Не указан TELEGRAM_BOT_TOKEN в Vercel' }
  }
  if (!chatId) {
    return {
      ok: false,
      error: 'Не указан TELEGRAM_CHAT_ID в Vercel',
    }
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  )

  if (!response.ok) {
    const body = await response.text()
    if (body.includes('chat not found') || body.includes("can't initiate")) {
      return {
        ok: false,
        error: 'Нажмите /start у своего бота в Telegram',
      }
    }
    return { ok: false, error: body }
  }

  return { ok: true }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
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
    const result = await sendToTelegram(
      text,
      process.env.TELEGRAM_BOT_TOKEN ?? '',
      process.env.TELEGRAM_CHAT_ID ?? ''
    )

    if (!result.ok) {
      return res.status(503).json({ error: result.error })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('[notify]', error)
    return res.status(500).json({ error: String(error) })
  }
}
