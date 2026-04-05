'use client'
import { useState } from 'react'
import { createReview } from '@/lib/actions'

export default function ReviewForm({ orderId, dict }: { orderId: string, dict: any }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    await createReview(orderId, rating, comment)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '12px', padding: '16px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>{dict.rate}</div>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="form-input" style={{ width: '100%', padding: '10px' }}>
          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
          <option value="4">⭐⭐⭐⭐ (4)</option>
          <option value="3">⭐⭐⭐ (3) </option>
          <option value="2">⭐⭐ (2)</option>
          <option value="1">⭐ (1)</option>
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <input 
          type="text" 
          className="form-input" 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          placeholder="..." 
          style={{ width: '100%', padding: '10px' }} 
        />
      </div>
      <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '12px', fontSize: '14px', width: '100%', fontWeight: 800 }}>
        {isSubmitting ? '...' : dict.confirm + ' ✓'}
      </button>
    </form>
  )
}
