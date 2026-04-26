import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

export async function sendTelegramMessage(chatId: string | number, text: string) {
  if (!BOT_TOKEN) return false
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function notifyAdmin(text: string) {
  if (!ADMIN_CHAT_ID) return false
  return sendTelegramMessage(ADMIN_CHAT_ID, text)
}

// Webhook handler for bot commands
export async function POST(req: NextRequest) {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'Bot token yo\'q' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = message.chat?.id
    const text: string = message.text || ''
    const firstName = message.from?.first_name || 'Foydalanuvchi'

    let reply = ''

    if (text.startsWith('/start')) {
      reply = `🎓 <b>Skill-Bridge Bot ga xush kelibsiz!</b>\n\n` +
        `Salom, ${firstName}! Bu bot Skill-Bridge platformasi bildirishnomalari uchun.\n\n` +
        `📋 <b>Mavjud buyruqlar:</b>\n` +
        `/start — Botni ishga tushirish\n` +
        `/help — Yordam\n` +
        `/status — Platforma statistikasi`
    } else if (text.startsWith('/help')) {
      reply = `ℹ️ <b>Yordam</b>\n\n` +
        `Bu bot Skill-Bridge platformasida buyurtmalar, vazifalar va boshqa yangiliklar haqida bildirishnomalar yuboradi.\n\n` +
        `🌐 Platform: <a href="https://texnikum-platform.vercel.app">skill-bridge.uz</a>`
    } else if (text.startsWith('/status')) {
      reply = `📊 <b>Platform ishlayapti ✅</b>\n\n` +
        `⏰ Vaqt: ${new Date().toLocaleString('uz-UZ')}`
    } else {
      reply = `Noma'lum buyruq. /help yozing`
    }

    if (reply) {
      await sendTelegramMessage(chatId, reply)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Xato' }, { status: 500 })
  }
}

// Setup webhook
export async function GET(req: NextRequest) {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN muhit o\'zgaruvchisi yo\'q' })
  }

  const host = req.headers.get('host') || req.nextUrl.host
  const webhookUrl = `https://${host}/api/telegram`

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl })
  })

  const data = await res.json()
  return NextResponse.json({
    message: 'Webhook sozlandi',
    webhookUrl,
    result: data
  })
}
