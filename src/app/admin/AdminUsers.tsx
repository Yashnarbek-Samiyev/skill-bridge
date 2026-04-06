'use client'

import { useState } from 'react'
import { createUser } from '@/lib/actions'
import { UserPlus, Shield, User, Trash2, Search } from 'lucide-react'

export default function AdminUsers({ users, groups, dict }: { users: any[], groups: any[], dict: any }) {
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleAddUser(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    const name = formData.get('name') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string
    const groupId = formData.get('groupId') as string
    const phone = formData.get('phone') as string

    const res = await createUser({ name, username, password, role, phone, groupId: groupId || undefined })
    
    if (res.error) {
      setError(dict.errors[res.error] || dict.errors.generic)
    } else {
      setSuccess(true)
      // Clear form logic could go here if managed by state
    }
    setLoading(false)
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.username.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
        
        {/* Create User Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <UserPlus size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '18px' }}>Yangi foydalanuvchi (ID)</h3>
          </div>
          
          <form action={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--err)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid var(--err)' }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--ok)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid var(--ok)' }}>
                ✅ Foydalanuvchi muvaffaqiyatli yaratildi!
              </div>
            )}
            <div className="form-group">
              <label className="form-label">To'liq ism (F.I.SH)</label>
              <input type="text" name="name" className="form-input" placeholder="Aziz Karimov" required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Talaba ID / Username</label>
              <input type="text" name="username" className="form-input" placeholder="ID12345" required />
            </div>

            <div className="form-group">
              <label className="form-label">Telefon raqami</label>
              <input type="tel" name="phone" className="form-input" placeholder="+998..." />
            </div>

            <div className="form-group">
              <label className="form-label">Parol</label>
              <input type="password" name="password" className="form-input" defaultValue="123" required />
            </div>

            <div className="form-group">
              <label className="form-label">Rol</label>
              <select name="role" className="form-input" required>
                <option value="STUDENT">Talaba</option>
                <option value="LEADER">Loyiha rahbari</option>
                <option value="CLIENT">Mijoz</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Guruh (Talabalar uchun)</label>
              <select name="groupId" className="form-input">
                <option value="">-- Guruhni tanlang --</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.region})</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
               {loading ? 'Yaratilmoqda...' : 'Foydalanuvchini yaratish +'}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px' }}>Barcha foydalanuvchilar</h3>
            <div style={{ position: 'relative', width: '200px' }}>
               <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)' }} />
               <input 
                  type="text" 
                  placeholder="Qidirish..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px 6px 30px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px' }}
               />
            </div>
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)', fontSize: '12px', color: 'var(--t3)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px' }}>Foydalanuvchi</th>
                  <th style={{ padding: '10px' }}>Rol</th>
                  <th style={{ padding: '10px' }}>Guruh</th>
                  <th style={{ padding: '10px' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--t3)' }}>@{user.username}</div>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        padding: '2px 8px', 
                        borderRadius: '10px', 
                        background: user.role === 'ADMIN' ? 'rgba(239,68,68,0.1)' : user.role === 'LEADER' ? 'rgba(59,130,246,0.1)' : 'rgba(107,114,128,0.1)',
                        color: user.role === 'ADMIN' ? '#EF4444' : user.role === 'LEADER' ? '#3B82F6' : '#6B7280',
                        fontWeight: 'bold'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--t2)' }}>
                      {user.group?.name || '---'}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                       <button style={{ background: 'none', border: 'none', color: 'var(--err)', cursor: 'pointer' }} title="O'chirish">
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
