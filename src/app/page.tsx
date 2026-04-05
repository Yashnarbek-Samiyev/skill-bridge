import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getDictionary } from '@/lib/i18n'
import { formatUZS } from '@/lib/utils'
import { getTopGroups, getTopStudents, getRecentActivities } from '@/lib/actions'
import { Trophy, Star, Medal, Activity } from 'lucide-react'
import SupportChat from './SupportChat'

export default async function Home() {
  const dict = await getDictionary()
  
  const stats = {
    students: await prisma.user.count({ where: { role: 'STUDENT' } }),
    orders: await prisma.order.count(),
    groups: await prisma.group.count(),
    revenue: await prisma.group.aggregate({ _sum: { balance: true } }).then(res => res._sum.balance || 0)
  }

  const directions = await prisma.direction.findMany()
  const topGroups = await getTopGroups()
  const topStudents = await getTopStudents()
  const activities = await getRecentActivities()

  const icons: Record<string, string> = {
    'Oshpazlik': '🍳',
    'Avtomobil sozlash': '🛠',
    'Kompyuter grafikasi': '💻',
    'Tikuvchilik': '👗',
    'Mehmondo‘stlik': '🏨',
    'Elektrotexnika': '⚡',
    'Elektromontyor': '🔌',
    'Meditsina texnika ta’miri': '🏥'
  }

  return (
    <main>
      
      {/* Hero Section with Slider (Full Width) */}
      <div style={{ position: 'relative', padding: '160px 20px 120px', textAlign: 'center', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes heroFade {
            0% { opacity: 1; transform: scale(1); }
            15% { opacity: 1; }
            25% { opacity: 0; transform: scale(1.05); }
            90% { opacity: 0; }
            100% { opacity: 1; transform: scale(1); }
          }
          .hero-slideshow {
            position: absolute; inset: 0; z-index: 0; background: transparent;
          }
          .hero-slideshow::after {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(10, 15, 35, 0.2);
            z-index: 2;
          }
          .hero-slide {
            position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; animation: heroFade 25s infinite; filter: contrast(1.1); z-index: 1;
          }
          .hero-content * {
            color: #ffffff !important;
          }
          .hero-content h1 {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
          }
        `}} />
        
        <div className="hero-slideshow">
          <div className="hero-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2671&auto=format&fit=crop)', animationDelay: '0s'}}></div>
          <div className="hero-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2670&auto=format&fit=crop)', animationDelay: '5s'}}></div>
          <div className="hero-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2669&auto=format&fit=crop)', animationDelay: '10s'}}></div>
          <div className="hero-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2669&auto=format&fit=crop)', animationDelay: '15s'}}></div>
          <div className="hero-slide" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2671&auto=format&fit=crop)', animationDelay: '20s'}}></div>
        </div>

        <div className="container animate-fade-in hero-content" style={{ maxWidth: '800px', position: 'relative', zIndex: 1, color: '#ffffff' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              padding: '6px 16px',
              borderRadius: '99px',
              fontSize: '12px',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ok)', animation: 'pulse 2s infinite', boxShadow: '0 0 8px var(--ok)' }} />
            {dict.home.badge}
          </div>

          <h1 style={{ fontSize: '60px', marginBottom: '20px', lineHeight: '1.2', textShadow: '0 4px 12px rgba(0,0,0,0.4)', fontWeight: 800, color: '#fff' }}>
            {dict.home.heroTitle}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '19px', marginBottom: '40px', maxWidth: '750px', margin: '0 auto 40px', textShadow: '0 2px 8px rgba(0,0,0,0.4)', lineHeight: '1.6' }}>{dict.home.heroSub}</p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="/login" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px', fontWeight: 600, boxShadow: '0 8px 24px rgba(59,130,246,0.3)', background: 'var(--accent)', color: '#fff', border: 'none' }}>{dict.home.cta}</a>
            <a href="#how" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '18px', fontWeight: 600, background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>{dict.home.howItWorks}</a>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
      {/* Stats Section */}
      <div className="stats-row" style={{ 
        display: 'flex', 
        justifyContent: 'center',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 0',
        marginBottom: '80px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
          <div style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent)' }}>{stats.students}+</div>
          <div style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{dict.home.statsStudents}</div>
        </div>
        <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
          <div style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent)' }}>{stats.groups}</div>
          <div style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{dict.home.statsGroups}</div>
        </div>
        <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
          <div style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent)' }}>{stats.orders}+</div>
          <div style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{dict.home.statsOrders}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--gold)' }}>{formatUZS(stats.revenue)}</div>
          <div style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{dict.home.statsRevenue}</div>
        </div>
      </div>

      {/* OLTIN FOND: HALL OF FAME — PODIUM DESIGN */}
      <div style={{ background: 'var(--surface)', padding: '100px 20px', borderTop: '1px solid var(--border)', position: 'relative' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '8px 24px', 
            background: 'var(--bg)', 
            border: '1px solid var(--border)', 
            borderRadius: '99px',
            marginBottom: '24px'
          }}>
            <Trophy size={18} color="var(--gold)" />
            <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)' }}>
              {dict.home.topStudentsTitle}
            </span>
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px', color: 'var(--invert-heading)' }}>{dict.home.topStudentsTitle}</h2>
          <p style={{ color: 'var(--t2)', fontSize: '17px', marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>
            {dict.home.topStudentsSub}
          </p>
          
          {/* PODIUM STRUCTURE */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'center', 
            gap: '0', 
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            
            {/* TOP 2 — NODIRA MAHMUDOV */}
            <div style={{ 
              order: 1, 
              width: '280px', 
              background: 'var(--card)', 
              border: '1px solid var(--border)', 
              borderBottom: 'none',
              borderRadius: '24px 24px 0 0', 
              padding: '40px 24px 20px',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 -20px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>
                <div style={{ 
                   width: '100px', height: '100px', borderRadius: '50%', 
                   border: '4px solid #C0C0C0', padding: '4px', background: 'var(--bg)',
                   overflow: 'hidden'
                 }}>
                   <img src="/top_student_2.png" alt="Top 2" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', bottom: '-5px', right: '0', width: '32px', height: '32px', background: '#C0C0C0', borderRadius: '50%', color: '#fff', fontSize: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--card)' }}>2</div>
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', marginTop: '40px' }}>Nodira Mahmudov</h4>
              <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '16px', lineHeight: '1.2' }}>{dict.nav.services} - Chilonzor</div>
              <div style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', padding: '8px', borderRadius: '12px', fontSize: '14px', fontWeight: 800 }}>
                5 {dict.home.tasksCount}
              </div>
            </div>

            {/* TOP 1 — DILSHOD OLIMOV (CHAMPION) */}
            <div style={{ 
              order: 2, 
              width: '320px', 
              background: 'var(--bg)', 
              border: '3px solid var(--gold)', 
              borderBottom: 'none',
              borderRadius: '32px 32px 0 0', 
              padding: '60px 32px 40px',
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 -30px 60px rgba(245,158,11,0.15)',
              transform: 'translateY(-20px)'
            }}>
              <div style={{ position: 'absolute', top: '-45px', left: '50%', transform: 'translateX(-50%)' }}>
                <div style={{ 
                  width: '130px', height: '130px', borderRadius: '50%', 
                  border: '6px solid var(--gold)', padding: '6px', background: 'var(--bg)',
                  overflow: 'hidden', boxShadow: '0 0 30px rgba(245,158,11,0.3)'
                }}>
                  <img src="/top_student_1.png" alt="Champion" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', bottom: '0', right: '5px', width: '42px', height: '42px', background: 'var(--gold)', borderRadius: '50%', color: '#fff', fontSize: '22px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--bg)' }}>1</div>
              </div>
              <div style={{ background: 'var(--gold)', color: '#fff', padding: '4px 16px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, display: 'inline-block', marginBottom: '12px', marginTop: '40px', textTransform: 'uppercase' }}>
                {dict.home.champion}
              </div>
              <h4 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>Dilshod Olimov</h4>
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '20px' }}>{dict.nav.services} - Chilonzor</div>
              <div style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--gold)', padding: '12px', borderRadius: '16px', fontSize: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Star size={20} fill="var(--gold)" /> 7 {dict.home.tasksCount}
              </div>
            </div>

            {/* TOP 3 — MAFTUNA YO‘LDOSHEV */}
            <div style={{ 
              order: 3, 
              width: '280px', 
              background: 'var(--card)', 
              border: '1px solid var(--border)', 
              borderBottom: 'none',
              borderRadius: '24px 24px 0 0', 
              padding: '40px 24px 20px',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 -20px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>
                <div style={{ 
                  width: '100px', height: '100px', borderRadius: '50%', 
                  border: '4px solid #CD7F32', padding: '4px', background: 'var(--bg)',
                  overflow: 'hidden'
                }}>
                  <img src="/top_student_3.png" alt="Top 3" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', bottom: '-5px', right: '0', width: '32px', height: '32px', background: '#CD7F32', borderRadius: '50%', color: '#fff', fontSize: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--card)' }}>3</div>
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', marginTop: '40px' }}>Maftuna Yo‘ldoshev</h4>
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '16px' }}>{dict.nav.services} - Chilonzor</div>
              <div style={{ background: 'rgba(205,127,50,0.1)', color: '#CD7F32', padding: '8px', borderRadius: '12px', fontSize: '14px', fontWeight: 800 }}>
                3 {dict.home.tasksCount}
              </div>
            </div>
          </div>

          {/* OTHERS LIST */}
          {topStudents.length > 3 && (
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {topStudents.slice(3).map((student, index) => (
                <div key={student.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', textAlign: 'left', background: 'var(--bg)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid var(--border)' }}>{index + 4}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '15px' }}>{student.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{student.group?.name}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ok)' }}>{student._count.tasks} {dict.home.tasksCount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* JONLI LENTA (ACTIVITY FEED) */}
      <div style={{ padding: '80px 20px', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', justifyContent: 'center' }}>
            <Activity size={28} color="var(--accent)" />
            <h2 style={{ fontSize: '28px' }}>{dict.home.liveActivityTitle}</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activities.map((item: any) => (
              <div key={item.id} className="card animate-fade-in" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px', borderLeft: `4px solid ${item.color}` }}>
                <div style={{ fontSize: '24px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '15px' }}>{item.content}</div>
                  <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>
                    {new Date(item.date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })} • {item.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section id="how" style={{ padding: '60px 0', marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>{dict.home.howItWorks}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
          
          <div className="card" style={{ padding: '30px' }}>
            <div style={{ fontSize: '40px', color: 'var(--accent)', marginBottom: '16px', opacity: 0.8 }}>1</div>
            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{dict.home.step1Title}</h3>
            <p style={{ color: 'var(--t2)', fontSize: '14px', lineHeight: 1.6 }}>{dict.home.step1Desc}</p>
          </div>
          
          <div className="card" style={{ padding: '30px' }}>
            <div style={{ fontSize: '40px', color: 'var(--a2)', marginBottom: '16px', opacity: 0.8 }}>2</div>
            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{dict.home.step2Title}</h3>
            <p style={{ color: 'var(--t2)', fontSize: '14px', lineHeight: 1.6 }}>{dict.home.step2Desc}</p>
          </div>
          
          <div className="card" style={{ padding: '30px', borderTop: '4px solid var(--ok)' }}>
            <div style={{ fontSize: '40px', color: 'var(--ok)', marginBottom: '16px', opacity: 0.8 }}>3</div>
            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{dict.home.step3Title}</h3>
            <p style={{ color: 'var(--t2)', fontSize: '14px', lineHeight: 1.6 }}>{dict.home.step3Desc}</p>
          </div>

        </div>
      </section>

      {/* Why Us */}
      <section id="about" style={{ padding: '60px', background: 'var(--surface)', borderRadius: '24px', textAlign: 'left', marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '40px', fontSize: '32px', textAlign: 'center' }}>{dict.home.whyUs}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{dict.home.why1Title}</h3>
            <p style={{ color: 'var(--t2)', fontSize: '14px' }}>{dict.home.why1Desc}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{dict.home.why2Title}</h3>
            <p style={{ color: 'var(--t2)', fontSize: '14px' }}>{dict.home.why2Desc}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{dict.home.why3Title}</h3>
            <p style={{ color: 'var(--t2)', fontSize: '14px' }}>{dict.home.why3Desc}</p>
          </div>
        </div>
      </section>

      {/* Directions Grid */}
      <section style={{ padding: '20px 0', marginBottom: '60px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>{dict.home.directionsTitle}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {directions.map((dir: any) => (
            <div key={dir.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', transition: 'all 0.3s', cursor: 'default' }}>
              <div style={{ fontSize: '28px', background: 'var(--surface)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                {icons[dir.name] || '⚡'}
              </div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>{dir.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '60px 0', marginBottom: '60px', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>{dict.home.faqTitle}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
          {dict.home.faqs.map((faq: any, i: number) => (
            <div key={i} className="card animate-fade-in" style={{ padding: '24px', borderLeft: '4px solid var(--primary)', animationDelay: (i * 0.1) + 's' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--accent)' }}>{faq.q}</h3>
               <p style={{ color: 'var(--t2)', fontSize: '14px', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      </div>
    </main>
  )
}
