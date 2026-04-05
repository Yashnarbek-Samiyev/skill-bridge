import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getDictionary } from '@/lib/i18n'
import { verifyUserIsLoggedIn } from '@/lib/session'
import { Award, CheckCircle2, Clock, MapPin, FileText, User, ArrowRight, BookOpen, Download } from 'lucide-react'
import Link from 'next/link'
import CertificateModal from './CertificateModal'
import CertificateThumbnail from './CertificateThumbnail'

export default async function StudentPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ tab?: string }> 
}) {
  const { tab } = await searchParams
  const activeTab = tab || 'tasks'

  const session = await verifyUserIsLoggedIn()
  if (session.role !== 'STUDENT') return <div className="container" style={{padding: '100px', textAlign: 'center'}}>Ruxsat etilmagan. Faqat talabalar uchun.</div>

  const dict = await getDictionary()
  const student = await (prisma as any).user.findUnique({ 
    where: { id: session.userId as string }, 
    include: { group: { include: { leader: true } } } 
  })
  
  if (!student) return <div className="container" style={{padding: '100px', textAlign: 'center'}}>Xatolik, Talaba topilmadi.</div>
  
  const tasks = await (prisma as any).task.findMany({
    where: { 
      assignedToId: student.id,
      ...(activeTab === 'certificates' ? { status: 'DONE' } : {})
    },
    include: { 
      order: { 
        include: { 
          service: true, 
          client: true,
          group: { include: { leader: true } }
        } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  })
  
  const totalTasks = await (prisma as any).task.count({ where: { assignedToId: student.id } })
  const doneTasks = await (prisma as any).task.count({ where: { assignedToId: student.id, status: 'DONE' } })

  async function completeTask(formData: FormData) {
    'use server'
    const taskId = formData.get('taskId') as string
    const result = formData.get('result') as string || ''
    
    const { updateTaskResult } = await import('@/lib/actions')
    await updateTaskResult(taskId, result)
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* 1. Profile Header */}
      <div className="card" style={{ marginBottom: '32px', borderTop: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={14} /> {dict.student.welcome},
            </div>
            <h2 style={{ fontSize: '28px', margin: '4px 0' }}>{student.name}</h2>
            <div style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 'bold' }}>
              🎓 {student.group?.name || 'Guruh biriktirilmagan'} · Talaba
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 30px', borderRadius: '20px', textAlign: 'center', border: '1.5px solid var(--border)' }}>
             <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}>{dict.student.myTasks}</div>
             <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--ok)' }}>{doneTasks}<span style={{fontSize: '18px', color: 'var(--t3)', fontWeight: 'normal'}}> / {totalTasks}</span></div>
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="orders-tabs">
        <Link href="/student?tab=tasks" className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}>
          <BookOpen size={16} style={{marginRight: '8px'}} /> {dict.student.activeTasks}
        </Link>
        <Link href="/student?tab=certificates" className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}>
          <Award size={16} style={{marginRight: '8px'}} /> {dict.student.myCertificates}
        </Link>
      </div>

      {/* 3. Content Section */}
      <div className="orders-container">
        {activeTab === 'certificates' ? (
          <div className="cert-list">
             {tasks.filter((t:any) => t.order.status === 'COMPLETED').length > 0 ? (
               tasks.filter((t:any) => t.order.status === 'COMPLETED').map((t: any) => (
                <div key={t.id} className="cert-list-item">
                  {/* Left: Preview */}
                  <div className="cert-preview-box">
                    <CertificateThumbnail 
                      studentName={student.name}
                      serviceName={t.order.service.name}
                      orderId={t.order.id}
                      leaderName={t.order.group?.leader?.name || 'Loyiha Rahbari'}
                      date={new Date(t.order.createdAt).toLocaleDateString()}
                      dict={dict}
                    />
                  </div>
                  
                  {/* Middle: Info */}
                  <div className="cert-info">
                    <h3 className="cert-title">{t.order.service.name}</h3>
                    <div className="cert-meta">
                       <span>📅 {new Date(t.order.createdAt).toLocaleDateString()}</span>
                       <span>🆔 #{t.order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 'bold', marginTop: '4px' }}>
                       👨‍🏫 {dict.leader.welcome}: {t.order.group?.leader?.name || '...'}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="cert-actions">
                    <CertificateModal 
                      studentName={student.name}
                      serviceName={t.order.service.name}
                      orderId={t.order.id}
                      leaderName={t.order.group?.leader?.name || '...'}
                      date={new Date(t.order.createdAt).toLocaleDateString()}
                      dict={dict}
                      variant="list"
                    />
                  </div>
                </div>
               ))
             ) : (
                <div style={{ textAlign: 'center', padding: '80px', background: 'var(--surface)', borderRadius: '20px', border: '1.5px dashed var(--border)' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📜</div>
                  <p style={{ color: 'var(--t3)', fontSize: '18px', fontWeight: '600' }}>{dict.student.noCertificates}</p>
                </div>
             )}
          </div>
        ) : (
          tasks.length > 0 ? tasks.map((t: any) => {
            const isDone = t.status === 'DONE';
            const orderIsCompleted = t.order.status === 'COMPLETED';

            return (
              <div key={t.id} className="order-card-premium task-card-student">
                <div className="order-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div className={`status-badge ${isDone ? 'status-done' : 'status-active'}`}>
                          {isDone ? dict.student.done : dict.leader.active}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--t3)' }}>ID: #{t.id.slice(-6)}</span>
                    </div>
                    <h4 style={{ fontSize: '20px', fontWeight: '800' }}>{t.title}</h4>
                    <div style={{ fontSize: '13px', marginTop: '4px', color: 'var(--accent)', fontWeight: 'bold' }}>
                        🛠 {t.order.service.name}
                    </div>
                  </div>

                  {orderIsCompleted && isDone && (
                    <div style={{ textAlign: 'right' }}>
                      <CertificateModal 
                        studentName={student.name}
                        serviceName={t.order.service.name}
                        orderId={t.order.id}
                        leaderName={t.order.group?.leader?.name || '...'}
                        date={new Date(t.order.createdAt).toLocaleDateString()}
                        dict={dict}
                      />
                    </div>
                  )}
                </div>

                <div className="order-card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={12} /> {dict.client.region}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{t.order.region}, {t.order.address}</div>
                    </div>
                    
                    <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={12} /> {dict.client.desc}
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{t.order.description}</div>
                    </div>

                    <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={12} /> {dict.leader.client}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{t.order.client.name}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    {isDone ? (
                      <div style={{ background: 'rgba(16,185,129,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid var(--ok)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--ok)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>✓ {dict.student.done}</div>
                        <div style={{ fontSize: '15px', color: 'var(--t2)', fontStyle: 'italic' }}>"{t.result || '...'}"</div>
                      </div>
                    ) : (
                      <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <h5 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>{dict.student.finishBtn}</h5>
                        <form action={completeTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <input type="hidden" name="taskId" value={t.id} />
                          <textarea 
                            name="result" 
                            placeholder={dict.chat.placeholder} 
                            className="form-input" 
                            rows={4} 
                            required 
                            style={{ width: '100%', padding: '16px', background: 'var(--bg)' }}
                          />
                          <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '16px', fontWeight: '800', width: '100%', borderRadius: '12px' }}>
                            {dict.student.finishBtn} <CheckCircle2 size={20} style={{marginLeft: '10px'}} />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="card" style={{ textAlign: 'center', padding: '80px', background: 'var(--surface)' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
              <p style={{ color: 'var(--t3)', fontSize: '18px' }}>
                {dict.leader.empty}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
