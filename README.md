# LegalCRM — Прототип CRM для юристов

Рабочий прототип дашборда для управления клиентами юридической практики.

## Демо

**Живая ссылка:** _(добавьте после деплоя на Vercel)_

## Функциональность

- Таблица клиентов с фильтрацией по статусу
- Добавление клиента (имя, телефон, статус дела)
- Изменение статуса: «Новый» → «В работе» → «Закрыт»
- Счётчики клиентов по каждому статусу
- **Бонус:** Telegram-уведомления при добавлении клиента и смене статуса

## Стек

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS 4** — стилизация
- **localStorage** — хранение данных (без бэкенда для MVP)
- **Vercel Serverless** — прокси для Telegram Bot API

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

## Деплой на Vercel

1. Загрузите репозиторий на GitHub
2. Импортируйте проект в [vercel.com](https://vercel.com)
3. Добавьте переменные окружения:
   - `TELEGRAM_BOT_TOKEN` — токен бота от [@BotFather](https://t.me/BotFather)
   - `TELEGRAM_CHAT_ID` — ваш chat ID
   - `VITE_NOTIFY_WEBHOOK_URL` = `https://your-app.vercel.app/api/notify`
4. Deploy

## Настройка Telegram-уведомлений

### Шаг 1 — Токен бота (уже есть)

Токен от [@BotFather](https://t.me/BotFather) хранится в `.env.local` (локально) и в настройках Vercel (на проде).

> ⚠️ **Важно:** ты отправил токен в чат. Если репозиторий или переписка станут публичными — зайди в BotFather → `/revoke` и получи новый токен.

### Шаг 2 — Узнать TELEGRAM_CHAT_ID

Это **твой личный числовой ID в Telegram** — куда бот будет слать уведомления.

1. Открой Telegram
2. Найди бота **@userinfobot** (или перейди: https://t.me/userinfobot)
3. Нажми **Start** / **Запустить**
4. Бот ответит примерно так:
   ```
   Id: 123456789
   First name: Антон
   ...
   ```
5. Число после `Id:` — это и есть **TELEGRAM_CHAT_ID**. Например: `123456789`

Вставь его в `.env.local`:
```
TELEGRAM_CHAT_ID=123456789
```

### Шаг 3 — Напиши своему боту /start

Обязательно открой **своего** бота (которого создал в BotFather) и нажми **Start**.  
Без этого Telegram не даст боту писать тебе.

### Шаг 4 — Проверка локально

```bash
npx vercel dev
```

Открой http://localhost:3000, добавь клиента — сообщение должно прийти в Telegram.

---

## Деплой на Vercel (пошагово)

### Вариант А — через сайт (проще)

1. **Создай репозиторий на GitHub**
   ```bash
   git add .
   git commit -m "LegalCRM prototype"
   ```
   Залей на GitHub (New repository → push).

2. Зайди на **https://vercel.com** → войди через GitHub

3. **Add New → Project** → выбери свой репозиторий `legalcrm`

4. Vercel сам определит Vite. Нажми **Deploy** (первый раз можно без переменных)

5. После деплоя зайди в проект → **Settings → Environment Variables** и добавь:

   | Имя | Значение |
   |-----|----------|
   | `TELEGRAM_BOT_TOKEN` | твой токен от BotFather |
   | `TELEGRAM_CHAT_ID` | число из @userinfobot |
   | `VITE_NOTIFY_WEBHOOK_URL` | `https://ТВОЙ-ДОМЕН.vercel.app/api/notify` |

6. **Deployments → ... → Redeploy** (чтобы подхватились переменные)

Готово — ссылка вида `https://legalcrm-xxx.vercel.app`

### Вариант Б — через терминал

```bash
npx vercel login        # откроется браузер, войди в аккаунт
npx vercel              # первый деплой (preview)
npx vercel --prod       # продакшен-ссылка
```

Переменные окружения потом добавь в Dashboard → Settings → Environment Variables → Redeploy.

---

## Лог выполнения (для проверки)

**Время:** начало — 03:47, окончание — _(указать при сдаче)_

**Что делал сам:** выбор архитектуры (React + localStorage + Vercel Functions), проектирование UX дашборда, настройка деплоя, интеграция Telegram webhook.

**Что сделал AI (Cursor):** генерация компонентов, хуков, стилей Tailwind, boilerplate Vite-проекта, README.

**Почему этот стек:** React + Vite — быстрый старт и простой деплой на Vercel; localStorage — не нужна регистрация в Firebase/Supabase для MVP; Vercel Serverless — безопасная отправка Telegram без раскрытия токена на клиенте.

## Структура

```
src/
  components/   — UI-компоненты
  hooks/        — useClients
  lib/          — работа с данными и уведомлениями
  types/        — TypeScript типы
api/
  notify.ts     — Vercel serverless для Telegram
```
