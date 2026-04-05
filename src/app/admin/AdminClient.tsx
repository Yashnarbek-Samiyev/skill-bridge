'use client'

import { useState } from 'react'
import { LayoutDashboard, Users, UserPlus, Tag, CreditCard } from 'lucide-react'
import AdminUsers from './AdminUsers'
import AdminGroups from './AdminGroups'
import AdminServices from './AdminServices'
import Charts from './Charts'
import { formatUZS } from '@/lib/utils'

export default function AdminClient({ stats, latestOrders, groups, users, directions, dict }: { 
  stats: any, 
  latestOrders: any[], 
  groups: any[], 
  users: any[], 
  directions: any[],
  dict: any 
}) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Boshqaruv paneli', icon: <LayoutDashboard size={18} /> },
    { id: 'users', label: 'Foydalanuvchilar', icon: <UserPlus size={18} /> },
    { id: 'groups', label: 'Guruhlar', icon: <Users size={18} /> },
    { id: 'services', label: 'Xizmatlar va Narxlar', icon: <Tag size={18} /> },
  ]

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '32px', 
        background: 'var(--surface)', 
        padding: '6px', 
        borderRadius: '12px', 
        width: 'fit-content',
        border: '1px solid var(--border)' 
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              borderRadius: '10px', 
              border: 'none', 
              cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--t2)',
              fontWeight: activeTab === tab.id ? 'bold' : '500',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 600 }}>Jami Talabalar</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>{stats.activeStudents}</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px' }}>
                   <Users size={24} color="var(--accent)" />
                </div>
              </div>
            </div>
            
            <div className="card" style={{ borderTop: '4px solid var(--ok)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 600 }}>Tugallangan ishlar</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>{stats.totalOrders}</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px' }}>
                   <Tag size={24} color="var(--ok)" />
                </div>
              </div>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--gold)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 600 }}>Umumiy Daromad</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: 'var(--ok)' }}>{formatUZS(stats.revenue)}</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px' }}>
                   <CreditCard size={24} color="var(--gold)" />
                </div>
              </div>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--primary)', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 600 }}>Platforma Balansi</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: 'var(--accent)' }}>{formatUZS(stats.totalBalance)}</div>
                  <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: '4px' }}>Hali yechib olinmagan</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px' }}>
                   <CreditCard size={24} color="var(--accent)" />
                </div>
              </div>
            </div>
          </div>

          <Charts data={latestOrders} />

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '24px' }}>
            <div className="card">
               <h3 style={{ marginBottom: '20px' }}>So'nggi buyurtmalar</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {latestOrders.map((o: any) => (
                   <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                     <div>
                       <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{o.service.name}</div>
                       <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>{o.group?.name || '---'}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                       <div className={`badge ${o.status === 'COMPLETED' ? 'badge-done' : 'badge-active'}`} style={{ fontSize: '11px' }}>
                         {o.status}
                       </div>
                       <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>{formatUZS(o.price)}</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="card">
               <h3 style={{ marginBottom: '20px' }}>Top guruhlar</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {groups.slice(0, 5).map((g: any, i: number) => (
                   <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i === 0 ? 'var(--gold)' : 'var(--surface)', color: i === 0 ? '#fff' : 'var(--t2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                          {i+1}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{g.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{g.region}</div>
                        </div>
                     </div>
                     <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                       {g._count.orders} ta ish
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && <AdminUsers users={users} groups={groups} />}
      {activeTab === 'groups' && <AdminGroups groups={groups} directions={directions} users={users} />}
      {activeTab === 'services' && <AdminServices directions={directions} />}

    </div>
  )
}
