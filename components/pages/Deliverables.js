'use client'
import { useState } from 'react'
import { Card, Btn, Table, Td, Badge, ActivityBadge, EmptyState } from '@/components/UI'
import Modal, { FormGroup, FormGrid, ModalActions } from '@/components/Modal'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/components/Toast'
import { fmtDate, CONTENT_STATUSES, CREATIVE_STATUSES, CLIENT_STATUSES, POSTING_STATUSES } from '@/lib/utils'

const filterInput = {
  background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 8,
  padding: '8px 13px', color: '#374151', fontFamily: 'Inter,sans-serif',
  fontSize: 13, outline: 'none', fontWeight: 500,
}

const selStyle = {
  background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 6,
  fontFamily: 'Inter,sans-serif', fontSize: 12, cursor: 'pointer',
  color: '#374151', outline: 'none', minWidth: 120, padding: '4px 8px',
  fontWeight: 500,
}

export default function Deliverables({ state, onRefresh }) {
  const [search, setSearch] = useState('')
  const [clientFilter, setClientFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const f = v => setForm(p => ({ ...p, ...v }))

  const filtered = state.deliverables.filter(d => {
    const matchSearch = !search || d.activity_code?.toLowerCase().includes(search.toLowerCase()) || d.client?.name?.toLowerCase().includes(search.toLowerCase())
    const matchClient = !clientFilter || d.client_id === clientFilter
    const matchType = !typeFilter || d.activity_type === typeFilter
    return matchSearch && matchClient && matchType
  })

  function openAdd() {
    setEditing(null)
    setForm({ client_id: '', activity_code: '', activity_type: 'AT001', date: '', platform: '', notes: '' })
    setShowModal(true)
  }

  function openEdit(d) {
    setEditing(d.id)
    setForm({ client_id: d.client_id, activity_code: d.activity_code, activity_type: d.activity_type, date: d.date || '', platform: d.platform || '', notes: d.notes || '' })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.client_id || !form.activity_code) { showToast('Client and code required', 'error'); return }
    const payload = { client_id: form.client_id, activity_code: form.activity_code, activity_type: form.activity_type, date: form.date || null, platform: form.platform || null, notes: form.notes || null }
    let err
    if (editing) {
      ;({ error: err } = await supabase.from('deliverables').update(payload).eq('id', editing))
    } else {
      ;({ error: err } = await supabase.from('deliverables').insert([payload]))
    }
    if (err) { showToast(err.message, 'error'); return }
    setShowModal(false)
    showToast(editing ? 'Deliverable updated' : 'Deliverable added')
    onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this deliverable?')) return
    await supabase.from('deliverables').delete().eq('id', id)
    showToast('Deliverable deleted')
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
    <div className="p-[16px] md:p-[24px_28px]">
      <div className="flex gap-[10px] mb-[18px] flex-wrap items-center">
        <input
          placeholder="Search by code or client..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...filterInput }}
          className="flex-1 min-w-[200px]"
        />
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} style={{ ...filterInput }} className="flex-1 min-w-[140px]">
          <option value="">All Clients</option>
          {state.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...filterInput }} className="flex-1 min-w-[120px]">
          <option value="">All Types</option>
          <option value="AT001">Post</option>
          <option value="AT002">Reel</option>
          <option value="AT004">YT Short</option>
          <option value="AT005">YT Long</option>
        </select>
        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
        <div className="w-full sm:w-auto sm:ml-auto">
          <Btn onClick={openAdd} style={{ width: '100%' }}>+ Add Deliverable</Btn>
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        <Table headers={['Date', 'Client', 'Code', 'Type', 'Platform', 'Content', 'Creative', 'Client Appr.', 'Posting', 'Actions']}>
          {filtered.map(d => {
            const t = d.daily_tracker?.[0] || {}
            const done = t.posting_status === 'Posted'
            return (
              <tr key={d.id} style={{ background: done ? 'rgba(5,150,105,0.04)' : undefined }}>
                <Td style={{ color: '#9ca3af', whiteSpace: 'nowrap', fontSize: 12 }}>{fmtDate(d.date)}</Td>
                <Td style={{ fontWeight: 600 }}>{d.client?.name || '-'}</Td>
                <Td><span style={{ color: '#4f46e5', fontWeight: 700 }}>{d.activity_code}</span></Td>
                <Td><ActivityBadge type={d.activity_type} /></Td>
                <Td style={{ color: '#6b7280', fontSize: 12 }}>{d.platform || '-'}</Td>
                <Td>
                  <select value={t.content_status || ''} style={selStyle} onChange={e => updateTracker(t.id, d.id, 'content_status', e.target.value)}>
                    <option value="">—</option>{CONTENT_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Td>
                <Td>
                  <select value={t.creative_status || ''} style={selStyle} onChange={e => updateTracker(t.id, d.id, 'creative_status', e.target.value)}>
                    <option value="">—</option>{CREATIVE_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Td>
                <Td>
                  <select value={t.client_status || ''} style={selStyle} onChange={e => updateTracker(t.id, d.id, 'client_status', e.target.value)}>
                    <option value="">—</option>{CLIENT_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Td>
                <Td>
                  <select value={t.posting_status || ''} style={selStyle} onChange={e => updateTracker(t.id, d.id, 'posting_status', e.target.value)}>
                    <option value="">—</option>{POSTING_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <Btn size="sm" variant="ghost" onClick={() => openEdit(d)}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => handleDelete(d.id)}>Del</Btn>
                  </div>
                </Td>
              </tr>
            )
          })}
        </Table>
        {filtered.length === 0 && <EmptyState message="No deliverables found" />}
      </Card>

      {showModal && (
        <Modal title={editing ? 'Edit Deliverable' : 'Add Deliverable'} onClose={() => setShowModal(false)}>
          <FormGrid>
            <FormGroup label="Client *">
              <select value={form.client_id || ''} onChange={e => f({ client_id: e.target.value })}>
                <option value="">Select client</option>
                {state.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Activity Code *"><input value={form.activity_code || ''} onChange={e => f({ activity_code: e.target.value })} placeholder="e.g. ACT001" /></FormGroup>
            <FormGroup label="Activity Type">
              <select value={form.activity_type || 'AT001'} onChange={e => f({ activity_type: e.target.value })}>
                <option value="AT001">Post</option><option value="AT002">Reel</option>
                <option value="AT004">YT Short</option><option value="AT005">YT Long</option>
              </select>
            </FormGroup>
            <FormGroup label="Date"><input type="date" value={form.date || ''} onChange={e => f({ date: e.target.value })} /></FormGroup>
            <FormGroup label="Platform"><input value={form.platform || ''} onChange={e => f({ platform: e.target.value })} placeholder="Instagram, YouTube..." /></FormGroup>
            <FormGroup label="Notes" fullWidth><textarea value={form.notes || ''} onChange={e => f({ notes: e.target.value })} /></FormGroup>
          </FormGrid>
          <ModalActions>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>{editing ? 'Update' : 'Add'} Deliverable</Btn>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}
