import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnv } from 'vite'
import { sendToTelegram } from './telegram.js'

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export function createNotifyHandler(mode: string) {
  const env = loadEnv(mode, process.cwd(), '')

  return async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }

    try {
      const raw = await readBody(req)
      const { text } = JSON.parse(raw || '{}') as { text?: string }

      if (!text) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Missing text' }))
        return
      }

      const result = await sendToTelegram(
        text,
        env.TELEGRAM_BOT_TOKEN,
        env.TELEGRAM_CHAT_ID
      )

      if (!result.ok) {
        res.statusCode = 503
        res.end(JSON.stringify({ error: result.error }))
        return
      }

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true }))
    } catch (error) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: String(error) }))
    }
  }
}
