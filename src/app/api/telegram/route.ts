import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://skill-bridge-ld43e14n0-yashnarbek-samiyevs-projects.vercel.app'

export async function sendTelegramMessage(chatId: string | number, text: string) {
  if (!BOT_TOKEN) return false
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
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
        `Salom, ${firstName}! Ushbu bot orqali Skill-Bridge platformasini boshqarish va bildirishnomalarni kuzatish mumkin.\n\n` +
        `📋 <b>Asosiy komandalar:</b>\n` +
        `📊 /stats — Platforma statistikasi\n` +
        `🔗 /links — Foydali havolalar\n` +
        `ℹ️ /about — Loyiha haqida\n` +
        `❓ /help — Yordam`
    } else if (text.startsWith('/stats')) {
      const userCount = await prisma.user.count()
      const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } })
      const orderCount = await prisma.order.count()
      const completedOrders = await prisma.order.count({ where: { status: 'COMPLETED' } })
      const groupCount = await prisma.group.count()

      reply = `📊 <b>Platforma Statistikasi:</b>\n\n` +
        `👥 Jami foydalanuvchilar: <b>${userCount}</b>\n` +
        `👨‍🎓 Talabalar: <b>${studentCount}</b>\n` +
        `📦 Jami buyurtmalar: <b>${orderCount}</b>\n` +
        `✅ Tugallangan ishlar: <b>${completedOrders}</b>\n` +
        `🏢 Guruhlar soni: <b>${groupCount}</b>\n\n` +
        `⏰ Yangilangan vaqt: ${new Date().toLocaleTimeString('uz-UZ')}`
    } else if (text.startsWith('/links')) {
      reply = `🔗 <b>Foydali Havolalar:</b>\n\n` +
        `🌐 <a href="${APP_URL}">Asosiy sahifa</a>\n` +
        `🏆 <a href="${APP_URL}/leaderboard">Leaderboard (Reyting)</a>\n` +
        `🔑 <a href="${APP_URL}/login">Tizimga kirish</a>\n` +
        `📝 <a href="${APP_URL}/register">Ro'yxatdan o'tish</a>`
    } else if (text.startsWith('/about')) {
      reply = `ℹ️ <b>Loyiha haqida:</b>\n\n` +
        `<b>Skill-Bridge</b> — bu texnikum talabalarini real buyurtmalar bilan bog'laydigan innovatsion platforma.\n\n` +
        `🎯 <b>Maqsad:</b> Talabalarga amaliy tajriba va daromad topish imkoniyatini yaratish.\n\n` +
        `💻 Texnologiyalar: Next.js, PostgreSQL, Prisma, Vercel.`
    } else if (text.startsWith('/help')) {
      reply = `❓ <b>Yordam bo'limi:</b>\n\n` +
        `Bot ishlamayotgan bo'lsa yoki savollaringiz bo'lsa, @yashnarsamiyev bilan bog'laning.\n\n` +
        `Barcha komandalar: /start, /stats, /links, /about`
    } else {
      reply = `Noma'lum buyruq. /help yozing.`
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
