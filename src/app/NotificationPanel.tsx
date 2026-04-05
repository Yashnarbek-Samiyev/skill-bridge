'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X, CheckCheck, Package, MessageCircle, Star, Info, Eye } from 'lucide-react'
import { markNotificationsRead, markOneNotificationRead, getLatestNotifications } from '@/lib/actions'

type Notif = {
  id: string
  title: string
  type: string
  read: boolean
  createdAt: Date
}

function typeIcon(type: string) {
  if (type === 'ORDER') return <Package size={14} color="#3B82F6" />
  if (type === 'MESSAGE') return <MessageCircle size={14} color="#06b6d4" />
  if (type === 'REVIEW') return <Star size={14} color="#f59e0b" />
  return <Info size={14} color="#64748b" />
}

function typeColor(type: string) {
  if (type === 'ORDER') return 'rgba(59,130,246,0.1)'
  if (type === 'MESSAGE') return 'rgba(6,182,212,0.1)'
  if (type === 'REVIEW') return 'rgba(245,158,11,0.1)'
  return 'rgba(100,116,139,0.1)'
}

function timeAgo(date: Date, dict: any) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  // Simplified time ago from dictionary if available, or just standard
  if (diff < 60) return `1 ${dict.home.badge}` // Using "Badge" as a placeholder for "Just now" or "Online"
  if (diff < 3600) return `${Math.floor(diff / 60)} m`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`
  return `${Math.floor(diff / 86400)} d`
}

export default function NotificationPanel({
  notifications,
  userId,
  dict
}: {
  notifications: Notif[]
  userId: string
  dict: any
}) {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState<Notif[]>(notifications)
  const panelRef = useRef<HTMLDivElement>(null)

  // Sync with server props
  useEffect(() => {
    setList(notifications)
  }, [notifications])

  // Polling for new notifications
  useEffect(() => {
    if (!userId) return
    const interval = setInterval(async () => {
      try {
        const latest = await getLatestNotifications(userId)
        if (latest && latest.length > 0) {
          setList(prev => {
            const existingIds = prev.map(p => p.id)
            const news = latest.filter(l => !existingIds.includes(l.id))
            if (news.length === 0) return prev
            return [...news, ...prev]
          })
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [userId])

  // Close when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const unread = list.filter(n => !n.read)
  const read = list.filter(n => n.read)
  const unreadCount = unread.length

  async function handleMarkAllRead() {
    // Optimistic update
    setList(prev => prev.map(n => ({ ...n, read: true })))
    await markNotificationsRead(userId)
  }

  async function handleMarkOneRead(notifId: string) {
    // Optimistic update
    setList(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n))
    await markOneNotificationRead(notifId)
  }

  function renderNotif(n: Notif, isUnread: boolean) {
    return (
      <div
        key={n.id}
        onClick={isUnread ? () => handleMarkOneRead(n.id) : undefined}
        style={{
          padding: '12px 16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          background: isUnread ? 'rgba(59,130,246,0.04)' : 'transparent',
          transition: 'background 0.15s',
          cursor: isUnread ? 'pointer' : 'default',
          borderBottom: '1px solid var(--border)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
        onMouseLeave={e => (e.currentTarget.style.background = isUnread ? 'rgba(59,130,246,0.04)' : 'transparent')}
      >
        {/* Symbol */}
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: typeColor(n.type), border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative'
        }}>
          {typeIcon(n.type)}
          {isUnread && (
            <div style={{
              position: 'absolute', top: -1, right: -1,
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--accent)',
              border: '1.5px solid var(--card)'
            }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '13px',
            lineHeight: '1.45',
            color: 'var(--text)',
            wordBreak: 'break-word',
            fontWeight: isUnread ? 600 : 400,
            opacity: isUnread ? 1 : 0.75
          }}>
            {n.title}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--t3)',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{timeAgo(n.createdAt, dict)}</span>
            {isUnread && (
              <span style={{
                fontSize: '10px',
                color: 'var(--accent)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Eye size={10} /> {dict.client.clickToOpen}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          background: open ? 'rgba(59,130,246,0.15)' : 'var(--bg)',
          borderRadius: '50%',
          border: 'none',
          transition: 'background 0.2s'
        }}
        title="Bildirishnomalar"
      >
        <Bell size={18} color={open ? 'var(--accent)' : 'var(--t2)'} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: -2,
            right: -2,
            background: 'var(--err)',
            color: '#fff',
            fontSize: '9px',
            fontWeight: 'bold',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--surface)',
            animation: 'pulse 2s infinite'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '48px',
          right: '-8px',
          width: '380px',
          maxWidth: 'calc(100vw - 24px)',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          zIndex: 200,
          overflow: 'hidden',
          animation: 'fadeInSlideUp 0.2s ease-out'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 16px 12px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--surface)'
          }}>
            <div style={{ fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} />
              {dict.leader.all}
              {unreadCount > 0 && (
                <span style={{
                  background: 'var(--err)',
                  color: '#fff',
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 700
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--t3)', padding: '4px', borderRadius: '6px',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Content area */}
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>

            {/* ── UNREAD SECTION ── */}
            {unread.length > 0 && (
              <div>
                {/* Section header */}
                <div style={{
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(59,130,246,0.06)',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {dict.leader.new} ({unread.length})
                  </span>
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--accent)', fontSize: '11px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '4px 8px', borderRadius: '6px',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <CheckCheck size={12} />
                    {dict.admin.confirmAll}
                  </button>
                </div>
                {/* Unread items */}
                {unread.map(n => renderNotif(n, true))}
              </div>
            )}

            {/* ── READ SECTION ── */}
            {read.length > 0 && (
              <div>
                {/* Section header */}
                <div style={{
                  padding: '10px 16px',
                  background: 'var(--surface)',
                  borderBottom: '1px solid var(--border)',
                  borderTop: unread.length > 0 ? '2px solid var(--border)' : 'none'
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--t3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {dict.leader.completed} ({read.length})
                  </span>
                </div>
                {/* Read items */}
                {read.map(n => renderNotif(n, false))}
              </div>
            )}

            {/* ── EMPTY STATE ── */}
            {list.length === 0 && (
              <div style={{ padding: '50px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
                <div style={{ color: 'var(--t3)', fontSize: '14px', fontWeight: 500 }}>
                  {dict.leader.empty}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
