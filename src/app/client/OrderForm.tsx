'use client'
import { useState } from 'react'
import { createOrder } from '@/lib/actions'
import { formatUZS } from '@/lib/utils'

const ICONS: Record<string, string> = {
  'IT va Dasturlash': '💻',
  'Grafik Dizayn': '🎨',
  'Maishiy Texnika Ta\'miri': '🛠',
  'Oshpazlik va Konditer': '🍳',
  'Tikuvchilik': '👗',
  'Avtomobil sozlash': '🚗',
  'Elektromontyor': '🔌',
  'Meditsina texnikalarini ta’mirlash': '🏥'
}

export default function OrderForm({ services, clientId, dict }: { services: any[], clientId: string, dict: any }) {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [qty, setQty] = useState(1)
  const [region, setRegion] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isPaying, setIsPaying] = useState(false)

  async function handleSubmit() {
    setIsPaying(true)
    // Simulate payment delay
    await new Promise(res => setTimeout(res, 2000))
    
    await createOrder({
      clientId,
      serviceId: selectedService.id,
      description,
      address,
      region,
      price: (selectedService as any).basePrice * qty,
      qty,
      deadline: deadline ? new Date(deadline) : undefined
    } as any)
    
    setIsPaying(false)
    setStep(5) // Success
  }

  if (step === 5) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderTop: '4px solid var(--ok)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ marginBottom: '12px' }}>{dict.confirm}</h2>
        <p style={{ color: 'var(--t2)', marginBottom: '30px' }}>{dict.step3Desc || 'Success!'}</p>
        <button className="btn btn-primary" style={{ padding: '14px 28px' }} onClick={() => {
          setStep(1); setSelectedService(null); setDeadline('');
        }}>
          + {dict.newOrder}
        </button>
      </div>
    )
  }

  return (
    <div className="card animate-fade-in" style={{ padding: '30px', borderRadius: '16px', border: '1px solid var(--border)' }}>
      {/* Progress Steps */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '30px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, color: step >= s ? 'var(--accent)' : 'var(--t3)', fontWeight: step >= s ? 700 : 500, transition: 'color 0.3s' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {s === 1 && dict.step1}
              {s === 2 && dict.step2}
              {s === 3 && dict.step3}
              {s === 4 && '💳'}
            </div>
            <div style={{ height: '3px', background: step >= s ? 'var(--accent)' : 'var(--border)', borderRadius: '2px' }}/>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {services.map((s: any) => {
              const isSelected = selectedService?.id === s.id;
              return (
                <div 
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  style={{ 
                    cursor: 'pointer', 
                    border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    background: isSelected ? 'rgba(59,130,246,0.03)' : 'var(--bg)',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{ICONS[s.direction.name] || '📌'}</div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text)' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '12px' }}>{s.direction.name}</div>
                  <div style={{ fontWeight: 900, color: isSelected ? 'var(--accent)' : 'var(--ok)', fontSize: '16px' }}>
                    {formatUZS(s.basePrice)} <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--t3)' }}>/ {s.unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <button className="btn btn-primary" style={{ marginTop: '30px', width: '100%', padding: '16px' }} disabled={!selectedService} onClick={() => setStep(2)}>
            {dict.next} →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">{dict.qty}</label>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">{dict.region}</label>
              <select className="form-input" required value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="">-- {dict.region} --</option>
                <option value="Chilonzor">Chilonzor</option>
                <option value="Yunusobod">Yunusobod</option>
                <option value="Mirzo Ulugbek">Mirzo Ulugbek</option>
                <option value="Shaykhontokhur">Shaykhontokhur</option>
                <option value="Yakkasaray">Yakkasaray</option>
                <option value="Yashnobod">Yashnobod</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">📅 {dict.confirm}</label>
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">{dict.address}</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-input" placeholder="..." required />
          </div>
          <div className="form-group">
            <label className="form-label">{dict.desc}</label>
            <textarea className="form-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="..."></textarea>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-secondary" style={{ padding: '16px 24px' }} onClick={() => setStep(1)}>← {dict.back}</button>
            <button className="btn btn-primary" style={{ flex: 1, padding: '16px 24px' }} disabled={!region || !address || !deadline} onClick={() => setStep(3)}>{dict.next} →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '30px' }}>
             <h4 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', fontSize: '18px' }}>{dict.confirm}</h4>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
               <span style={{ color: 'var(--t3)' }}>{dict.step1}:</span>
               <strong>{selectedService.name}</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
               <span style={{ color: 'var(--t3)' }}>{dict.confirm}:</span>
               <strong>{new Date(deadline).toLocaleString()}</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
               <span style={{ color: 'var(--t3)' }}>{dict.address}:</span>
               <strong>{region}, {address}</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 'bold' }}>{dict.next}:</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--ok)' }}>{formatUZS((selectedService as any).basePrice * qty)}</span>
             </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-secondary" style={{ padding: '16px 24px' }} onClick={() => setStep(2)}>← {dict.back}</button>
            <button className="btn btn-primary" style={{ flex: 1, padding: '16px 24px', background: 'var(--ok)' }} onClick={() => setStep(4)}>{dict.confirm} →</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '32px', borderRadius: '16px', maxWidth: '400px', margin: '0 auto 30px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Simulation</div>
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'left', marginBottom: '16px', background: 'var(--surface)' }}>
              <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase' }}>CARD</div>
              <div style={{ fontSize: '14px' }}>**** **** **** 8888</div>
            </div>
          </div>

          <p style={{ color: 'var(--t2)', fontSize: '13px', marginBottom: '20px' }}>{dict.next}: <strong>{formatUZS((selectedService as any).basePrice * qty)}</strong></p>
          
          <button className="btn btn-primary" style={{ width: '100%', padding: '16px' }} disabled={isPaying} onClick={handleSubmit}>
            {isPaying ? '...' : dict.confirm}
          </button>
          
          <button className="btn btn-secondary" style={{ marginTop: '12px', border: 'none' }} onClick={() => setStep(3)} disabled={isPaying}>{dict.back}</button>
        </div>
      )}
    </div>
  )
}
