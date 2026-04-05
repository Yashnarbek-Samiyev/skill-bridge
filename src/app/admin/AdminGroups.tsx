'use client'

import { useState } from 'react'
import { createGroup } from '@/lib/actions'
import { Users, MapPin, Briefcase, Plus, Wallet } from 'lucide-react'
import { formatUZS } from '@/lib/utils'

export default function AdminGroups({ groups, directions, users }: { groups: any[], directions: any[], users: any[] }) {
  const [loading, setLoading] = useState(false)

  async function handleAddGroup(formData: FormData) {
    setLoading(true)
    const name = formData.get('name') as string
    const directionId = formData.get('directionId') as string
    const region = formData.get('region') as string
    const leaderId = formData.get('leaderId') as string

    await createGroup({ 
      name, 
      directionId, 
      region, 
      leaderId: leaderId || undefined 
    })
    setLoading(false)
  }

  const leaders = users.filter(u => u.role === 'LEADER')

  return (
    <div className="animate-fade-in">
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
         
         {/* Group Form */}
         <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
               <Users size={20} color="var(--accent)" />
               <h3 style={{ fontSize: '18px' }}>Yangi guruh yaratish</h3>
            </div>

            <form action={handleAddGroup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div className="form-group">
                 <label className="form-label">Guruh nomi</label>
                 <input type="text" name="name" className="form-input" placeholder="Masalan: Oshpazlik - Chilonzor guruhi" required />
               </div>

               <div className="form-group">
                 <label className="form-label">Mutaxassislik (Yo'nalish)</label>
                 <select name="directionId" className="form-input" required>
                    <option value="">-- Tanlang --</option>
                    {directions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                 </select>
               </div>

               <div className="form-group">
                 <label className="form-label">Hudud (Tuman/Viloyat)</label>
                 <select name="region" className="form-input" required>
                    <option value="">-- Tanlang --</option>
                    <optgroup label="Toshkent shahri (Tumanlar)">
                       <option value="Chilonzor tumani">Chilonzor tumani</option>
                       <option value="Yunusobod tumani">Yunusobod tumani</option>
                       <option value="Mirzo Ulug'bek tumani">Mirzo Ulug'bek tumani</option>
                       <option value="Yashnobod tumani">Yashnobod tumani</option>
                       <option value="Olmazor tumani">Olmazor tumani</option>
                    </optgroup>
                    <optgroup label="Viloyatlar">
                       <option value="Toshkent viloyati">Toshkent viloyati</option>
                       <option value="Samarqand viloyati">Samarqand viloyati</option>
                       <option value="Buxoro viloyati">Buxoro viloyati</option>
                       <option value="Farg'ona viloyati">Farg'ona viloyati</option>
                       <option value="Navoiy viloyati">Navoiy viloyati</option>
                    </optgroup>
                 </select>
               </div>

               <div className="form-group">
                 <label className="form-label">Loyiha rahbari (Kafedra ustozi)</label>
                 <select name="leaderId" className="form-input">
                    <option value="">-- Rahbar tayinlash --</option>
                    {leaders.map(l => <option key={l.id} value={l.id}>{l.name} (@{l.username})</option>)}
                 </select>
               </div>

               <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                  {loading ? 'Yaratilmoqda...' : 'Guruhni yaratish +'}
               </button>
            </form>
         </div>

         {/* Groups List */}
         <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Guruhlar va Balanslar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
               {groups.map(g => (
                  <div key={g.id} style={{ 
                    padding: '20px', 
                    border: '1px solid var(--border)', 
                    borderRadius: '12px', 
                    background: 'var(--bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                       <div>
                          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{g.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px' }}>{g.direction.name}</div>
                       </div>
                       <div style={{ background: 'var(--surface)', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <Wallet size={14} color="var(--ok)" />
                         <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--ok)' }}>{formatUZS(g.balance)}</span>
                       </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--t2)', background: 'var(--card)', padding: '4px 8px', borderRadius: '6px' }}>
                          <MapPin size={12} /> {g.region}
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--t2)', background: 'var(--card)', padding: '4px 8px', borderRadius: '6px' }}>
                          <Briefcase size={12} /> {g._count.orders} buyurtma
                       </div>
                    </div>

                    {g.leader ? (
                       <div style={{ 
                         padding: '10px', 
                         background: 'rgba(59,130,246,0.05)', 
                         borderRadius: '8px', 
                         border: '1px solid rgba(59,130,246,0.1)',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '10px',
                         marginBottom: '10px'
                       }}>
                         <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                           {g.leader.name.charAt(0)}
                         </div>
                         <div style={{ fontSize: '13px' }}>
                           <span style={{ fontWeight: '600' }}>Rahbar:</span> {g.leader.name}
                         </div>
                       </div>
                    ) : (
                       <div style={{ fontSize: '11px', color: 'var(--err)', fontStyle: 'italic', marginBottom: '10px' }}>
                         Loyiha rahbari tayinlanmagan
                       </div>
                    )}

                    {g.balance > 0 && (
                      <form action={async () => {
                        const { withdrawFunds } = await import('@/lib/actions')
                        await withdrawFunds(g.id)
                      }}>
                        <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '12px', padding: '8px' }}>
                           Balansni yechib olish (Guruh uchun sarflash) ↓
                        </button>
                      </form>
                    )}
                  </div>
               ))}
            </div>
         </div>

       </div>
    </div>
  )
}
