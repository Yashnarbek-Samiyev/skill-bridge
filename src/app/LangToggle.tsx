'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LangToggle() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  function changeLang(e: React.ChangeEvent<HTMLSelectElement>) {
    const lang = e.target.value
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`
    router.refresh()
  }

  // To display correctly initially if we wanted to read from cookie cleanly, 
  // we would use a context, but a simple refresh handles it well enough.
  const currentLang = typeof document !== 'undefined' ? 
    document.cookie.split('; ').find(row => row.startsWith('NEXT_LOCALE='))?.split('=')[1] || 'uz' : 'uz'

  if (!mounted) return <div style={{ width: '60px' }} />

  return (
    <select 
      value={currentLang} 
      onChange={changeLang} 
      style={{ 
        marginLeft: '12px',
        padding: '6px 10px',
        borderRadius: '6px',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        fontFamily: 'inherit',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      <option value="uz">🇺🇿 O'Z</option>
      <option value="ru">🇷🇺 RU</option>
      <option value="en">🇬🇧 EN</option>
    </select>
  )
}
