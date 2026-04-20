'use client'
import { useState } from 'react'
import { Card, Btn, Table, Td, Badge, ActivityBadge, StatCard, EmptyState } from '@/components/UI'
import Modal, { FormGroup, FormGrid, ModalActions } from '@/components/Modal'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/components/Toast'
import { fmtDate } from '@/lib/utils'

const JOB_STATUSES = ['Pending', 'In Progress', 'Done', 'Correction']

const filterInput = {
  background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 8,
  padding: '8px 13px', color: '#374151', fontFamily: 'Inter,sans-serif',
  fontSize: 13, outline: 'none', fontWeight: 500,
}

export default function Jobs({ state, onRefresh }) {
  const [search, setSearch] = useState('')
  const [empFilter, setEmpFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const f = v => setForm(p => ({ ...p, ...v }))

  const filtered = state.jobs.filter(j => {
    const matchSearch = !search ||
      j.deliverable?.activity_code?.toLowerCase().includes(search.toLowerCase()) ||
      j.employee?.name?.toLowerCase().includes(search.toLowerCase()) ||
      j.task_type?.toLowerCase().includes(search.toLowerCase())
    const matchEmp = !empFilter || j.assigned_to === empFilter
    return matchSearch && matchEmp
  })

  const corrections = state.jobs.filter(j => j.is_correction).length
  const done = state.jobs.filter(j => j.status === 'Done').length
  const inProgress = state.jobs.filter(j => j.status === 'In Progress').length

  function openAdd() {
    setEditing(null)
    setForm({ deliverable_id: '', assigned_to: '', task_type: '', is_correction: false, status: 'Pending', notes: '' })
    setShowModal(true)
  }

  function openEdit(j) {
    setEditing(j.id)
    setForm({ deliverable_id: j.deliverable_id, assigned_to: j.assigned_to, task_type: j.task_type || '', is_correction: j.is_correction, status: j.status || 'Pending', notes: j.notes || '' })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.deliverable_id || !form.assigned_to) { showToast('Deliverable and Employee required', 'error'); return }
    const payload = {
      deliverable_id: form.deliverable_id,
      assigned_to: form.assigned_to,
      task_type: form.task_type || null,
      is_correction: form.is_correction === true,
      status: form.status || 'Pending',
      notes: form.notes || null,
    }
    let err
    if (editing) {
      ;({ error: err } = await supabase.from('job_tracker').update(payload).eq('id', editing))
    } else {
      ;({ error: err } = await supabase.from('job_tracker').insert([payload]))
    }
    if (err) { showToast(err.message, 'error'); return }
    setShowModal(false)
    showToast(editing ? 'Job updated' : 'Job added')
    onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this job?')) return
    await supabase.from('job_tracker').delete().eq('id', id)
    showToast('Job deleted')
    onRefresh()
  }

  return (
    <div className="p-[16px] md:p-[24px_28px]">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-[24px]">
        <StatCard label="Total Jobs"   value={state.jobs.length} sub="All tasks"      accentColor="#4f46e5" />
        <StatCard label="In Progress"  value={inProgress}        sub="Active"         accentColor="#0ea5e9" />
        <StatCard label="Completed"    value={done}              sub="Done"           accentColor="#059669" />
        <StatCard label="Corrections"  value={corrections}       sub="Rework needed"  accentColor="#dc2626" />
      </div>

      {/* Filters */}
      <div className="flex gap-[10px] mb-[18px] flex-wrap items-center">
        <input
          placeholder="Search by code, employee, type..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={filterInput} className="flex-1 min-w-[200px]"
        />
        <select value={empFilter} onChange={e => setEmpFilter(e.target.value)} style={filterInput} className="flex-1 min-w-[140px]">
          <option value="">All Employees</option>
          {state.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
        <div className="w-full sm:w-auto sm:ml-auto">
          <Btn onClick={openAdd} style={{ width: '100%' }}>+ Add Job</Btn>
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        <Table headers={['Deliverable', 'Client', 'Type', 'Task', 'Assigned To', 'Correction?', 'Status', 'Notes', 'Actions']}>
          {filtered.map(j => (
            <tr key={j.id} style={{ background: j.is_correction ? 'rgba(220,38,38,0.03)' : j.status === 'Done' ? 'rgba(5,150,105,0.03)' : undefined }}>
              <Td><span style={{ color: '#4f46e5', fontWeight: 700 }}>{j.deliverable?.activity_code || '-'}</span></Td>
              <Td style={{ color: '#6b7280', fontSize: 12 }}>{state.clients.find(c => c.id === j.deliverable?.client_id)?.name || '-'}</Td>
              <Td><ActivityBadge type={j.deliverable?.activity_type} /></Td>
              <Td style={{ color: '#374151', fontWeight: 500 }}>{j.task_type || '-'}</Td>
              <Td>
                <div style={{ fontWeight: 600, color: '#111827' }}>{j.employee?.name || '-'}</div>
                {j.employee?.emp_id && <div style={{ color: '#9ca3af', fontSize: 11 }}>{j.employee.emp_id}</div>}
              </Td>
              <Td>
                {j.is_correction
                  ? <span style={{ color: '#dc2626', fontSize: 11, fontWeight: 700, background: '#fee2e2', padding: '2px 8px', borderRadius: 5 }}>Correction</span>
                  : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
                }
              </Td>
              <Td><Badge status={j.status} /></Td>
              <Td style={{ color: '#9ca3af', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{j.notes || '-'}</Td>
              <Td>
                <div style={{ display: 'flex', gap: 5 }}>
                  <Btn size="sm" variant="ghost" onClick={() => openEdit(j)}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => handleDelete(j.id)}>Del</Btn>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState message="No jobs found" />}
      </Card>

      {showModal && (
        <Modal title={editing ? 'Edit Job' : 'Add Job Task'} onClose={() => setShowModal(false)}>
          <FormGrid>
            <FormGroup label="Deliverable *">
              <select value={form.deliverable_id || ''} onChange={e => f({ deliverable_id: e.target.value })}>
                <option value="">Select deliverable</option>
                {state.deliverables.map(d => <option key={d.id} value={d.id}>{d.activity_code} – {d.client?.name}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Assigned To *">
              <select value={form.assigned_to || ''} onChange={e => f({ assigned_to: e.target.value })}>
                <option value="">Select employee</option>
                {state.employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.emp_id})</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Task Type"><input value={form.task_type || ''} onChange={e => f({ task_type: e.target.value })} placeholder="Design, Edit, Copywriting..." /></FormGroup>
            <FormGroup label="Status">
              <select value={form.status || 'Pending'} onChange={e => f({ status: e.target.value })}>
                {JOB_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Is Correction?">
              <select value={form.is_correction ? 'yes' : 'no'} onChange={e => f({ is_correction: e.target.value === 'yes' })}>
                <option value="no">No</option>
                <option value="yes">Yes – Correction/Rework</option>
              </select>
            </FormGroup>
            <FormGroup label="Notes" fullWidth><textarea value={form.notes || ''} onChange={e => f({ notes: e.target.value })} placeholder="Task details..." /></FormGroup>
          </FormGrid>
          <ModalActions>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>{editing ? 'Update' : 'Add'} Job</Btn>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}
