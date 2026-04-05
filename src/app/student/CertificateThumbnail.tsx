'use client'

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle } from 'lucide-react'

interface ThumbnailProps {
  studentName: string
  serviceName: string
  orderId: string
  leaderName: string
  date: string
  dict: any
}

export default function CertificateThumbnail({ studentName, serviceName, orderId, leaderName, date, dict }: ThumbnailProps) {
  const verificationUrl = `https://techwork.uz/verify/${orderId}`

  return (
    <div style={{ 
      width: '100%', 
      aspectRatio: '1.414 / 1', 
      overflow: 'hidden', 
      borderRadius: '12px', 
      border: '1px solid var(--border)',
      background: '#fff',
      position: 'relative',
      cursor: 'pointer'
    }}>
      <div style={{
        width: '800px', 
        height: '565px',
        transform: 'scale(0.2)', // Adjusted for list view small box
        transformOrigin: 'top left',
        position: 'absolute',
        top: '5px',
        left: '5px',
        pointerEvents: 'none'
      }}>
        <div className="certificate-container" style={{ margin: 0, borderWidth: '10px' }}>
          <div className="certificate-inner" style={{ padding: '30px' }}>
             <div className="cert-seal-gold" style={{ bottom: '40px', width: '60px', height: '60px' }}>SEAL</div>
             
             <div style={{fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--accent)', textAlign: 'center'}}>TECHWORK</div>
             <div style={{fontSize: '24px', fontWeight: '900', color: 'var(--accent)', textAlign: 'center', marginBottom: '10px'}}>{dict.student.certificateTitle}</div>
             
             <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginBottom: '10px' }}>{dict.student.certificateBody}</p>
             
             <h2 style={{ fontSize: '24px', textAlign: 'center', borderBottom: '2px solid var(--accent)', paddingBottom: '10px', marginBottom: '20px' }}>{serviceName}</h2>

             <div style={{ textAlign: 'center', margin: '20px 0' }}>
               <div style={{ fontSize: '12px', color: '#666' }}>{dict.student.leaderName}:</div>
               <div style={{ fontSize: '24px', fontWeight: '900' }}>{studentName}</div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                <div style={{ width: '80px', textAlign: 'center' }}>
                   <div style={{ padding: '2px', background: '#fff', border: '1px solid #eee' }}>
                      <QRCodeSVG value={verificationUrl} size={50} />
                   </div>
                   <div style={{ fontSize: '6px', color: '#999', marginTop: '4px' }}>{dict.student.verify}</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                   <div style={{ fontFamily: 'Island Moments', fontSize: '32px', color: 'var(--accent)', borderBottom: '1px solid #333', width: '120px', margin: '0 auto' }}>{leaderName}</div>
                   <div style={{ fontSize: '7px', color: '#666', textTransform: 'uppercase', marginTop: '4px' }}>{dict.student.sign}</div>
                </div>
                <div style={{ width: '80px', textAlign: 'center' }}>
                   <div style={{ fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid #333' }}>{date}</div>
                   <div style={{ fontSize: '7px', color: '#666', marginTop: '4px' }}>{dict.nav.home === 'Bosh sahifa' ? 'SANASI' : dict.nav.home === 'Главная' ? 'ДАТА' : 'DATE'}</div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'rgba(255,255,255,0)', 
        zIndex: 2,
        transition: 'background 0.2s'
      }} />
    </div>
  )
}
