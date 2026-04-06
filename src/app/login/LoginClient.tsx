'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { handleLoginAction } from '@/lib/actions'
import { Dictionary } from '@/lib/i18n'

export default function LoginClient({ dict }: { dict: Dictionary }) {
  const [state, action, isPending] = useActionState(handleLoginAction, null)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', position: 'relative', padding: '20px', overflow: 'hidden' }}>
      
      {/* Background Slideshow */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bgFade {
          0% { opacity: 1; transform: scale(1); }
          15% { opacity: 1; }
          25% { opacity: 0; transform: scale(1.05); }
          90% { opacity: 0; }
          100% { opacity: 1; transform: scale(1); }
        }
        .bg-slideshow {
          position: absolute; inset: 0; z-index: 0; background: #0b1120;
        }
        .bg-slideshow::after {
          content: "";
          position: absolute;
          inset: 0;
            background: rgba(15, 23, 42, 0.95);
          z-index: 1;
        }
        .bg-slide {
          position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; animation: bgFade 25s infinite; filter: grayscale(80%) contrast(1.2) brightness(0.7);
        }
      `}} />
      <div className="bg-slideshow">
        <div className="bg-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop)', animationDelay: '0s'}}></div>
        <div className="bg-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1619642751034-765f37754bd7?q=80&w=2674&auto=format&fit=crop)', animationDelay: '5s'}}></div>
        <div className="bg-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2574&auto=format&fit=crop)', animationDelay: '10s'}}></div>
        <div className="bg-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1581092918056-0c4c3cb8f1f5?q=80&w=2574&auto=format&fit=crop)', animationDelay: '15s'}}></div>
        <div className="bg-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2671&auto=format&fit=crop)', animationDelay: '20s'}}></div>
      </div>

      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px', position: 'relative', zIndex: 1, background: 'var(--surface)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" rx="14" fill="#3B82F6" />
            {/* Vertical line for 'B' */}
            <path d="M16 12V36" stroke="white" strokeWidth="4" strokeLinecap="round" />
            {/* S-curve that also forms the loops of 'B' */}
            <path
              d="M16 12C16 12 34 12 34 18C34 24 16 24 16 24C16 24 34 24 34 30C34 36 16 36 16 36"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '8px' }}>{dict.login.title}</h1>
        <p style={{ textAlign: 'center', color: 'var(--t2)', fontSize: '14px', marginBottom: '32px' }}>
          {dict.login.sub}
        </p>

        <form action={action}>
          {/* Error Message */}
          {state?.error && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--err)', 
              borderRadius: '8px', 
              color: 'var(--err)', 
              fontSize: '13px', 
              fontWeight: 600,
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ⚠️ {dict.errors[state.error as keyof typeof dict.errors] || dict.errors.generic}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{dict.login.username}</label>
            <input type="text" name="username" className="form-input" placeholder="..." required />
          </div>
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label">{dict.login.password}</label>
            <input type="password" name="password" className="form-input" placeholder="••••••••" required />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isPending}
            style={{ width: '100%', padding: '14px', fontSize: '16px', opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? '...' : dict.login.btn} →
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(59,130,246,0.05)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
             🚀 {dict.login.demoTitle}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { roleKey: 'admin', user: 'admin' },
              { roleKey: 'leader', user: 'yashnarbek' },
              { roleKey: 'student', user: 's_0_0_2' },
              { roleKey: 'client', user: 'rustam' },
            ].map((d) => (
              <div key={d.user} style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--t3)', fontWeight: 600 }}>{dict.login.roles[d.roleKey as keyof typeof dict.login.roles]}</div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>{d.user} <span style={{ color: 'var(--t3)', fontWeight: 400 }}>/ 123</span></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--t3)' }}>
          {dict.login.noAccount}{' '}
          <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>{dict.nav.register}</Link>
        </div>
      </div>
    </div>
  )
}
