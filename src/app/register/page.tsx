import { redirect } from 'next/navigation'
import { createSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n'

async function handleRegister(formData: FormData) {
  'use server'
  const name = (formData.get('name') as string)?.trim()
  const username = (formData.get('username') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!name || !username || !password || !phone) return
  if (password !== confirm) return
  if (password.length < 4) return

  // Check if username taken
  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) return

  const user = await prisma.user.create({
    data: {
      name,
      username,
      password, // plain text for demo purposes
      phone,
      role: 'CLIENT',
    }
  })

  await createSession(user.id, user.role)
  redirect('/client')
}

export default async function RegisterPage() {
  const dict = await getDictionary()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      position: 'relative',
      padding: '20px',
      overflow: 'hidden'
    }}>

      {/* Background */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bgFadeReg {
          0% { opacity: 1; transform: scale(1); }
          15% { opacity: 1; }
          25% { opacity: 0; transform: scale(1.05); }
          90% { opacity: 0; }
          100% { opacity: 1; transform: scale(1); }
        }
        .reg-bg { position: absolute; inset: 0; z-index: 0; background: #0b1120; }
        .reg-bg::after {
          content: "";
          position: absolute; inset: 0;
          background: rgba(15, 23, 42, 0.95);
          z-index: 1;
        }
        .reg-slide {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0; animation: bgFadeReg 25s infinite;
          filter: grayscale(70%) brightness(0.6);
        }
      `}} />
      <div className="reg-bg">
        <div className="reg-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop)', animationDelay: '0s'}}></div>
        <div className="reg-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1581092918056-0c4c3cb8f1f5?q=80&w=2574&auto=format&fit=crop)', animationDelay: '8s'}}></div>
        <div className="reg-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2671&auto=format&fit=crop)', animationDelay: '16s'}}></div>
      </div>

      {/* Card */}
      <div className="card animate-fade-in" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '40px',
        position: 'relative',
        zIndex: 1,
        background: 'var(--surface)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="12" fill="var(--accent)" />
              <rect x="10" y="14" width="14" height="4" rx="1" fill="white" />
              <rect x="15" y="14" width="4" height="18" rx="1" fill="white" />
              <polyline
                points="24,14 27,32 32,20 37,32 40,14"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--invert-heading)', letterSpacing: '-0.5px' }}>{dict.register.title}</h1>
          <p style={{ color: 'var(--t2)', fontSize: '13px' }}>
            {dict.register.sub}
          </p>
        </div>

        <form action={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">{dict.register.fullName}</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="..."
              required
              minLength={3}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">{dict.register.phone}</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+998 90 123 45 67"
              required
            />
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">{dict.register.username}</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="..."
              required
              minLength={3}
              pattern="[a-zA-Z0-9_]+"
              title="Faqat lotin harflari, raqamlar va _ belgisi"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">{dict.register.password}</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              required
              minLength={4}
            />
          </div>

          {/* Confirm password */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">{dict.register.confirm}</label>
            <input
              type="password"
              name="confirm"
              className="form-input"
              placeholder="••••••••"
              required
              minLength={4}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {dict.register.btn}
          </button>
        </form>

        {/* Login link */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--t3)' }}>
          {dict.register.haveAccount}{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            {dict.nav.login}
          </Link>
        </div>
      </div>
    </div>
  )
}
