'use client'

import { useState, useEffect, useRef } from 'react'
import { handleSendMessage, getLatestMessages } from '@/lib/actions'
import { Paperclip, Send } from 'lucide-react'

export default function ChatBox({ order, userId, dict }: { order: any, userId: string, dict: any }) {
  const [text, setText] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [list, setList] = useState<any[]>(order.messages || [])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sync with prop
  useEffect(() => {
    setList(order.messages || [])
  }, [order.messages])

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [list])

  // Polling for new messages
  useEffect(() => {
    if (order.status === 'COMPLETED') return
    const interval = setInterval(async () => {
      const lastMsgId = list.length > 0 ? list[list.length - 1].id : ''
      try {
        const latest = await getLatestMessages(order.id, lastMsgId)
        if (latest && latest.length > 0) {
          setList(prev => {
            const existingIds = prev.map(p => p.id)
            const news = latest.filter(l => !existingIds.includes(l.id))
            if (news.length === 0) return prev
            return [...prev, ...news]
          })
        }
      } catch (e) {
        // ignore
      }
    }, 10000) // 10 seconds for active chat
    return () => clearInterval(interval)
  }, [order.id, order.status, list])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || isPending) return
    setIsPending(true)
    const optimisticMsg = {
      id: 'temp-' + Date.now(),
      senderId: userId,
      sender: { name: userId === 'system' ? dict.chat.system : 'Siz' },
      content: text,
      createdAt: new Date()
    }
    setList(prev => [...prev, optimisticMsg])
    await handleSendMessage(order.id, userId, text)
    setText('')
    setIsPending(false)
  }

  return (
    <div style={{ marginTop: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      
      {/* File URL Attached to Order */}
      {order.fileUrl && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(59,130,246,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Paperclip size={16} color="var(--accent)" />
          <a href={order.fileUrl} target="_blank" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 'bold' }}>{dict.client.clickToOpen}</a>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={scrollRef}
        style={{ maxHeight: '200px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {list.length > 0 ? list.map((m: any) => (
          <div key={m.id} style={{ 
            alignSelf: m.senderId === userId ? 'flex-end' : 'flex-start', 
            background: m.senderId === userId ? 'var(--accent)' : 'var(--bg)', 
            color: m.senderId === userId ? '#fff' : 'var(--text)', 
            padding: '10px 14px', 
            borderRadius: '12px', 
            maxWidth: '80%', 
            fontSize: '13px', 
            border: m.senderId === userId ? 'none' : '1px solid var(--border)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px', fontWeight: 600 }}>{m.senderId === userId ? 'Siz' : m.sender?.name}</div>
            {m.content}
          </div>
        )) : (
          <div style={{ textAlign: 'center', color: 'var(--t3)', fontSize: '12px' }}>{dict.chat.placeholder}</div>
        )}
      </div>

      {/* Input */}
      {order.status !== 'COMPLETED' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '12px', borderTop: '1px solid var(--border)', gap: '8px' }}>
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dict.chat.placeholder} 
            className="form-input" 
            style={{ flex: 1, padding: '10px 12px' }} 
            required
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '10px' }} disabled={isPending || !text.trim()}>
            {isPending ? '...' : <Send size={18} />}
          </button>
        </form>
      )}
    </div>
  )
}
