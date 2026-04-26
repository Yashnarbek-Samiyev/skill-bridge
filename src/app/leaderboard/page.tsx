import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Trophy, Star, TrendingUp, Users, Award, Medal } from 'lucide-react'
import { formatUZS } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaderboard — Skill-Bridge',
  description: 'Top talabalar va guruhlar reytingi',
}

export default async function LeaderboardPage() {
  // Top students by completed tasks
  const topStudents = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      _count: { select: { tasks: true } },
      group: { include: { direction: true } },
      tasks: {
        where: { status: 'DONE' },
        include: { order: { include: { review: true } } }
      }
    },
    orderBy: { tasks: { _count: 'desc' } },
    take: 20
  })

  // Top groups by order count and balance
  const topGroups = await prisma.group.findMany({
    include: {
      _count: { select: { orders: true } },
      direction: true,
      reviews: { select: { rating: true } },
      leader: true
    },
    orderBy: { balance: 'desc' },
    take: 10
  })

  // Total stats
  const stats = {
    students: await prisma.user.count({ where: { role: 'STUDENT' } }),
    tasks: await prisma.task.count({ where: { status: 'DONE' } }),
    groups: await prisma.group.count(),
    orders: await prisma.order.count({ where: { status: 'COMPLETED' } }),
  }

  const getMedal = (index: number) => {
    if (index === 0) return { emoji: '🥇', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }
    if (index === 1) return { emoji: '🥈', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' }
    if (index === 2) return { emoji: '🥉', color: '#cd7f32', bg: 'rgba(205,127,50,0.1)' }
    return { emoji: `${index + 1}`, color: 'var(--t3)', bg: 'var(--surface)' }
  }

  const getAvgRating = (tasks: any[]) => {
    const ratings = tasks.map(t => t.order?.review?.rating).filter(Boolean) as number[]
    if (!ratings.length) return null
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
  }

  const getGroupAvgRating = (reviews: any[]) => {
    if (!reviews.length) return null
    const sum = reviews.reduce((a: number, b: any) => a + b.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
        padding: '60px 20px 50px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Trophy size={48} color="#f59e0b" />
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '12px', letterSpacing: '-1px' }}>
            Leaderboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '40px' }}>
            Skill-Bridge platformasidagi eng yaxshi talabalar va guruhlar reytingi
          </p>

          {/* Quick stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
            {[
              { n: stats.students, l: 'Talaba' },
              { n: stats.tasks, l: 'Bajarilgan vazifa' },
              { n: stats.groups, l: 'Faol guruh' },
              { n: stats.orders, l: 'Tugallangan loyiha' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '16px 28px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#3B82F6' }}>{s.n}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '48px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          {/* TOP STUDENTS */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Award size={22} color="var(--accent)" />
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Top Talabalar</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topStudents.map((student, i) => {
                const medal = getMedal(i)
                const doneTasks = student.tasks.filter(t => t.status === 'DONE').length
                const avgRating = getAvgRating(student.tasks)

                return (
                  <Link
                    key={student.id}
                    href={`/portfolio/${student.username}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 18px',
                      background: i < 3 ? medal.bg : 'var(--card)',
                      border: `1px solid ${i < 3 ? medal.color + '40' : 'var(--border)'}`,
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}>
                      {/* Rank */}
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: medal.bg, color: medal.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: i < 3 ? '18px' : '14px',
                        flexShrink: 0, border: `1.5px solid ${medal.color}40`
                      }}>
                        {medal.emoji}
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent), var(--a3))',
                        color: '#fff', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 800, fontSize: '15px',
                        flexShrink: 0
                      }}>
                        {student.name.charAt(0)}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {student.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '1px' }}>
                          {student.group?.direction?.name || '—'}
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 800, color: 'var(--ok)', fontSize: '14px' }}>
                          {doneTasks} vazifa
                        </div>
                        {avgRating && (
                          <div style={{ fontSize: '11px', color: '#f59e0b' }}>⭐ {avgRating}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* TOP GROUPS */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Users size={22} color="var(--a2)" />
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Top Guruhlar</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topGroups.map((group, i) => {
                const medal = getMedal(i)
                const avgRating = getGroupAvgRating(group.reviews)

                return (
                  <div
                    key={group.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 18px',
                      background: i < 3 ? medal.bg : 'var(--card)',
                      border: `1px solid ${i < 3 ? medal.color + '40' : 'var(--border)'}`,
                      borderRadius: '12px',
                    }}>
                    {/* Rank */}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: medal.bg, color: medal.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: i < 3 ? '18px' : '14px',
                      flexShrink: 0
                    }}>
                      {medal.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {group.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '1px' }}>
                        {group.direction.name} · {group.region}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, color: 'var(--ok)', fontSize: '13px' }}>
                        {formatUZS(group.balance)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--t3)' }}>
                        {group._count.orders} buyurtma
                        {avgRating && <span style={{ color: '#f59e0b', marginLeft: '4px' }}>⭐{avgRating}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
