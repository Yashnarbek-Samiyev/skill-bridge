import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getDictionary } from '@/lib/i18n'
import { formatUZS } from '@/lib/utils'
import { verifyUserIsLoggedIn } from '@/lib/session'
import ChatBox from '../ChatBox'
import Link from 'next/link'
import { 
  Users, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Plus, 
  User, 
  FileText, 
  BarChart3,
  Bell,
  ArrowRight
} from 'lucide-react'

export default async function LeaderPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ tab?: string }> 
}) {
  const { tab } = await searchParams
  const activeTab = tab || 'all'
  
  const session = await verifyUserIsLoggedIn()
  if (session.role !== 'LEADER') return <div className="container" style={{padding: '100px', textAlign: 'center'}}>Ruxsat etilmagan</div>

  const dict = await getDictionary()
  const leader = await (prisma as any).user.findUnique({ 
    where: { id: session.userId as string }, 
    include: { group: true, ledGroups: true } 
  })
  
  if (!leader) return <div className="container" style={{padding: '100px', textAlign: 'center'}}>Xatolik, foydalanuvchi topilmadi.</div>
  
  const groupsToManage = leader.ledGroups.length > 0 ? leader.ledGroups : (leader.group ? [leader.group] : [])
  if (groupsToManage.length === 0) return <div className="container" style={{padding: '100px', textAlign: 'center'}}>Sizga hech qanday guruh biriktirilmagan.</div>

  const groupIds = groupsToManage.map((g: any) => g.id)
  const totalBalance = groupsToManage.reduce((acc: number, g: any) => acc + g.balance, 0)
  const isMultiGroup = groupsToManage.length > 1

  const orders = await (prisma as any).order.findMany({
    where: { 
      groupId: { in: groupIds },
      ...(activeTab === 'new' ? { status: 'PENDING_APPROVAL' } : {}),
      ...(activeTab === 'active' ? { status: 'IN_PROGRESS' } : {}),
      ...(activeTab === 'completed' ? { status: 'COMPLETED' } : {}),
    },
    include: { 
      service: true, 
      client: true, 
      tasks: { include: { assignedTo: true } }, 
      messages: { include: { sender: true } }, 
      group: true 
    },
    orderBy: { createdAt: 'desc' }
  })

  const students = await (prisma as any).user.findMany({ 
    where: { role: 'STUDENT', groupId: { in: groupIds } },
    include: {
      _count: { select: { tasks: { where: { status: 'DONE' } } } },
      group: true
    },
    orderBy: { tasks: { _count: 'desc' } }
  })

  // Action handlers
  async function handleCreateTask(formData: FormData) {
    'use server'
    const orderId = formData.get('orderId') as string
    const title = formData.get('title') as string
    const assignedToId = formData.get('assignedToId') as string
    
    if(!title || !assignedToId) return

    const { assignTask } = await import('@/lib/actions')
    await assignTask(orderId, title, assignedToId)
  }

  async function handleCompleteOrder(formData: FormData) {
    'use server'
    const orderId = formData.get('orderId') as string
    const fileUrlStr = formData.get('fileUrl') as string
    
    const { completeOrder } = await import('@/lib/actions')
    await completeOrder(orderId, fileUrlStr)
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.userId as string, read: false },
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* 1. Dashboard Header */}
      <div className="card" style={{ marginBottom: '32px', borderTop: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={14} /> {dict.leader.welcome},
            </div>
            <h2 style={{ fontSize: '28px', margin: '4px 0' }}>{leader.name}</h2>
            <div style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 'bold' }}>
              {isMultiGroup ? `${groupsToManage.length} ${dict.home.statsGroups}` : (groupsToManage[0] as any).name}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ padding: '16px 24px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                <Wallet size={12} /> {dict.admin.revenue}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ok)' }}>
                {formatUZS(totalBalance)}
              </div>
              {totalBalance > 0 && (
                <form action={async () => {
                  'use server'
                  const { requestWithdrawal } = await import('@/lib/actions')
                  for (const g of groupsToManage) {
                    if (g.balance > 0) await requestWithdrawal(g.id)
                  }
                }}>
                  <button type="submit" style={{ marginTop: '8px', background: 'var(--ok)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    💸 Yechishni so'rash
                  </button>
                </form>
              )}
            </div>

            <div style={{ padding: '16px 24px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={12} /> {dict.leader.studentsBusy}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent)' }}>{students.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Notifications & Leaderboard Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Left: Notifications */}
        <div className="card" style={{ background: 'var(--surface)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--accent)" /> {dict.home.liveActivityTitle}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.length > 0 ? notifications.map((n: any) => (
              <div key={n.id} style={{ fontSize: '13px', color: 'var(--t2)', padding: '10px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{fontWeight: '500'}}>{n.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--t3)' }}>{new Date(n.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            )) : <div style={{color: 'var(--t3)', fontSize: '13px', fontStyle: 'italic'}}>{dict.leader.empty}</div>}
          </div>
        </div>

        {/* Right: Top Students */}
        <div className="card" style={{ background: 'var(--surface)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--gold)" /> {dict.admin.topGroups}
          </h3>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
            {students.slice(0, 4).map((s: any, idx: number) => (
              <div key={s.id} style={{ minWidth: '120px', padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg)', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: idx === 0 ? 'var(--gold)' : 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto 8px' }}>
                  {s.name.charAt(0)}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name.split(' ')[0]}</div>
                <div style={{ fontSize: '10px', color: 'var(--t3)' }}>{s._count.tasks} {dict.home.tasksCount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Orders Section with Tabs */}
      <h3 style={{ marginBottom: '20px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={22} color="var(--accent)" /> {dict.leader.ordersTitle}
      </h3>

      <div className="orders-tabs">
        <Link href="/leader?tab=all" className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}>{dict.leader.all}</Link>
        <Link href="/leader?tab=new" className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}>{dict.leader.new}</Link>
        <Link href="/leader?tab=active" className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}>{dict.leader.active}</Link>
        <Link href="/leader?tab=completed" className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}>{dict.leader.completed}</Link>
      </div>

      <div className="orders-container">
        {orders.length > 0 ? orders.map((o: any) => {
          const totalTasks = o.tasks.length;
          const doneTasks = o.tasks.filter((t:any) => t.status === 'DONE').length;
          const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
          const canComplete = totalTasks > 0 && doneTasks === totalTasks && o.status === 'IN_PROGRESS';

          return (
            <div key={o.id} className="order-card-premium">
              <div className="order-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div className={`status-badge ${o.status === 'COMPLETED' ? 'status-done' : o.status === 'PENDING_APPROVAL' ? 'status-new' : 'status-active'}`}>
                      {o.status === 'COMPLETED' ? dict.leader.completed : o.status === 'PENDING_APPROVAL' ? dict.leader.new : dict.leader.active}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--t3)' }}>ID: #{o.id.slice(-6)}</span>
                  </div>
                  <h4 style={{ fontSize: '22px', fontWeight: '800' }}>{o.service.name}</h4>
                  {isMultiGroup && o.group && (
                    <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--accent)', fontWeight: 'bold' }}>
                      🏢 {o.group.name}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--gold)' }}>{formatUZS(o.price)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>{dict.leader.client}: <span style={{color: 'var(--t1)', fontWeight: '600'}}>{o.client.name}</span></div>
                </div>
              </div>

              <div className="order-card-body">
                {/* Description Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ borderRight: '1px solid var(--border)', paddingRight: '24px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>{dict.client.desc}</div>
                    <p style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: '1.5' }}>{o.description}</p>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 'bold' }}>{dict.leader.progress}</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--t1)' }}>{doneTasks} / {totalTasks} ({Math.round(progress)}%)</div>
                    </div>
                    <div className="progress-pill">
                      <div className="progress-fill" style={{ width: `${progress}%`, background: progress === 100 ? 'var(--ok)' : 'var(--accent)' }}></div>
                    </div>
                    
                    <div className="task-grid">
                      {o.tasks.map((t: any) => (
                        <div key={t.id} className="task-item-premium">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {t.status === 'DONE' ? <CheckCircle2 size={16} color="var(--ok)" /> : <Clock size={16} color="var(--gold)" />}
                            <span>{t.title}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--t3)' }}>
                            <User size={12} /> {t.assignedTo?.name || '...'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                  
                  {/* Action 1: Approval */}
                  {o.status === 'PENDING_APPROVAL' && (
                    <div style={{ background: 'rgba(59,130,246,0.03)', padding: '24px', borderRadius: '16px', border: '1px dashed var(--accent)', textAlign: 'center' }}>
                      <h5 style={{ marginBottom: '8px' }}>{dict.leader.new}</h5>
                      <form action={async () => {
                        'use server'
                        const { approveOrder } = await import('@/lib/actions')
                        await approveOrder(o.id)
                      }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '12px 40px', fontSize: '15px' }}>
                          {dict.leader.assignBtn} <ArrowRight size={16} style={{marginLeft: '8px'}} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Action 2: Assign Task Form */}
                  {o.status === 'IN_PROGRESS' && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 'bold' }}>{dict.leader.assignBtn}</div>
                      <form action={handleCreateTask} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <input type="hidden" name="orderId" value={o.id} />
                        <div style={{ flex: 1, minWidth: '250px' }}>
                          <input type="text" name="title" placeholder={dict.leader.newTaskPlaceholder} className="form-input" style={{ width: '100%', padding: '12px' }} required />
                        </div>
                        <div style={{ width: '200px' }}>
                          <select name="assignedToId" className="form-input" style={{ width: '100%', padding: '12px' }} required>
                            <option value="">{dict.leader.selectStudent}</option>
                            {students.filter((s: any) => !isMultiGroup || s.groupId === o.groupId).map((s: any) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Plus size={18} /> {dict.leader.add}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Action 3: Complete Order */}
                  {canComplete && (
                    <div style={{ background: 'rgba(16,185,129,0.05)', padding: '24px', borderRadius: '16px', border: '1px dashed var(--ok)', marginTop: '24px' }}>
                      <form action={handleCompleteOrder}>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>{dict.student.finishBtn}:</label>
                          <input type="url" name="fileUrl" className="form-input" placeholder="Google Drive, Portfolio yoki Fayl linki..." required style={{ width: '100%', padding: '12px' }} />
                        </div>
                        <input type="hidden" name="orderId" value={o.id} />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--ok)', padding: '14px' }}>
                           {dict.leader.closeBtn} <CheckCircle2 size={18} style={{marginLeft: '8px'}} />
                        </button>
                      </form>
                    </div>
                  )}

                  <div style={{ marginTop: '24px' }}>
                    <ChatBox order={o} userId={session.userId as string} dict={dict} />
                  </div>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="card" style={{ textAlign: 'center', padding: '60px', background: 'var(--surface)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
            <p style={{ color: 'var(--t3)' }}>{dict.leader.noOrders}</p>
          </div>
        )}
      </div>
    </div>
  )
}
