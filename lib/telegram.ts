export async function sendToTelegram(
  text: string,
  token: string,
  chatId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!token) {
    return { ok: false, error: 'Не указан TELEGRAM_BOT_TOKEN' }
  }
  if (!chatId) {
    return {
      ok: false,
      error: 'Не указан TELEGRAM_CHAT_ID — узнайте ID через @userinfobot',
    }
  }

  try {
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
      if (body.includes('chat not found')) {
        return {
          ok: false,
          error: 'Бот не может писать в этот чат. Нажмите /start у своего бота в Telegram.',
        }
      }
      return { ok: false, error: body }
    }

    return { ok: true }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}
