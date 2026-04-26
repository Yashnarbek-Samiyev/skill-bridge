import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Star, Award, CheckCircle, Briefcase, MapPin, Calendar } from 'lucide-react'
import { formatUZS } from '@/lib/utils'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return { title: 'Portfolio topilmadi' }
  return {
    title: `${user.name} — Skill-Bridge Portfolio`,
    description: `${user.name} ning bajargan ishlari va ko'nikmalariga qarang`,
  }
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      group: {
        include: { direction: true }
      },
      tasks: {
        where: { status: 'DONE' },
        include: {
          order: {
            include: { service: true, review: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  })

  if (!user || (user.role !== 'STUDENT' && user.role !== 'LEADER')) {
    notFound()
  }

  const doneTasks = user.tasks.filter(t => t.status === 'DONE')
  const ratings = user.tasks
    .map(t => t.order?.review?.rating)
    .filter(Boolean) as number[]
  const avgRating = ratings.length > 0
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : null

  const completedOrders = new Set(user.tasks.map(t => t.orderId)).size
  const joinDate = new Date(user.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
        padding: '60px 20px 40px',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(139,92,246,0.1) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--a3))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '42px', fontWeight: 900, color: '#fff',
              flexShrink: 0,
              border: '4px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px rgba(59,130,246,0.3)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: user.role === 'LEADER' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                border: `1px solid ${user.role === 'LEADER' ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`,
                color: user.role === 'LEADER' ? '#f59e0b' : '#3B82F6',
                padding: '3px 12px', borderRadius: '99px', fontSize: '11px',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                marginBottom: '10px'
              }}>
                {user.role === 'LEADER' ? '👔 Rahbar' : '👨‍🎓 Talaba'}
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
                {user.name}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                {user.group && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Briefcase size={13} /> {user.group.name}
                  </span>
                )}
                {user.group && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={13} /> {user.group.region}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={13} /> {joinDate} dan beri
                </span>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '16px 20px', textAlign: 'center', minWidth: '80px'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#3B82F6' }}>{doneTasks.length}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Vazifa</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '16px 20px', textAlign: 'center', minWidth: '80px'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#4ADE80' }}>{completedOrders}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Loyiha</div>
              </div>
              {avgRating && (
                <div style={{
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '16px 20px', textAlign: 'center', minWidth: '80px'
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#f59e0b' }}>⭐{avgRating}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Reyting</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth: '900px', padding: '40px 20px' }}>

        {/* Direction badge */}
        {user.group?.direction && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '10px 20px', fontSize: '14px', fontWeight: 600
            }}>
              <Award size={16} color="var(--accent)" />
              {user.group.direction.name} — mutaxassisligi
            </div>
          </div>
        )}

        {/* Completed works */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <CheckCircle size={22} color="var(--ok)" />
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Bajargan ishlari ({doneTasks.length})</h2>
          </div>

          {doneTasks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--t3)' }}>
              Hali bajarilgan ish yo'q
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {doneTasks.map((task) => (
                <div key={task.id} className="card" style={{ padding: '20px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(59,130,246,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <CheckCircle size={20} color="var(--ok)" />
                    </div>
                    {task.order?.review?.rating && (
                      <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '13px' }}>
                        {'★'.repeat(task.order.review.rating)}
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
                    {task.title}
                  </div>
                  {task.order?.service && (
                    <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>
                      {task.order.service.name}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--t3)' }}>
                    {new Date(task.createdAt).toLocaleDateString('uz-UZ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '60px', textAlign: 'center', color: 'var(--t3)', fontSize: '13px' }}>
          <div style={{ marginBottom: '8px' }}>
            Bu portfolio <strong style={{ color: 'var(--accent)' }}>Skill-Bridge</strong> platformasi tomonidan avtomatik yaratildi
          </div>
          <a href="/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Skill-Bridge.uz ga qaytish →
          </a>
        </div>
      </div>
    </div>
  )
}
