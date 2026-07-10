import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createNotifyHandler } from './lib/notify-handler.js'

function telegramApiDev(): Plugin {
  return {
    name: 'telegram-api-dev',
    configureServer(server) {
      const handler = createNotifyHandler('development')
      server.middlewares.use('/api/notify', (req, res) => {
        void handler(req, res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), telegramApiDev()],
})
