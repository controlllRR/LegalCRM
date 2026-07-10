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

  if (!token || !chatId) {
    return res.status(503).json({ error: 'Telegram not configured' })
  }

  if (!text) {
    return res.status(400).json({ error: 'Missing text' })
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      return res.status(502).json({ error })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(500).json({ error: String(error) })
  }
}
