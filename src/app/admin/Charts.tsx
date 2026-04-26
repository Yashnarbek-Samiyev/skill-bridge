'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { formatUZS } from '@/lib/utils'

interface ChartsProps {
  data: any[]
  groups?: any[]
}

const COLORS = ['#3B82F6', '#4ADE80', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#ec4899', '#14b8a6']

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Kutilmoqda",
  ACTIVE: "Jarayonda",
  COMPLETED: "Bajarildi",
}

export default function Charts({ data, groups }: ChartsProps) {
  // Prepare weekly bar chart data
  const days = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak']
  const today = new Date()
  const weekData = days.map((day, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const dayOrders = data.filter(o => {
      const od = new Date(o.createdAt)
      return od.toDateString() === d.toDateString()
    })
    const revenue = dayOrders.reduce((acc, o) => acc + o.price, 0)
    return { name: day, buyurtma: dayOrders.length, daromad: revenue }
  })

  // Status pie chart
  const statusCount: Record<string, number> = {}
  data.forEach(o => {
    statusCount[o.status] = (statusCount[o.status] || 0) + 1
  })
  const pieData = Object.entries(statusCount).map(([key, value]) => ({
    name: STATUS_LABELS[key] || key,
    value,
  }))

  // Group balance bar chart
  const groupData = (groups || [])
    .slice(0, 8)
    .map(g => ({
      name: g.name.split(' ')[0] + ' ' + (g.name.split(' ')[1] || ''),
      balans: Math.round(g.balance / 1000),
      buyurtma: g._count?.orders || 0,
    }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '12px 16px', fontSize: '13px'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>{label}</div>
          {payload.map((p: any, i: number) => (
            <div key={i} style={{ color: p.color, marginBottom: '2px' }}>
              {p.name}: <strong>{p.name === 'daromad' ? formatUZS(p.value) : p.value}</strong>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Row 1: Area chart + Pie chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>

        {/* Weekly area chart */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Haftalik buyurtmalar</span>
            <span style={{ fontSize: '11px', color: 'var(--t3)', fontWeight: 400 }}>Oxirgi 7 kun</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="colorBuyurtma" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="buyurtma"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fill="url(#colorBuyurtma)"
                dot={{ fill: '#3B82F6', strokeWidth: 0, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie chart */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
            Holat bo'yicha
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: '8px', fontSize: '12px'
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: '11px', color: 'var(--t2)' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontSize: '13px' }}>
              Ma'lumot yo'q
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Group balance bar chart */}
      {groupData.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Guruhlar balansi (ming so'm)</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={groupData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="balans" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Balans (ming so'm)" />
              <Bar dataKey="buyurtma" fill="#4ADE80" radius={[6, 6, 0, 0]} name="Buyurtmalar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
