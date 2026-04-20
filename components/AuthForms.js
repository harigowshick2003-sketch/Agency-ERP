'use client'
import { useState } from 'react'

// ── Shared Input ─────────────────────────────────────────────────────
function AuthInput({ label, type = 'text', value, onChange, onKeyDown, placeholder, icon }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 600,
        color: '#374151', marginBottom: 6, letterSpacing: '0.02em',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: focused ? '#4f46e5' : '#9ca3af', transition: 'color 0.15s',
            pointerEvents: 'none',
          }}>{icon}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100%',
            paddingLeft: icon ? 36 : undefined,
            borderColor: focused ? '#4f46e5' : undefined,
            boxShadow: focused ? '0 0 0 3px rgba(79,70,229,0.12)' : undefined,
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        />
      </div>
    </div>
  )
}

// ── Error Banner ─────────────────────────────────────────────────────
function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div style={{
      background: '#fef2f2', border: '1px solid #fecaca',
      borderRadius: 8, padding: '10px 14px',
      color: '#dc2626', fontSize: 12, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span>⚠</span> {message}
    </div>
  )
}

// ── Success Banner ───────────────────────────────────────────────────
function SuccessBanner({ message }) {
  if (!message) return null
  return (
    <div style={{
      background: '#f0fdf4', border: '1px solid #a7f3d0',
      borderRadius: 8, padding: '10px 14px',
      color: '#059669', fontSize: 12, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span>✓</span> {message}
    </div>
  )
}

// ── Logo Block ───────────────────────────────────────────────────────
function LogoBlock({ subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 54, height: 54, borderRadius: 15,
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        boxShadow: '0 6px 18px rgba(79,70,229,0.35)',
        marginBottom: 16, fontSize: 26,
        animation: 'pulse 3s ease-in-out infinite',
      }}>⬡</div>
      <div style={{
        fontFamily: 'Inter', fontSize: 22, fontWeight: 800,
        color: '#111827', letterSpacing: '-0.5px',
      }}>
        Agency ERP
      </div>
      <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{subtitle}</div>
    </div>
  )
}

// ── Submit Button ────────────────────────────────────────────────────
function SubmitBtn({ label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', padding: '12px 16px', marginTop: 4,
        background: loading
          ? '#a5b4fc'
          : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        color: '#ffffff', border: 'none', borderRadius: 10,
        fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.01em',
        boxShadow: loading ? 'none' : '0 4px 14px rgba(79,70,229,0.35)',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9' }}
      onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1' }}
    >
      {loading && (
        <span style={{
          width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)',
          borderTopColor: '#fff', borderRadius: '50%',
          animation: 'spin 0.6s linear infinite', display: 'inline-block',
        }} />
      )}
      {loading ? 'Please wait…' : label}
    </button>
  )
}

// ── Auth Card Wrapper ────────────────────────────────────────────────
function AuthCard({ children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #eef2ff 0%, #f8f9fc 40%, #f0fdf4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.13) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '15%',
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="bg-white rounded-[22px] p-[32px] md:p-[44px] pb-[36px] w-[90%] max-w-[440px] relative z-10 max-h-[95vh] overflow-y-auto"
        style={{
          boxShadow: '0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(79,70,229,0.10)',
          animation: 'scaleIn 0.25s ease',
        }}>
        {children}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// LOGIN FORM
// ══════════════════════════════════════════════════════════════════════
export function LoginForm({ onLogin, onSwitchToSignup }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleLogin() {
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    try {
      await onLogin(form.email, form.password)
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard>
      <LogoBlock subtitle="Sign in to your workspace" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          label="Email address" type="email" icon="✉"
          value={form.email} onChange={set('email')}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="you@agency.com"
        />
        <AuthInput
          label="Password" type="password" icon="🔒"
          value={form.password} onChange={set('password')}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="••••••••"
        />
        <ErrorBanner message={error} />
        <SubmitBtn label="Sign in" onClick={handleLogin} loading={loading} />
      </div>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#6b7280' }}>
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#4f46e5', fontWeight: 600, fontSize: 13,
            fontFamily: 'Inter', padding: 0,
            textDecoration: 'underline', textDecorationColor: 'transparent',
            transition: 'text-decoration-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.textDecorationColor = '#4f46e5'}
          onMouseLeave={e => e.currentTarget.style.textDecorationColor = 'transparent'}
        >
          Create account
        </button>
      </div>
    </AuthCard>
  )
}

// ══════════════════════════════════════════════════════════════════════
// SIGNUP FORM
// ══════════════════════════════════════════════════════════════════════
export function SignupForm({ onSignup, onSwitchToLogin }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSignup() {
    setError(''); setSuccess('')
    if (!form.fullName.trim()) { setError('Please enter your full name.'); return }
    if (!form.email) { setError('Please enter your email address.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      await onSignup(form.email, form.password, form.fullName)
      setSuccess('Account created! Check your email to confirm, then sign in.')
      setForm({ fullName: '', email: '', password: '', confirm: '' })
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard>
      <LogoBlock subtitle="Create your account" />

      {/* Role info banner */}
      <div style={{
        background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
        border: '1px solid #c7d2fe',
        borderRadius: 10, padding: '10px 14px',
        marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 16, marginTop: 1 }}>ℹ️</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#4338ca' }}>Account Role</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, lineHeight: 1.5 }}>
            New accounts start as <strong>Employee</strong>. An admin will upgrade your access after review.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          label="Full Name" icon="👤"
          value={form.fullName} onChange={set('fullName')}
          onKeyDown={e => e.key === 'Enter' && handleSignup()}
          placeholder="Jane Doe"
        />
        <AuthInput
          label="Email address" type="email" icon="✉"
          value={form.email} onChange={set('email')}
          onKeyDown={e => e.key === 'Enter' && handleSignup()}
          placeholder="you@agency.com"
        />
        <AuthInput
          label="Password" type="password" icon="🔒"
          value={form.password} onChange={set('password')}
          onKeyDown={e => e.key === 'Enter' && handleSignup()}
          placeholder="Min. 6 characters"
        />
        <AuthInput
          label="Confirm Password" type="password" icon="🔐"
          value={form.confirm} onChange={set('confirm')}
          onKeyDown={e => e.key === 'Enter' && handleSignup()}
          placeholder="Re-enter password"
        />

        <ErrorBanner message={error} />
        <SuccessBanner message={success} />

        <SubmitBtn label="Create account" onClick={handleSignup} loading={loading} />
      </div>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#6b7280' }}>
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#4f46e5', fontWeight: 600, fontSize: 13,
            fontFamily: 'Inter', padding: 0,
            textDecoration: 'underline', textDecorationColor: 'transparent',
            transition: 'text-decoration-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.textDecorationColor = '#4f46e5'}
          onMouseLeave={e => e.currentTarget.style.textDecorationColor = 'transparent'}
        >
          Sign in
        </button>
      </div>
    </AuthCard>
  )
}
