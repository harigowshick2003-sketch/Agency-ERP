'use client'

export default function Modal({ title, children, onClose, width = 580 }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.45)',
        zIndex: 100, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white border text-left border-[#e2e6ef] rounded-[16px] p-[20px] md:p-[28px] w-[95%] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)_0_4px_16px_rgba(0,0,0,0.08)] animate-[scaleIn_0.2s_ease]"
        style={{ maxWidth: width }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid #f1f3f8',
        }}>
          <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>
            {title}
          </span>
          <button onClick={onClose} style={{
            background: '#f8f9fc', border: '1px solid #e2e6ef',
            borderRadius: 8, color: '#6b7280', cursor: 'pointer',
            fontSize: 16, width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f8f9fc'; e.currentTarget.style.color = '#6b7280' }}
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function FormGrid({ children, cols = 2 }) {
  if (cols === 2) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">{children}</div>
  }
  return <div className="grid grid-cols-1 md:grid-cols-[repeat(cols,_1fr)] gap-[14px]">{children}</div>
}

export function FormGroup({ label, children, fullWidth, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: fullWidth ? '1/-1' : undefined }}>
      <label style={{
        fontSize: 12, fontWeight: 600, color: '#374151',
        letterSpacing: '0.01em',
      }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: 11, color: '#9ca3af' }}>{hint}</span>}
    </div>
  )
}

export function ModalActions({ children }) {
  return (
    <div style={{
      display: 'flex', gap: 8, justifyContent: 'flex-end',
      marginTop: 22, paddingTop: 16, borderTop: '1px solid #f1f3f8',
    }}>
      {children}
    </div>
  )
}
