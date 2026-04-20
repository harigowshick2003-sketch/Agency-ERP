'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/components/Toast'
import { Spinner, EmptyState, Table, Td, RoleBadge, Btn } from '@/components/UI'

const ROLE_OPTIONS = ['admin', 'manager', 'employee']

const ROLE_INFO = {
  admin:    { icon: '⚡', desc: 'Full access — all pages + user management' },
  manager:  { icon: '◈', desc: 'Clients, jobs, calendar, deliverables, performance' },
  employee: { icon: '◑', desc: 'Dashboard, calendar, own jobs only' },
}

export default function Users({ state }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)   // id being saved
  const [search, setSearch] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      showToast('Failed to load users: ' + error.message, 'error')
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  async function updateRole(userId, newRole) {
    setSaving(userId)
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId)
    if (error) {
      showToast('Failed to update role: ' + error.message, 'error')
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      showToast('Role updated successfully', 'success')
    }
    setSaving(null)
  }

  const filtered = users.filter(u =>
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  )

  const currentUserRole = state?.userRole

  return (
    <div className="p-[16px] md:p-[24px_32px] font-sans">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: 6 }}>
          User Management
        </div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          Manage team access levels. New accounts default to <strong>Employee</strong> role.
        </div>
      </div>

      {/* Role Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px] mb-[28px]">
        {ROLE_OPTIONS.map(role => (
          <div key={role} style={{
            background: '#ffffff', border: '1px solid #e2e6ef', borderRadius: 12,
            padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{ROLE_INFO[role].icon}</span>
              <RoleBadge role={role} />
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>
              {ROLE_INFO[role].desc}
            </div>
          </div>
        ))}
      </div>

      {/* Search + Refresh */}
      <div className="flex flex-col sm:flex-row gap-[12px] mb-[20px] items-start sm:items-center">
        <div className="relative w-full sm:flex-1">
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: '#9ca3af', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{ width: '100%', paddingLeft: 36 }}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Btn variant="ghost" onClick={loadUsers} style={{ width: '100%' }}>↺ Refresh</Btn>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#ffffff', border: '1px solid #e2e6ef',
        borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon="◑" message="No users found" />
        ) : (
          <Table headers={['User', 'Email', 'Joined', 'Current Role', 'Change Role']}>
            {filtered.map(user => (
              <tr key={user.id} style={{ transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {(user.full_name || user.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>
                        {user.full_name || '—'}
                      </div>
                      {user.id === state?.user?.id && (
                        <div style={{ fontSize: 10, color: '#4f46e5', fontWeight: 600 }}>You</div>
                      )}
                    </div>
                  </div>
                </Td>
                <Td style={{ color: '#6b7280', fontFamily: 'monospace', fontSize: 12 }}>
                  {user.email}
                </Td>
                <Td style={{ color: '#9ca3af', fontSize: 12 }}>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'}
                </Td>
                <Td>
                  <RoleBadge role={user.role} />
                </Td>
                <Td>
                  {saving === user.id ? (
                    <span style={{ fontSize: 12, color: '#6b7280' }}>Saving…</span>
                  ) : (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {ROLE_OPTIONS.map(role => (
                        <button
                          key={role}
                          onClick={() => updateRole(user.id, role)}
                          disabled={user.role === role}
                          title={`Set as ${role}`}
                          style={{
                            padding: '4px 10px', fontSize: 11, fontWeight: 600,
                            border: '1.5px solid',
                            borderColor: user.role === role ? '#4f46e5' : '#e2e6ef',
                            borderRadius: 6, cursor: user.role === role ? 'default' : 'pointer',
                            background: user.role === role
                              ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                              : '#f8f9fc',
                            color: user.role === role ? '#fff' : '#6b7280',
                            transition: 'all 0.15s',
                            textTransform: 'capitalize',
                          }}
                          onMouseEnter={e => { if (user.role !== role) { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.color = '#4f46e5' } }}
                          onMouseLeave={e => { if (user.role !== role) { e.currentTarget.style.borderColor = '#e2e6ef'; e.currentTarget.style.color = '#6b7280' } }}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: '#9ca3af', textAlign: 'right' }}>
        {filtered.length} user{filtered.length !== 1 ? 's' : ''} shown
      </div>
    </div>
  )
}
