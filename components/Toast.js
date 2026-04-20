'use client'
import { useEffect, useState } from 'react'

let toastFn = null
export function showToast(msg, type = 'success') {
  if (toastFn) toastFn(msg, type)
}

export default function Toast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    toastFn = (msg, type) => {
      setToast({ msg, type })
      setTimeout(() => setToast(null), 2800)
    }
    return () => { toastFn = null }
  }, [])

  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: '#ffffff',
      border: `1px solid ${isSuccess ? '#a7f3d0' : '#fecaca'}`,
      borderLeft: `4px solid ${isSuccess ? '#059669' : '#dc2626'}`,
      borderRadius: 10, padding: '12px 18px',
      fontSize: 13, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 10,
      color: '#111827', fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
      animation: 'slideIn 0.3s ease',
      maxWidth: 340,
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%',
        background: isSuccess ? '#d1fae5' : '#fee2e2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, flexShrink: 0,
        color: isSuccess ? '#059669' : '#dc2626',
      }}>{isSuccess ? '✓' : '✕'}</span>
      <span>{toast.msg}</span>
    </div>
  )
}
