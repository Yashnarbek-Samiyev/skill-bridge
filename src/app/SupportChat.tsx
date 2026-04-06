'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

type Message = {
  id: number
  from: 'bot' | 'user'
  text: string
}

const FAQ_RESPONSES: { keywords: string[]; answer: Record<string, string> }[] = [
  {
    keywords: ['salom', 'hello', 'привет', 'hi', 'hey', 'assalom'],
    answer: {
      uz: "Salom! 👋 Men Skill-Bridge yordamchi botiman. Qanday yordam bera olaman?",
      ru: "Привет! 👋 Я бот-помощник Skill-Bridge. Чем я могу вам помочь?",
      en: "Hello! 👋 I'm the Skill-Bridge assistant bot. How can I help you today?"
    }
  },
  {
    keywords: ['buyurtma', 'zakazat', 'order', 'заказ', 'qanday', 'how'],
    answer: {
      uz: "Buyurtma berish uchun mijoz sifatida ro'yxatdan o'ting va 'Yangi buyurtma' tugmasini bosing.",
      ru: "Чтобы оставить заказ, зарегистрируйтесь как клиент и нажмите кнопку 'Новый заказ'.",
      en: "To place an order, please register as a client and click the 'New Order' button."
    }
  },
  {
    keywords: ['narx', 'price', 'цена', 'pullik', 'cost', 'stoimost', 'qancha'],
    answer: {
      uz: "Bizning narxlarimiz bozorga qaraganda 2–3 marta arzon. Batafsil ma'lumotni profilda ko'rishingiz mumkin.",
      ru: "Наши цены в 2–3 раза ниже рыночных. Подробности доступны в личном кабинете.",
      en: "Our prices are 2–3 times lower than the market average. Details are available in your portal."
    }
  },
  {
    keywords: ['aloqa', 'contact', 'контакт', 'telefon', 'phone', 'email'],
    answer: {
      uz: "Biz bilan bog'lanish: +998 71 200-00-00 yoki info@skill-bridge.uz",
      ru: "Свяжитесь с нами: +998 71 200-00-00 или info@skill-bridge.uz",
      en: "Contact us: +998 71 200-00-00 or info@skill-bridge.uz"
    }
  }
]

export default function SupportChat({ dict }: { dict: any }) {
  if (!dict) return null

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Initialize welcome message based on language
  useEffect(() => {
    if (messages.length === 0 && dict?.home) {
      setMessages([
        {
          id: 0,
          from: 'bot',
          text: (dict.home.badge || 'Hello') + "! 👋 Skill-Bridge Support. " + (dict.home.heroSub || '')
        }
      ])
    }
  }, [dict])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function getBotReply(userText: string): string {
    const lower = userText.toLowerCase()
    const lang = dict.nav.home === 'Bosh sahifa' ? 'uz' : (dict.nav.home === 'Главная' ? 'ru' : 'en')
    
    for (const faq of FAQ_RESPONSES) {
      if (faq.keywords.some(kw => lower.includes(kw))) {
        return faq.answer[lang] || faq.answer['en']
      }
    }
    return lang === 'ru' ? "Извините, я не понял вопрос. Напишите нам на info@skill-bridge.uz" : 
           (lang === 'en' ? "Sorry, I didn't understand. Contact us at info@skill-bridge.uz" : 
           "Kechirasiz, savolingizni tushunmadim. info@skill-bridge.uz ga yozing.")
  }

  function sendMessage(text?: string) {
    const msg = (text || input).trim()
    if (!msg) return
    const userMsg: Message = { id: Date.now(), from: 'user', text: msg }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = getBotReply(msg)
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: reply }])
      setTyping(false)
    }, 700)
  }

  const quickReplies = [
    dict.client?.newOrder || 'Order', 
    dict.leader?.price || 'Price', 
    dict.nav?.faq || 'FAQ'
  ]

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(59,130,246,0.5)',
          transition: 'transform 0.2s',
        }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div style={{
          position: 'fixed',
          bottom: '92px',
          right: '24px',
          zIndex: 998,
          width: '360px',
          maxWidth: 'calc(100vw - 32px)',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          maxHeight: '520px',
        }}>
          <div style={{ padding: '16px 20px', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bot size={20} />
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>Skill-Bridge Bot</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>{dict.home?.badge}</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg)' }}>
            {messages.map(m => (
              <div key={m.id} style={{ alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '10px 14px',
                  background: m.from === 'user' ? 'var(--accent)' : 'var(--card)',
                  color: m.from === 'user' ? '#fff' : 'var(--text)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  borderRadius: '12px',
                  border: m.from === 'bot' ? '1px solid var(--border)' : 'none',
                  whiteSpace: 'pre-line',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && <div style={{ fontSize: '11px', color: 'var(--t3)' }}>typing...</div>}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '6px', flexWrap: 'wrap', background: 'var(--bg)' }}>
            {quickReplies.map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--t2)', fontWeight: 600 }}>
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={e => { e.preventDefault(); sendMessage() }} style={{ display: 'flex', padding: '12px', gap: '8px', borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={dict.chat?.placeholder || '...'}
              className="form-input"
              style={{ flex: 1, padding: '10px 12px', fontSize: '13px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px' }} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
