'use client'

import { useState } from 'react'
import { updateService } from '@/lib/actions'
import { Tag, Edit, Plus, Briefcase, DollarSign, Save, Loader2 } from 'lucide-react'
import { formatUZS } from '@/lib/utils'

export default function AdminServices({ directions }: { directions: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [localEdits, setLocalEdits] = useState<Record<string, { price: number, unit: string }>>({})

  async function handleUpdate(serviceId: string, currentPrice: number, currentUnit: string) {
    const edit = localEdits[serviceId]
    const priceToSave = edit ? edit.price : currentPrice
    const unitToSave = edit ? edit.unit : currentUnit

    if (priceToSave < 0) return
    
    setLoadingId(serviceId)
    await updateService(serviceId, { basePrice: priceToSave, unit: unitToSave })
    
    // Clear local edit after save
    setLocalEdits(prev => {
      const next = { ...prev }
      delete next[serviceId]
      return next
    })
    setLoadingId(null)
  }

  const handlePriceChange = (serviceId: string, val: string, currentUnit: string) => {
    const price = Number(val)
    setLocalEdits(prev => ({
      ...prev,
      [serviceId]: { 
        price, 
        unit: prev[serviceId]?.unit || currentUnit 
      }
    }))
  }

  const handleUnitChange = (serviceId: string, unit: string, currentPrice: number) => {
    setLocalEdits(prev => ({
      ...prev,
      [serviceId]: { 
        price: prev[serviceId]?.price ?? currentPrice, 
        unit 
      }
    }))
  }

  return (
    <div className="animate-fade-in">
       <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
         
          <div className="card">
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <Tag size={20} color="var(--accent)" />
                <h3 style={{ fontSize: '18px' }}>Xizmatlar va Narxlarni boshqarish</h3>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                {directions.map(dir => (
                   <div key={dir.id} style={{ 
                     padding: '24px', 
                     borderRadius: '16px', 
                     border: '1px solid var(--border)', 
                     background: 'var(--bg)',
                     boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                   }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <div style={{ padding: '10px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px' }}>
                              <Briefcase size={20} color="var(--accent)" />
                           </div>
                           <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>{dir.name}</h4>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--t3)', background: 'var(--surface)', padding: '4px 10px', borderRadius: '12px' }}>
                           {dir.services.length} xizmatlar
                        </span>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dir.services.map((s: any) => {
                           const isEdited = !!localEdits[s.id]
                           const currentPrice = localEdits[s.id]?.price ?? s.basePrice
                           const currentUnit = localEdits[s.id]?.unit ?? s.unit

                           return (
                            <div key={s.id} style={{ 
                              padding: '16px', 
                              background: 'var(--surface)', 
                              borderRadius: '12px', 
                              border: isEdited ? '1px solid var(--accent)' : '1px solid var(--border)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                              transition: 'all 0.2s'
                            }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div style={{ fontSize: '15px', fontWeight: '600', maxWidth: '70%', lineHeight: '1.4' }}>{s.name}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--t3)', background: 'var(--bg)', padding: '2px 8px', borderRadius: '4px' }}>
                                    Hozir: {formatUZS(s.basePrice)} / {s.unit}
                                  </div>
                               </div>

                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  {/* Price Input with proper padding for prefix */}
                                  <div style={{ position: 'relative', flex: '1 1 120px' }}>
                                     <input 
                                        type="number" 
                                        value={currentPrice}
                                        onChange={(e) => handlePriceChange(s.id, e.target.value, s.unit)}
                                        style={{ 
                                          width: '100%', 
                                          padding: '10px 12px', 
                                          paddingLeft: '38px', // Space for UZS
                                          borderRadius: '8px', 
                                          border: '1px solid var(--border)',
                                          fontSize: '14px',
                                          fontWeight: '700',
                                          color: isEdited ? 'var(--accent)' : 'var(--ok)',
                                          background: 'var(--bg)',
                                          outline: 'none'
                                        }} 
                                     />
                                     <span style={{ 
                                       position: 'absolute', 
                                       left: '10px', 
                                       top: '50%', 
                                       transform: 'translateY(-50%)', 
                                       color: 'var(--t3)', 
                                       fontSize: '10px',
                                       fontWeight: '800'
                                     }}>
                                      UZS
                                     </span>
                                  </div>

                                  <select 
                                     value={currentUnit} 
                                     onChange={(e) => handleUnitChange(s.id, e.target.value, s.basePrice)}
                                     style={{ 
                                       padding: '10px', 
                                       borderRadius: '8px', 
                                       border: '1px solid var(--border)', 
                                       fontSize: '13px',
                                       background: 'var(--bg)',
                                       color: 'var(--t2)',
                                       minWidth: '94px',
                                       cursor: 'pointer'
                                     }}
                                  >
                                     <option value="dona">/ dona</option>
                                     <option value="soat">/ soat</option>
                                     <option value="kun">/ kun</option>
                                     <option value="kv/m">/ kv.m</option>
                                     <option value="loyha">/ loyiha</option>
                                  </select>

                                  <button 
                                    onClick={() => handleUpdate(s.id, s.basePrice, s.unit)}
                                    disabled={!isEdited || loadingId === s.id}
                                    style={{ 
                                      padding: '10px 16px', 
                                      borderRadius: '8px', 
                                      background: isEdited ? 'var(--accent)' : 'var(--surface)', 
                                      color: isEdited ? '#fff' : 'var(--t3)',
                                      border: isEdited ? 'none' : '1px solid var(--border)',
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center', 
                                      gap: '8px',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      minWidth: '100px',
                                      cursor: isEdited ? 'pointer' : 'not-allowed',
                                      transition: 'all 0.2s',
                                      opacity: loadingId === s.id ? 0.7 : 1
                                    }}
                                  >
                                    {loadingId === s.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Saqlash
                                  </button>
                               </div>
                            </div>
                           )
                        })}
                        <button className="btn btn-secondary" style={{ width: '100%', padding: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                           <Plus size={16} /> Yangi xizmat turini qo'shish
                        </button>
                     </div>
                   </div>
                ))}
             </div>
          </div>

       </div>
    </div>
  )
}
