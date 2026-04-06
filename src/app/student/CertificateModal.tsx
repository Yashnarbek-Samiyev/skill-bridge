'use client'

import React, { useState, useRef, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Printer, Award, CheckCircle, Download, Eye } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface CertificateProps {
  studentName: string
  serviceName: string
  orderId: string
  leaderName: string
  date: string
  dict: any
  variant?: 'list' | 'modal'
}

export default function CertificateModal({ studentName, serviceName, orderId, leaderName, date, dict, variant = 'modal' }: CertificateProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  const verificationUrl = `https://skill-bridge.uz/verify/${orderId}`

  // 🔒 Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    
    // ⏳ Wait for the hidden container to be rendered in the DOM
    setTimeout(async () => {
      if (!certificateRef.current) {
        setIsDownloading(false)
        return
      }

      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 800,
          height: 565,
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById(`capture-${orderId}`)
            if (el) {
              el.style.visibility = 'visible'
              el.style.position = 'relative'
            }
          }
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [800, 565]
        })
        
        pdf.addImage(imgData, 'PNG', 0, 0, 800, 565)
        pdf.save(`Sertifikat_${studentName.replace(/\s+/g, '_')}.pdf`)
      } catch (error) {
        console.error('PDF generation failed:', error)
      } finally {
        setIsDownloading(false)
      }
    }, 300) // Small delay to ensure render
  }

  const modalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: '#000' }}>
      <div className="no-print" style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '12px' }}>
        <button 
          onClick={handleDownloadPDF} 
          disabled={isDownloading}
          className="btn btn-primary" 
          style={{ background: 'var(--ok)', color: '#fff' }}
        >
          {isDownloading ? '...' : <Download size={20} />}
        </button>
        <button onClick={() => window.print()} className="btn btn-primary" style={{ background: '#fff', color: '#000' }}>
          <Printer size={20} />
        </button>
        <button onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ background: 'var(--err)', color: '#fff' }}>
          <X size={20} />
        </button>
      </div>

      <div className="certificate-container" style={{ margin: 0 }}>
         <CertificateContent 
            studentName={studentName} 
            serviceName={serviceName} 
            orderId={orderId} 
            leaderName={leaderName} 
            date={date} 
            dict={dict} 
            verificationUrl={verificationUrl}
         />
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Trigger Area */}
      {variant === 'modal' ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsOpen(true)} 
            className="btn btn-primary" 
            style={{ background: 'var(--accent)', padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}
          >
            <Eye size={14} /> {dict.student.viewCertificate}
          </button>
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="btn btn-primary" 
            style={{ background: 'var(--ok)', padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isDownloading ? '...' : <Download size={14} />}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="cert-view-link" onClick={() => setIsOpen(true)}>
             <Eye size={16} /> {dict.student.viewCertificate}
           </button>
           <button className="cert-download-btn" onClick={handleDownloadPDF} disabled={isDownloading}>
             {isDownloading ? '...' : <><Download size={18} /> PDF Yuklab Olish</>}
           </button>
        </div>
      )}

      {/* 2. Modal Overlay */}
      {isOpen && modalContent}

      {/* 3. Hidden Capture Area (ONLY ON DOWNLOAD) */}
      {isDownloading && (
        <div 
          id={`capture-${orderId}`}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '800px', 
            height: '565px', 
            visibility: 'hidden', 
            pointerEvents: 'none',
            zIndex: -999 
          }}
        >
          <div ref={certificateRef} className="certificate-container" style={{ margin: 0 }}>
             <CertificateContent 
                studentName={studentName} 
                serviceName={serviceName} 
                orderId={orderId} 
                leaderName={leaderName} 
                date={date} 
                dict={dict} 
                verificationUrl={verificationUrl}
             />
          </div>
        </div>
      )}
    </>
  )
}

function CertificateContent({ studentName, serviceName, orderId, leaderName, date, dict, verificationUrl }: any) {
  return (
    <div className="certificate-inner" style={{ padding: '30px 40px' }}>
      {/* Formal Seal Background */}
      <div className="cert-seal-gold" style={{ bottom: '70px', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
         <svg width="80" height="80" viewBox="0 0 48 48" fill="none">
           <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
           <path d="M16 12V36" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
           <path d="M16 12C16 12 34 12 34 18C34 24 16 24 16 24C16 24 34 24 34 30C34 36 16 36 16 36" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
         <div style={{ marginTop: '8px', fontSize: '8px', fontWeight: 'bold' }}>SKILL-BRIDGE OFFICIAL</div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
           <div style={{fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px', color: 'var(--accent)'}}>SKILL-BRIDGE PLATFORM</div>
        </div>
        
        <div className="certificate-header" style={{ marginBottom: '5px', fontSize: '36px' }}>LOYIHA SERTIFIKATI</div>
        
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '15px' }}>
          Ushbu hujjat talabaning quyidagi loyihani muvaffaqiyatli yakunlaganini tasdiqlaydi:
        </p>
        
        <h2 style={{ fontSize: '32px', margin: '15px 0', borderBottom: '2px solid var(--accent)', display: 'inline-block', padding: '0 40px', fontWeight: '900' }}>
          {serviceName}
        </h2>

        <div style={{ margin: '20px 0' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>Berildi:</p>
          <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: '5px 0' }}>{studentName}</h3>
        </div>
      </div>

      {/* Footer: Signature, QR, Date */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px', textAlign: 'center' }}>
        {/* QR Section */}
        <div style={{ width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ border: '4px solid white', padding: '5px', background: 'white', borderStyle: 'double', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <QRCodeSVG value={verificationUrl} size={75} />
           </div>
           <div style={{ fontSize: '8px', marginTop: '8px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
              ID: {orderId.slice(-8).toUpperCase()}<br/>
              Sertifikatni tekshirish
           </div>
        </div>

        {/* Signature Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '10px' }}>
          <div className="signature-line" style={{ color: 'var(--accent)', marginBottom: '0px', height: '45px' }}>
            {leaderName}
          </div>
          <div style={{ borderTop: '2px solid #333', width: '220px', paddingTop: '8px' }}>
             <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px' }}>
               LOYIHA RAHBARI IMZOSI
             </div>
             <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 'bold', marginTop: '2px' }}>
               {leaderName}
             </div>
          </div>
        </div>

        {/* Date Section */}
        <div style={{ width: '150px' }}>
          <div style={{ fontSize: '18px', fontWeight: '900', borderBottom: '2px solid #333', display: 'inline-block', padding: '0 10px', marginBottom: '8px' }}>
            {date}
          </div>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
            SANASI
          </div>
        </div>
      </div>

      <div style={{ marginTop: '25px', fontSize: '9px', color: '#999', letterSpacing: '0.5px' }}>
        Ushbu hujjat Skill-Bridge Platformasi orqali raqamli imzolangan.
      </div>
    </div>
  )
}
