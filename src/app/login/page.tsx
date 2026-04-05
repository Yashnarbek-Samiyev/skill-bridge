import { redirect } from 'next/navigation'
import { createSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { getDictionary } from '@/lib/i18n'

async function handleLogin(formData: FormData) {
  'use server'
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  
  if (!username || !password) return

  const user = await prisma.user.findUnique({ where: { username } })
  if (user && user.password === password) {
    await createSession(user.id, user.role)
    if (user.role === 'ADMIN') redirect('/admin')
    if (user.role === 'LEADER') redirect('/leader')
    if (user.role === 'STUDENT') redirect('/student')
    if (user.role === 'CLIENT') redirect('/client')
  }
}

export default async function LoginPage() {
  const dict = await getDictionary()

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
        <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '8px' }}>{dict.login.title}</h1>
        <p style={{ textAlign: 'center', color: 'var(--t2)', fontSize: '14px', marginBottom: '32px' }}>
          {dict.login.sub}
        </p>

        <form action={handleLogin}>
          <div className="form-group">
            <label className="form-label">{dict.login.username}</label>
            <input type="text" name="username" className="form-input" placeholder="s_0_0_2" required />
          </div>
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label">{dict.login.password}</label>
            <input type="password" name="password" className="form-input" placeholder="123" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
            {dict.login.btn} →
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
          <a href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>{dict.nav.register}</a>
        </div>
      </div>
    </div>
  )
}
