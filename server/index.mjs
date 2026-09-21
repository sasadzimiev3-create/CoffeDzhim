import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const DATA_DIR = path.join(ROOT, 'server', 'data')
const STORE_PATH = path.join(DATA_DIR, 'store.json')

const TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  '8601211597:AAHwRuHhYZieErptyjuFoT_SI6pttXBEhUM'
const PASSWORD = process.env.BOT_PASSWORD || '1234'
const PORT = Number(process.env.PORT || 8787)
const HOST = process.env.HOST || '127.0.0.1'
const TIME_ZONE = 'Europe/Moscow'

const API = `https://api.telegram.org/bot${TOKEN}`

const NAV = {
  leads: '📋 Заявки',
  fresh: '🆕 Новые',
  work: '📂 В работе',
  contacts: '📞 Контакты',
  help: 'ℹ️ Помощь',
  exit: '🚪 Выйти',
}

const SOURCE_LABEL = {
  service: 'Сервис / обслуживание',
  contacts: 'Контакты',
}

const STATUS_LABEL = {
  new: '🆕 Новая',
  in_progress: '📂 В работе',
  done: '✅ Готово',
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
}

/** @type {{ offset: number, subscribers: Subscriber[], leads: Lead[] }} */
let store = { offset: 0, subscribers: [], leads: [] }
let running = true
const hits = new Map()

/**
 * @typedef {{ chatId: number, username?: string, firstName?: string, authorizedAt: string }} Subscriber
 * @typedef {{
 *   id: number,
 *   createdAt: string,
 *   source: 'service' | 'contacts',
 *   name: string,
 *   phone: string,
 *   contact: string,
 *   comment: string,
 *   serviceType: string,
 *   status: 'new' | 'in_progress' | 'done',
 * }} Lead
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function clip(value, max) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function digitsPhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('8')) return `7${digits.slice(1)}`
  return digits
}

function formatWhen(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatShort(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function navKeyboard() {
  return {
    keyboard: [
      [{ text: NAV.leads }],
      [{ text: NAV.fresh }, { text: NAV.work }],
      [{ text: NAV.contacts }, { text: NAV.help }],
      [{ text: NAV.exit }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  }
}

function hideKeyboard() {
  return { remove_keyboard: true }
}

function isAuthorized(chatId) {
  return store.subscribers.some((item) => item.chatId === chatId)
}

function findLead(id) {
  return store.leads.find((item) => item.id === Number(id))
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

function tooMany(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((time) => now - time < 60 * 60 * 1000)
  if (recent.length >= 12) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

async function loadStore() {
  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    store = {
      offset: Number(parsed.offset) || 0,
      subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
    }
  } catch {
    store = { offset: 0, subscribers: [], leads: [] }
  }
}

async function saveStore() {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2))
}

async function telegram(method, payload = {}) {
  const response = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.description || `Telegram ${method} failed`)
  }
  return data.result
}

function contactLink(contact) {
  const value = clip(contact, 120)
  if (!value) return ''
  const telegramName = value.replace(/^@/, '')
  if (/^@?[a-zA-Z][\w]{3,31}$/.test(value.replace(/\s/g, ''))) {
    return `<a href="https://t.me/${escapeHtml(telegramName)}">@${escapeHtml(telegramName)}</a>`
  }
  if (value.includes('@') && value.includes('.')) {
    return `<a href="mailto:${escapeHtml(value)}">${escapeHtml(value)}</a>`
  }
  return escapeHtml(value)
}

function leadText(lead) {
  const lines = [
    `${STATUS_LABEL[lead.status]} · заявка №${lead.id}`,
    '',
    `<b>Раздел:</b> ${escapeHtml(SOURCE_LABEL[lead.source] || lead.source)}`,
  ]
  if (lead.serviceType) lines.push(`<b>Услуга:</b> ${escapeHtml(lead.serviceType)}`)
  lines.push(`<b>Имя:</b> ${escapeHtml(lead.name)}`)
  lines.push(`<b>Телефон:</b> <code>${escapeHtml(lead.phone)}</code>`)
  if (lead.contact) lines.push(`<b>Telegram / Email:</b> ${contactLink(lead.contact)}`)
  if (lead.comment) {
    lines.push(`<b>Комментарий:</b>`)
    lines.push(escapeHtml(lead.comment))
  }
  lines.push(`<b>Когда:</b> ${escapeHtml(formatWhen(lead.createdAt))} (МСК)`)
  return lines.join('\n')
}

function leadKeyboard(lead) {
  const rows = []
  const phone = digitsPhone(lead.phone)
  const actions = []
  if (phone.length >= 10) {
    actions.push({
      text: '💬 WhatsApp',
      url: `https://wa.me/${phone}`,
    })
  }
  const username = String(lead.contact || '').trim()
  if (/^@?[a-zA-Z][\w]{3,31}$/.test(username.replace(/\s/g, ''))) {
    actions.push({
      text: '✈️ Telegram',
      url: `https://t.me/${username.replace(/^@/, '')}`,
    })
  }
  if (actions.length) rows.push(actions)

  const statusRow = []
  if (lead.status !== 'in_progress') {
    statusRow.push({ text: '📂 В работу', callback_data: `s:${lead.id}:work` })
  }
  if (lead.status !== 'done') {
    statusRow.push({ text: '✅ Готово', callback_data: `s:${lead.id}:done` })
  }
  if (lead.status !== 'new') {
    statusRow.push({ text: '🆕 Снова новая', callback_data: `s:${lead.id}:new` })
  }
  if (statusRow.length) rows.push(statusRow)
  rows.push([{ text: '📋 К заявкам', callback_data: 'nav:leads' }])
  return { inline_keyboard: rows }
}

function listLeads(status) {
  const items = store.leads
    .filter((lead) => !status || lead.status === status)
    .slice(-12)
    .reverse()
  return items
}

function listText(title, leads) {
  if (!leads.length) {
    return `${title}\n\nПока пусто. Как только клиент оставит заявку на сайте, она появится здесь.`
  }
  const lines = [title, '']
  for (const lead of leads) {
    lines.push(
      `${STATUS_LABEL[lead.status]} <b>№${lead.id}</b> · ${escapeHtml(lead.name)} · ${escapeHtml(lead.phone)} · ${escapeHtml(formatShort(lead.createdAt))}`,
    )
  }
  lines.push('', 'Откройте заявку кнопкой ниже.')
  return lines.join('\n')
}

function listKeyboard(leads) {
  const rows = leads.map((lead) => [
    {
      text: `${lead.status === 'done' ? '✅' : lead.status === 'in_progress' ? '📂' : '🆕'} №${lead.id} · ${lead.name}`,
      callback_data: `o:${lead.id}`,
    },
  ])
  return { inline_keyboard: rows }
}

async function send(chatId, text, extra = {}) {
  return telegram('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...extra,
  })
}

async function answer(callbackQueryId, text) {
  await telegram('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
  })
}

const HELP_TEXT = [
  '<b>CoffeDzhim — панель менеджера</b>',
  '',
  'Новые заявки с сайта приходят сюда сразу, с данными клиента и временем.',
  '',
  `${NAV.leads} — все обращения`,
  `${NAV.fresh} — ещё не взятые в работу`,
  `${NAV.work} — текущие`,
  `${NAV.contacts} — телефон и почта компании`,
  `${NAV.exit} — отключить уведомления`,
].join('\n')

const CONTACTS_TEXT = [
  '<b>Контакты CoffeDzhim</b>',
  '',
  '📞 <a href="tel:+79522839932">+7 952 283-99-32</a>',
  '✉️ <a href="mailto:dbr1994@yandex.ru">dbr1994@yandex.ru</a>',
  '💬 <a href="https://wa.me/79522839932">WhatsApp</a>',
].join('\n')

async function authorize(from) {
  const existing = store.subscribers.find((item) => item.chatId === from.id)
  if (existing) {
    existing.username = from.username
    existing.firstName = from.first_name
    return false
  }
  store.subscribers.push({
    chatId: from.id,
    username: from.username,
    firstName: from.first_name,
    authorizedAt: new Date().toISOString(),
  })
  await saveStore()
  return true
}

async function revoke(chatId) {
  store.subscribers = store.subscribers.filter((item) => item.chatId !== chatId)
  await saveStore()
}

async function handleAuthorizedMessage(msg) {
  const chatId = msg.chat.id
  const text = String(msg.text || '').trim()

  if (text === NAV.leads || text === '/leads') {
    const leads = listLeads()
    await send(chatId, listText('<b>Все заявки</b>', leads), {
      reply_markup: leads.length ? listKeyboard(leads) : navKeyboard(),
    })
    return
  }
  if (text === NAV.fresh) {
    const leads = listLeads('new')
    await send(chatId, listText('<b>Новые заявки</b>', leads), {
      reply_markup: leads.length ? listKeyboard(leads) : navKeyboard(),
    })
    return
  }
  if (text === NAV.work) {
    const leads = listLeads('in_progress')
    await send(chatId, listText('<b>Заявки в работе</b>', leads), {
      reply_markup: leads.length ? listKeyboard(leads) : navKeyboard(),
    })
    return
  }
  if (text === NAV.contacts) {
    await send(chatId, CONTACTS_TEXT, { reply_markup: navKeyboard() })
    return
  }
  if (text === NAV.help || text === '/help' || text === '/start') {
    await send(chatId, HELP_TEXT, { reply_markup: navKeyboard() })
    return
  }
  if (text === NAV.exit) {
    await revoke(chatId)
    await send(
      chatId,
      'Уведомления выключены.\nЧтобы снова открыть панель, введите пароль <code>1234</code>.',
      { reply_markup: hideKeyboard() },
    )
    return
  }
  if (text === PASSWORD) {
    await send(chatId, 'Вы уже в панели менеджера.', { reply_markup: navKeyboard() })
    return
  }

  await send(
    chatId,
    'Используйте кнопки панели ниже — так быстрее открыть заявки и контакты.',
    { reply_markup: navKeyboard() },
  )
}

async function handleMessage(msg) {
  if (!msg?.chat || msg.chat.type !== 'private') return
  const chatId = msg.chat.id
  const text = String(msg.text || '').trim()

  if (!isAuthorized(chatId)) {
    if (text === PASSWORD) {
      await authorize(msg.from)
      await send(
        chatId,
        [
          'Доступ открыт. Это панель менеджера CoffeDzhim.',
          '',
          'Заявки с разделов «Сервис» и «Контакты» будут приходить сюда сразу — с данными клиента и временем.',
        ].join('\n'),
        { reply_markup: navKeyboard() },
      )
      return
    }
    await send(
      chatId,
      'Это бот заявок CoffeDzhim.\nВведите пароль, чтобы открыть панель менеджера.',
      { reply_markup: hideKeyboard() },
    )
    return
  }

  await handleAuthorizedMessage(msg)
}

async function handleCallback(query) {
  const chatId = query.message?.chat?.id
  if (!chatId || !isAuthorized(chatId)) {
    await answer(query.id, 'Сначала введите пароль')
    return
  }

  const data = String(query.data || '')
  if (data === 'nav:leads') {
    const leads = listLeads()
    await answer(query.id, 'Заявки')
    await send(chatId, listText('<b>Все заявки</b>', leads), {
      reply_markup: leads.length ? listKeyboard(leads) : navKeyboard(),
    })
    return
  }

  const openMatch = /^o:(\d+)$/.exec(data)
  if (openMatch) {
    const lead = findLead(openMatch[1])
    if (!lead) {
      await answer(query.id, 'Заявка не найдена')
      return
    }
    await answer(query.id, `Заявка №${lead.id}`)
    await send(chatId, leadText(lead), { reply_markup: leadKeyboard(lead) })
    return
  }

  const statusMatch = /^s:(\d+):(new|work|done)$/.exec(data)
  if (statusMatch) {
    const lead = findLead(statusMatch[1])
    if (!lead) {
      await answer(query.id, 'Заявка не найдена')
      return
    }
    const next = statusMatch[2] === 'work' ? 'in_progress' : statusMatch[2]
    lead.status = next
    await saveStore()
    await answer(query.id, `Статус: ${STATUS_LABEL[next]}`)
    try {
      await telegram('editMessageText', {
        chat_id: chatId,
        message_id: query.message.message_id,
        text: leadText(lead),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: leadKeyboard(lead),
      })
    } catch {
      await send(chatId, leadText(lead), { reply_markup: leadKeyboard(lead) })
    }
  }
}

async function notifyLead(lead) {
  if (!store.subscribers.length) {
    console.log(`Lead #${lead.id} saved, no managers connected yet`)
    return
  }
  for (const subscriber of [...store.subscribers]) {
    try {
      await send(subscriber.chatId, leadText(lead), {
        reply_markup: leadKeyboard(lead),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`Notify ${subscriber.chatId} failed: ${message}`)
      if (/blocked|chat not found|forbidden/i.test(message)) {
        store.subscribers = store.subscribers.filter(
          (item) => item.chatId !== subscriber.chatId,
        )
        await saveStore()
      }
    }
  }
}

function parseLead(body) {
  const source = body.source === 'contacts' ? 'contacts' : 'service'
  const name = clip(body.name, 80)
  const phone = clip(body.phone, 40)
  const contact = clip(body.contact, 120)
  const comment = String(body.comment ?? '')
    .replace(/\r/g, '')
    .trim()
    .slice(0, 1000)
  const serviceType = clip(body.serviceType, 80)

  if (name.length < 2) return { error: 'Укажите имя' }
  if (digitsPhone(phone).length < 10) return { error: 'Укажите телефон' }

  return {
    lead: {
      id: (store.leads.at(-1)?.id || 0) + 1,
      createdAt: new Date().toISOString(),
      source,
      name,
      phone,
      contact,
      comment,
      serviceType: source === 'service' ? serviceType : '',
      status: 'new',
    },
  }
}

function sendJson(res, status, payload) {
  const body = Buffer.from(JSON.stringify(payload))
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    Connection: 'close',
  })
  res.end(body)
}

function readBody(req, limit = 32_000) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(new Error('too_large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function handleLeadRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Метод не поддерживается' })
    return
  }
  if (tooMany(clientIp(req))) {
    sendJson(res, 429, { error: 'Слишком много заявок. Позвоните нам напрямую.' })
    return
  }

  let payload
  try {
    payload = JSON.parse(await readBody(req))
  } catch {
    sendJson(res, 400, { error: 'Не удалось прочитать заявку' })
    return
  }

  const parsed = parseLead(payload)
  if (parsed.error) {
    sendJson(res, 400, { error: parsed.error })
    return
  }

  store.leads.push(parsed.lead)
  if (store.leads.length > 500) store.leads = store.leads.slice(-500)
  await saveStore()
  await notifyLead(parsed.lead)
  sendJson(res, 200, { ok: true, id: parsed.lead.id })
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  const rel = urlPath === '/' ? '/index.html' : urlPath
  const file = path.normalize(path.join(DIST, rel))
  if (!file.startsWith(DIST)) {
    res.writeHead(403)
    res.end()
    return
  }
  try {
    const data = await readFile(file)
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Content-Length': data.length,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
      Connection: 'close',
    })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', Connection: 'close' })
    res.end('Not found')
  }
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  try {
    if (urlPath === '/api/leads') {
      await handleLeadRequest(req, res)
      return
    }
    if (urlPath === '/api/health') {
      sendJson(res, 200, {
        ok: true,
        bot: 'coffedzhimbot',
        managers: store.subscribers.length,
        leads: store.leads.length,
      })
      return
    }
    await serveStatic(req, res)
  } catch (error) {
    console.error(error)
    if (!res.headersSent) sendJson(res, 500, { error: 'Сервер не смог обработать заявку' })
  }
})

server.keepAliveTimeout = 0
server.headersTimeout = 10_000

async function pollTelegram() {
  try {
    await telegram('deleteWebhook', { drop_pending_updates: false })
    await telegram('setMyCommands', {
      commands: [
        { command: 'start', description: 'Открыть панель менеджера' },
        { command: 'help', description: 'Как пользоваться ботом' },
      ],
    })
    const me = await telegram('getMe')
    console.log(`Telegram bot @${me.username} is polling`)
  } catch (error) {
    console.error('Telegram init failed', error)
  }

  while (running) {
    try {
      const updates = await telegram('getUpdates', {
        offset: store.offset,
        timeout: 25,
        allowed_updates: ['message', 'callback_query'],
      })
      for (const update of updates) {
        store.offset = update.update_id + 1
        try {
          if (update.message) await handleMessage(update.message)
          if (update.callback_query) await handleCallback(update.callback_query)
        } catch (error) {
          console.error('Update failed', error)
        }
      }
      if (updates.length) await saveStore()
    } catch (error) {
      console.error('Polling error', error)
      await sleep(2000)
    }
  }
}

await loadStore()

server.listen(PORT, HOST, () => {
  console.log(`CoffeDzhim server on http://${HOST}:${PORT}`)
})

pollTelegram()

const shutdown = () => {
  running = false
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(0), 1500).unref()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
