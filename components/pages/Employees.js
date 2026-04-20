'use client'
import { useState } from 'react'
import { Btn, EmptyState, Badge } from '@/components/UI'
import Modal, { FormGroup, FormGrid, ModalActions } from '@/components/Modal'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/components/Toast'

const ROLES = ['Designer', 'Video Editor', 'Content Writer', 'Social Media Manager', 'Account Manager', 'Developer', 'Photographer', 'Intern']
const DEPTS = ['Creative', 'Content', 'Strategy', 'Tech', 'Management']

const DEPT_COLORS = {
  Creative: { bg: '#ede9fe', color: '#7c3aed' },
  Content:  { bg: '#dbeafe', color: '#1d4ed8' },
  Strategy: { bg: '#d1fae5', color: '#065f46' },
  Tech:     { bg: '#fef3c7', color: '#92400e' },
  Management: { bg: '#fce7f3', color: '#9d174d' },
}

const AVATAR_COLORS = ['#4f46e5', '#7c3aed', '#0ea5e9', '#059669', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981']

export default function Employees({ state, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState('')
  const f = v => setForm(p => ({ ...p, ...v }))

  const filtered = state.employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.emp_id?.toLowerCase().includes(search.toLowerCase()) ||
    e.role?.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditing(null)
    setForm({ name: '', emp_id: '', role: '', department: '', email: '' })
    setShowModal(true)
  }

  function openEdit(e) {
    setEditing(e.id)
    setForm({ name: e.name, emp_id: e.emp_id, role: e.role, department: e.department, email: e.email })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name) { showToast('Name is required', 'error'); return }
    const payload = {
      name: form.name, emp_id: form.emp_id || null,
      role: form.role || null, department: form.department || null, email: form.email || null
    }
    let err
    if (editing) {
      ;({ error: err } = await supabase.from('employees').update(payload).eq('id', editing))
    } else {
      ;({ error: err } = await supabase.from('employees').insert([payload]))
    }
    if (err) { showToast(err.message, 'error'); return }
    setShowModal(false)
    showToast(editing ? 'Employee updated' : 'Employee added')
    onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this employee?')) return
    await supabase.from('employees').delete().eq('id', id)
    showToast('Employee deleted')
    onRefresh()
  }

  return (
    <div className="p-[16px] md:p-[24px_28px]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row gap-[10px] mb-[22px] items-start sm:items-center">
        <input
          placeholder="Search by name, ID, or role..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 8,
            padding: '9px 14px', color: '#374151', fontFamily: 'Inter,sans-serif',
            fontSize: 13, outline: 'none', fontWeight: 500, width: '100%', maxWidth: '300px'
          }}
        />
        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
          {filtered.length} member{filtered.length !== 1 ? 's' : ''}
        </span>
        <div className="w-full sm:w-auto sm:ml-auto">
          <Btn onClick={openAdd} style={{ width: '100%' }}>+ Add Employee</Btn>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState icon="👥" message="No employees yet" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map((emp, idx) => {
            const jobCount = state.jobs.filter(j => j.assigned_to === emp.id).length
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
            const deptStyle = DEPT_COLORS[emp.department] || { bg: '#f3f4f6', color: '#6b7280' }
            return (
              <div key={emp.id} style={{
                background: '#ffffff', border: '1px solid #e2e6ef',
                borderRadius: 14, padding: 20,
                display: 'flex', gap: 16, alignItems: 'flex-start',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Inter', fontWeight: 800, fontSize: 18, color: '#ffffff',
                  boxShadow: `0 2px 8px ${avatarColor}44`,
                }}>
                  {emp.name[0].toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{emp.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 500 }}>{emp.role || 'No role assigned'}</div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {emp.department && (
                      <span style={{ background: deptStyle.bg, color: deptStyle.color, padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600 }}>
                        {emp.department}
                      </span>
                    )}
                    <span style={{ background: '#f1f3f8', color: '#6b7280', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600 }}>
                      {emp.emp_id || 'No ID'}
                    </span>
                    <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600 }}>
                      {jobCount} job{jobCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {emp.email && (
                    <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {emp.email}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn size="sm" variant="ghost" onClick={() => openEdit(emp)}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => handleDelete(emp.id)}>Delete</Btn>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Employee' : 'Add Employee'} onClose={() => setShowModal(false)}>
          <FormGrid>
            <FormGroup label="Full Name *"><input value={form.name || ''} onChange={e => f({ name: e.target.value })} placeholder="Full name" /></FormGroup>
            <FormGroup label="Employee ID"><input value={form.emp_id || ''} onChange={e => f({ emp_id: e.target.value })} placeholder="EMP001" /></FormGroup>
            <FormGroup label="Role">
              <select value={form.role || ''} onChange={e => f({ role: e.target.value })}>
                <option value="">Select role</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Department">
              <select value={form.department || ''} onChange={e => f({ department: e.target.value })}>
                <option value="">Select department</option>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Email" fullWidth><input type="email" value={form.email || ''} onChange={e => f({ email: e.target.value })} placeholder="employee@agency.com" /></FormGroup>
          </FormGrid>
          <ModalActions>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>{editing ? 'Update' : 'Add'} Employee</Btn>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}
