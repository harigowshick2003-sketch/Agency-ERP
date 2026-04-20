'use client'
import { useState } from 'react'
import { Card, Btn, Table, Td, Badge, ActivityBadge, EmptyState } from '@/components/UI'
import Modal, { FormGroup, FormGrid, ModalActions } from '@/components/Modal'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/components/Toast'
import { fmtDate, CONTENT_STATUSES, CREATIVE_STATUSES, CLIENT_STATUSES, POSTING_STATUSES } from '@/lib/utils'

const TABS = [
  { id: 'daily',          label: 'Daily Tracker' },
  { id: 'split',          label: 'Deliverables Split' },
  { id: 'jobs_cal',       label: 'Job Work' },
  { id: 'client_content', label: 'Client Content' },
]

const filterInput = {
  background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 8,
  padding: '8px 13px', color: '#374151', fontFamily: 'Inter,sans-serif',
  fontSize: 13, outline: 'none', minWidth: '0', flex: '1 1 140px', fontWeight: 500,
}

export default function Calendar({ state, onRefresh }) {
  const [tab, setTab] = useState('daily')
  const [showAddDeliv, setShowAddDeliv] = useState(false)
  const [form, setForm] = useState({})
  const f = v => setForm(p => ({ ...p, ...v }))

  async function saveDeliverable() {
    if (!form.client_id || !form.activity_code) { showToast('Client and Activity Code required', 'error'); return }
    const payload = {
      client_id: form.client_id,
      activity_code: form.activity_code,
      activity_type: form.activity_type || 'AT001',
      date: form.date || null,
      platform: form.platform || null,
      notes: form.notes || null,
    }
    const { error } = await supabase.from('deliverables').insert([payload])
    if (error) { showToast(error.message, 'error'); return }
    setShowAddDeliv(false)
    showToast('Deliverable added')
    onRefresh()
  }

  async function updateTracker(trackerId, delivId, field, value) {
    if (trackerId) {
      await supabase.from('daily_tracker').update({ [field]: value }).eq('id', trackerId)
    } else {
      await supabase.from('daily_tracker').insert([{ deliverable_id: delivId, [field]: value }])
    }
    onRefresh()
  }

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Tab Bar */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20, alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex', gap: 2, background: '#f1f3f8',
          border: '1px solid #e2e6ef', borderRadius: 10, padding: 4,
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 16px', borderRadius: 7, border: 'none',
              cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
              background: tab === t.id ? '#ffffff' : 'transparent',
              color: tab === t.id ? '#4f46e5' : '#6b7280',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Btn onClick={() => { setForm({ client_id: '', activity_code: '', activity_type: 'AT001', date: '', platform: '', notes: '' }); setShowAddDeliv(true) }}>
            + Add Deliverable
          </Btn>
        </div>
      </div>

      {tab === 'daily'          && <DailyTracker state={state} onUpdateTracker={updateTracker} />}
      {tab === 'split'          && <SplitTracker state={state} />}
      {tab === 'jobs_cal'       && <JobsTable state={state} onRefresh={onRefresh} />}
      {tab === 'client_content' && <ClientContentTab state={state} />}

      {showAddDeliv && (
        <Modal title="Add Deliverable" onClose={() => setShowAddDeliv(false)}>
          <FormGrid>
            <FormGroup label="Client *">
              <select value={form.client_id || ''} onChange={e => f({ client_id: e.target.value })}>
                <option value="">Select client</option>
                {state.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Activity Code *">
              <input value={form.activity_code || ''} onChange={e => f({ activity_code: e.target.value })} placeholder="e.g. ACT001" />
            </FormGroup>
            <FormGroup label="Activity Type">
              <select value={form.activity_type || 'AT001'} onChange={e => f({ activity_type: e.target.value })}>
                <option value="AT001">Post</option>
                <option value="AT002">Reel</option>
                <option value="AT004">YT Short</option>
                <option value="AT005">YT Long</option>
              </select>
            </FormGroup>
            <FormGroup label="Date">
              <input type="date" value={form.date || ''} onChange={e => f({ date: e.target.value })} />
            </FormGroup>
            <FormGroup label="Platform">
              <input value={form.platform || ''} onChange={e => f({ platform: e.target.value })} placeholder="Instagram, YouTube..." />
            </FormGroup>
            <FormGroup label="Notes" fullWidth>
              <textarea value={form.notes || ''} onChange={e => f({ notes: e.target.value })} />
            </FormGroup>
          </FormGrid>
          <ModalActions>
            <Btn variant="ghost" onClick={() => setShowAddDeliv(false)}>Cancel</Btn>
            <Btn onClick={saveDeliverable}>Add Deliverable</Btn>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}

function DailyTracker({ state, onUpdateTracker }) {
  const [search, setSearch] = useState('')
  const [clientFilter, setClientFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = state.deliverables.filter(d => {
    const t = d.daily_tracker?.[0] || {}
    const matchSearch = !search || d.activity_code?.toLowerCase().includes(search.toLowerCase()) || d.client?.name?.toLowerCase().includes(search.toLowerCase())
    const matchClient = !clientFilter || d.client_id === clientFilter
    const matchStatus = !statusFilter || t.posting_status === statusFilter || t.content_status === statusFilter
    return matchSearch && matchClient && matchStatus
  })

  const selectStyle = {
    background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 6,
    fontFamily: 'Inter,sans-serif', fontSize: 12, cursor: 'pointer',
    color: '#374151', outline: 'none', minWidth: 130, padding: '4px 8px',
    fontWeight: 500,
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search client or activity..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...filterInput, flex: '1 1 200px' }} />
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} style={filterInput}>
          <option value="">All Clients</option>
          {state.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...filterInput }}>
          <option value="">All Status</option>
          {POSTING_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto', fontWeight: 500 }}>{filtered.length} records</span>
      </div>
      <Card style={{ padding: 0 }}>
        <Table headers={['Date', 'Client', 'Activity', 'Type', 'Platform', 'Content', 'Ref', 'Creative', 'Ref', 'Client Appr.', 'Posting', 'Notes']}>
          {filtered.map(d => {
            const t = d.daily_tracker?.[0] || {}
            const done = t.posting_status === 'Posted'
            return (
              <tr key={d.id} style={{ background: done ? 'rgba(5,150,105,0.04)' : undefined }}>
                <Td style={{ color: '#9ca3af', whiteSpace: 'nowrap', fontSize: 12 }}>{fmtDate(d.date)}</Td>
                <Td><span style={{ fontWeight: 600, color: '#111827' }}>{d.client?.name || '-'}</span></Td>
                <Td><span style={{ color: '#4f46e5', fontWeight: 600 }}>{d.activity_code}</span></Td>
                <Td><ActivityBadge type={d.activity_type} /></Td>
                <Td style={{ color: '#6b7280', fontSize: 12 }}>{d.platform || '-'}</Td>
                <Td>
                  <select value={t.content_status || ''} style={selectStyle} onChange={e => onUpdateTracker(t.id, d.id, 'content_status', e.target.value)}>
                    <option value="">—</option>
                    {CONTENT_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Td>
                <Td><RefLinkCell value={t.content_reference} onSave={url => onUpdateTracker(t.id, d.id, 'content_reference', url)} color="#4f46e5" /></Td>
                <Td>
                  <select value={t.creative_status || ''} style={selectStyle} onChange={e => onUpdateTracker(t.id, d.id, 'creative_status', e.target.value)}>
                    <option value="">—</option>
                    {CREATIVE_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Td>
                <Td><RefLinkCell value={t.creative_reference} onSave={url => onUpdateTracker(t.id, d.id, 'creative_reference', url)} color="#8b5cf6" /></Td>
                <Td>
                  <select value={t.client_status || ''} style={selectStyle} onChange={e => onUpdateTracker(t.id, d.id, 'client_status', e.target.value)}>
                    <option value="">—</option>
                    {CLIENT_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Td>
                <Td>
                  <select value={t.posting_status || ''} style={selectStyle} onChange={e => onUpdateTracker(t.id, d.id, 'posting_status', e.target.value)}>
                    <option value="">—</option>
                    {POSTING_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Td>
                <Td style={{ color: '#9ca3af', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{t.notes || d.notes || '-'}</Td>
              </tr>
            )
          })}
        </Table>
        {filtered.length === 0 && <EmptyState message="No deliverables found" />}
      </Card>
    </>
  )
}

function SplitTracker({ state }) {
  return (
    <Card style={{ padding: 0 }}>
      <Table headers={['Client', 'Code', 'Type', 'Date', 'Platform', 'Content', 'Creative', 'Client', 'Posted']}>
        {state.deliverables.map(d => {
          const t = d.daily_tracker?.[0] || {}
          return (
            <tr key={d.id}>
              <Td style={{ fontWeight: 600 }}>{d.client?.name || '-'}</Td>
              <Td><span style={{ color: '#4f46e5', fontWeight: 600 }}>{d.activity_code}</span></Td>
              <Td><ActivityBadge type={d.activity_type} /></Td>
              <Td style={{ color: '#9ca3af', whiteSpace: 'nowrap', fontSize: 12 }}>{fmtDate(d.date)}</Td>
              <Td style={{ color: '#6b7280', fontSize: 12 }}>{d.platform || '-'}</Td>
              <Td><Badge status={t.content_status} /></Td>
              <Td><Badge status={t.creative_status} /></Td>
              <Td><Badge status={t.client_status} /></Td>
              <Td><Badge status={t.posting_status} /></Td>
            </tr>
          )
        })}
      </Table>
      {state.deliverables.length === 0 && <EmptyState message="No deliverables found" />}
    </Card>
  )
}

function JobsTable({ state, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({})
  const f = v => setForm(p => ({ ...p, ...v }))

  async function saveJob() {
    if (!form.deliverable_id || !form.assigned_to) { showToast('Deliverable and Employee required', 'error'); return }
    const payload = {
      deliverable_id: form.deliverable_id,
      assigned_to: form.assigned_to,
      task_type: form.task_type || null,
      is_correction: form.is_correction === true,
      status: form.status || 'Pending',
      notes: form.notes || null,
    }
    const { error } = await supabase.from('job_tracker').insert([payload])
    if (error) { showToast(error.message, 'error'); return }
    setShowModal(false)
    showToast('Job added')
    onRefresh()
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <Btn onClick={() => { setForm({ deliverable_id: '', assigned_to: '', task_type: '', is_correction: false, status: 'Pending', notes: '' }); setShowModal(true) }}>
          + Add Job
        </Btn>
      </div>
      <Card style={{ padding: 0 }}>
        <Table headers={['Deliverable', 'Client', 'Type', 'Employee', 'Correction?', 'Status', 'Notes']}>
          {state.jobs.map(j => (
            <tr key={j.id}>
              <Td><span style={{ color: '#4f46e5', fontWeight: 600 }}>{j.deliverable?.activity_code || '-'}</span></Td>
              <Td style={{ color: '#6b7280' }}>{state.clients.find(c => c.id === j.deliverable?.client_id)?.name || '-'}</Td>
              <Td style={{ color: '#6b7280', fontSize: 12 }}>{j.task_type || '-'}</Td>
              <Td style={{ fontWeight: 600 }}>{j.employee?.name || '-'}</Td>
              <Td>
                {j.is_correction
                  ? <span style={{ color: '#dc2626', fontSize: 11, fontWeight: 600, background: '#fee2e2', padding: '2px 8px', borderRadius: 5 }}>YES</span>
                  : <span style={{ color: '#9ca3af', fontSize: 11 }}>No</span>
                }
              </Td>
              <Td><Badge status={j.status} /></Td>
              <Td style={{ color: '#9ca3af', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{j.notes || '-'}</Td>
            </tr>
          ))}
        </Table>
        {state.jobs.length === 0 && <EmptyState message="No jobs found" />}
      </Card>

      {showModal && (
        <Modal title="Add Job Task" onClose={() => setShowModal(false)}>
          <FormGrid>
            <FormGroup label="Deliverable *">
              <select value={form.deliverable_id || ''} onChange={e => f({ deliverable_id: e.target.value })}>
                <option value="">Select</option>
                {state.deliverables.map(d => <option key={d.id} value={d.id}>{d.activity_code} – {d.client?.name}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Assigned To *">
              <select value={form.assigned_to || ''} onChange={e => f({ assigned_to: e.target.value })}>
                <option value="">Select employee</option>
                {state.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Task Type">
              <input value={form.task_type || ''} onChange={e => f({ task_type: e.target.value })} placeholder="Design, Edit, Copy..." />
            </FormGroup>
            <FormGroup label="Status">
              <select value={form.status || 'Pending'} onChange={e => f({ status: e.target.value })}>
                {['Pending', 'In Progress', 'Done', 'Correction'].map(s => <option key={s}>{s}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Is Correction?">
              <select value={form.is_correction ? 'yes' : 'no'} onChange={e => f({ is_correction: e.target.value === 'yes' })}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </FormGroup>
            <FormGroup label="Notes" fullWidth><textarea value={form.notes || ''} onChange={e => f({ notes: e.target.value })} /></FormGroup>
          </FormGrid>
          <ModalActions>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={saveJob}>Add Job</Btn>
          </ModalActions>
        </Modal>
      )}
    </>
  )
}

function ClientContentTab({ state }) {
  const [clientFilter, setClientFilter] = useState('')
  const filtered = clientFilter
    ? state.contentDetails.filter(cd => {
      const deliv = state.deliverables.find(d => d.id === cd.deliverable_id)
      return deliv?.client_id === clientFilter
    })
    : state.contentDetails

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}
          style={{ background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 8, padding: '8px 13px', color: '#374151', fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none', minWidth: 200, fontWeight: 500 }}>
          <option value="">All Clients</option>
          {state.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <Card style={{ padding: 0 }}>
        <Table headers={['Deliverable', 'Title', 'Caption / Copy', 'Status', 'Reference', 'Rough Cut', 'Final Output']}>
          {filtered.map(cd => (
            <tr key={cd.id}>
              <Td><span style={{ color: '#4f46e5', fontWeight: 600 }}>{cd.deliverable?.activity_code || '-'}</span></Td>
              <Td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{cd.title || '-'}</Td>
              <Td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#6b7280', fontSize: 12 }}>{cd.copy || '-'}</Td>
              <Td><Badge status={cd.content_approval_status} /></Td>
              <Td>{cd.reference ? <a href={cd.reference} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>↗ Link</a> : '-'}</Td>
              <Td>{cd.rough_cut ? <a href={cd.rough_cut} target="_blank" rel="noreferrer" style={{ color: '#8b5cf6', fontWeight: 600 }}>↗ Link</a> : '-'}</Td>
              <Td>{cd.final_output ? <a href={cd.final_output} target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: 600 }}>↗ Link</a> : '-'}</Td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState message="No content details found" />}
      </Card>
    </>
  )
}

function RefLinkCell({ value, onSave, color = '#4f46e5' }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')

  function save() {
    onSave(draft)
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', minWidth: 180 }}>
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
          placeholder="Paste URL..."
          style={{
            flex: 1, fontSize: 12, padding: '3px 7px', borderRadius: 5,
            border: '1.5px solid #e2e6ef', outline: 'none', fontFamily: 'Inter,sans-serif',
            background: '#f8f9fc', color: '#374151',
          }}
        />
        <button onClick={save} style={{ background: color, color: '#fff', border: 'none', borderRadius: 5, padding: '3px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>✓</button>
        <button onClick={() => setEditing(false)} style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: 5, padding: '3px 7px', cursor: 'pointer', fontSize: 11 }}>✕</button>
      </div>
    )
  }

  if (value) {
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <a href={value} target="_blank" rel="noreferrer" style={{ color, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>↗ Link</a>
        <button onClick={() => { setDraft(value); setEditing(true) }} title="Edit link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 11, padding: '1px 3px' }}>✏️</button>
      </div>
    )
  }

  return (
    <button onClick={() => { setDraft(''); setEditing(true) }} title="Add link" style={{
      background: '#f3f4f6', border: '1.5px dashed #d1d5db', borderRadius: 5,
      color: '#9ca3af', fontSize: 11, cursor: 'pointer', padding: '2px 7px', fontFamily: 'Inter,sans-serif',
    }}>+ Link</button>
  )
}
