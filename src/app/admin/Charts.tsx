'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'

export default function Charts({ data }: { data: any[] }) {
  // Let's create some fake monthly growth data based on total count
  const growthData = [
    { name: 'Yanvar', daromad: 200000 },
    { name: 'Fevral', daromad: 500000 },
    { name: 'Mart', daromad: 1200000 },
    { name: 'Aprel', daromad: data.reduce((acc, curr) => acc + curr.price, 0) },
  ]

  const serviceData = [
    { name: 'Dizayn', count: 12 },
    { name: 'SMM', count: 19 },
    { name: 'Pazanda', count: 8 },
    { name: 'IT xizmat', count: 15 },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
      
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Moliyaviy O'sish (Oy bo'yicha)</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--t2)" />
              <YAxis stroke="var(--t2)" />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="daromad" stroke="var(--ok)" strokeWidth={3} dot={{ r: 5, fill: 'var(--ok)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Xizmatlar ommabopligi</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--t2)" />
              <YAxis stroke="var(--t2)" />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
