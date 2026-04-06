import { getServices, getOrdersByClient } from '@/lib/actions'
import OrderForm from './OrderForm'
import ReviewForm from './ReviewForm'
import prisma from '@/lib/prisma'
import { getDictionary } from '@/lib/i18n'
import { verifyUserIsLoggedIn } from '@/lib/session'
import ChatBox from '../ChatBox'
import { QRCodeSVG } from 'qrcode.react'
import { formatUZS } from '@/lib/utils'

export default async function ClientPage() {
  const session = await verifyUserIsLoggedIn()
  if (session.role !== 'CLIENT') return <div>Ruxsat etilmagan!</div>
  
  const dict = await getDictionary()
  const client = await prisma.user.findUnique({ 
    where: { id: session.userId as string },
    include: {
      orders: {
        include: {
          service: {
            include: { direction: true }
          },
          tasks: true,
          messages: {
            include: { sender: true }
          },
          review: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  if (!client) return <div>Xato: Foydalanuvchi topilmadi.</div>
  
  const services = await getServices()
  const orders = client.orders as any[]

  return (
    <div className="container" style={{ padding: '40px 20px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px' }}>
      
      {/* Left Column: New Order Form */}
      <div>
        <details style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }} open>
          <summary style={{ padding: '20px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none', listStyle: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', background: 'var(--accent)', color: '#fff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</span>
                {dict.client.newOrder}
              </div>
            </div>
          </summary>
          <div style={{ padding: '0 20px 24px' }}>
            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '24px' }} />
            <OrderForm services={services} clientId={client.id} dict={dict.client} />
          </div>
        </details>
      </div>

      {/* Right Column: My Orders */}
      <div>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 800 }}>{dict.client.myOrders}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--t3)' }}>
              {dict.client.empty}
            </div>
          ) : orders.map((o) => {
            const totalTasks = o.tasks?.length || 0
            const doneTasks = o.tasks?.filter((t:any) => t.status === 'DONE').length || 0
            
            return (
              <div key={o.id} className="card" style={{ padding: '20px', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px' }}>
                    {o.service?.name}
                    {o.status === 'ACTIVE' && totalTasks > 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--accent)', marginLeft: '12px', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '100px' }}>
                        {doneTasks}/{totalTasks}
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800,
                    background: o.status === 'COMPLETED' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                    color: o.status === 'COMPLETED' ? 'var(--ok)' : 'var(--accent)',
                    textTransform: 'uppercase'
                  }}>
                    {o.status === 'COMPLETED' ? dict.leader.completed : (o.status === 'ACTIVE' ? dict.leader.active : dict.leader.new)}
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '12px' }}>
                  {new Date(o.createdAt).toLocaleDateString()} • {formatUZS(o.price)}
                </div>

                <details style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: 'var(--accent)', userSelect: 'none' }}>
                    {dict.client.clickToOpen}
                  </summary>
                  <div style={{ marginTop: '16px' }}>
                    {/* Completion Review */}
                    {o.status === 'COMPLETED' && !o.review && (
                      <div style={{ padding: '16px', background: 'rgba(59,130,246,0.03)', borderRadius: '12px', border: '1px dashed var(--accent)', marginBottom: '16px' }}>
                         <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>{dict.client.rate}</div>
                         <ReviewForm orderId={o.id} dict={dict.client} />
                      </div>
                    )}
                    {o.review && (
                      <div style={{ padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--t3)', fontWeight: 700 }}>{dict.client.yourRate}</div>
                        <div style={{ color: 'var(--gold)', fontWeight: 900, fontSize: '18px' }}>{'★'.repeat(o.review.rating)}</div>
                      </div>
                    )}

                    {/* QR Verification for Completed Orders */}
                    {o.status === 'COMPLETED' && (
                      <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ color: '#000' }}>
                          <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Digital Invoice</div>
                          <div style={{ fontSize: '13px', fontWeight: 900 }}>Verified by Skill-Bridge</div>
                          <div style={{ fontSize: '11px', color: '#999' }}>ID: {o.id.substring(0,8).toUpperCase()}</div>
                        </div>
                        <QRCodeSVG value={`https://skill-bridge.edu/verify/${o.id}`} size={48} />
                      </div>
                    )}

                    <ChatBox order={o} userId={session.userId as string} dict={dict} />
                  </div>
                </details>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
