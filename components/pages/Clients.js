'use client'
import { useState } from 'react'
import { Btn, EmptyState, Badge, ActivityBadge } from '@/components/UI'
import Modal, { FormGroup, FormGrid, ModalActions } from '@/components/Modal'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/components/Toast'

const AVATAR_COLORS = ['#4f46e5', '#7c3aed', '#0ea5e9', '#059669', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981']

export default function Clients({ state, onRefresh, onNavigate }) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState('')

  function openAdd() {
    setEditing(null)
    setForm({ client_code: '', name: '', industry: '', brand_tone: '', contact_name: '', contact_email: '', contact_phone: '' })
    setShowModal(true)
  }

  function openEdit(c) {
    setEditing(c.id)
    setForm({ ...c })
    setShowModal(true)
  }

  async function handleSave() {
    const payload = {
      client_code:   form.client_code   || null,
      name:          form.name          || null,
      industry:      form.industry      || null,
      brand_tone:    form.brand_tone    || null,
      contact_name:  form.contact_name  || null,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
    }
    if (!payload.name) { showToast('Client name is required', 'error'); return }
    let err
    if (editing) {
      ;({ error: err } = await supabase.from('clients').update(payload).eq('id', editing))
    } else {
      ;({ error: err } = await supabase.from('clients').insert([payload]))
    }
    if (err) { showToast(err.message, 'error'); return }
    setShowModal(false)
    showToast(editing ? 'Client updated' : 'Client added')
    onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this client?')) return
    await supabase.from('clients').delete().eq('id', id)
    showToast('Client deleted')
    onRefresh()
  }

  const f = v => setForm(p => ({ ...p, ...v }))
  const filtered = state.clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.client_code?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-[16px] md:p-[24px_28px]">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-[10px] mb-[22px] items-start sm:items-center">
        <input
          placeholder="Search by name or code..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 8,
            padding: '9px 14px', color: '#374151', fontFamily: 'Inter,sans-serif',
            fontSize: 13, outline: 'none', fontWeight: 500, width: '100%', maxWidth: '300px'
          }}
        />
        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
          {filtered.length} client{filtered.length !== 1 ? 's' : ''}
        </span>
        <div className="w-full sm:w-auto sm:ml-auto">
          <Btn onClick={openAdd} style={{ width: '100%' }}>+ Add Client</Btn>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState icon="🏢" message="No clients yet" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {filtered.map((c, idx) => (
            <ClientCard key={c.id} client={c} state={state} idx={idx}
              onEdit={() => openEdit(c)}
              onDelete={() => handleDelete(c.id)}
              onClick={() => onNavigate('client_detail', { selectedClient: c })}
            />
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Client' : 'Add Client'} onClose={() => setShowModal(false)}>
          <FormGrid>
            <FormGroup label="Client Code *"><input value={form.client_code || ''} onChange={e => f({ client_code: e.target.value })} placeholder="CLT001" /></FormGroup>
            <FormGroup label="Name *"><input value={form.name || ''} onChange={e => f({ name: e.target.value })} placeholder="Client name" /></FormGroup>
            <FormGroup label="Industry"><input value={form.industry || ''} onChange={e => f({ industry: e.target.value })} placeholder="e.g. Fashion" /></FormGroup>
            <FormGroup label="Brand Tone"><input value={form.brand_tone || ''} onChange={e => f({ brand_tone: e.target.value })} placeholder="e.g. Professional" /></FormGroup>
            <FormGroup label="Contact Name"><input value={form.contact_name || ''} onChange={e => f({ contact_name: e.target.value })} placeholder="Contact person" /></FormGroup>
            <FormGroup label="Contact Email"><input type="email" value={form.contact_email || ''} onChange={e => f({ contact_email: e.target.value })} placeholder="contact@brand.com" /></FormGroup>
            <FormGroup label="Contact Phone"><input value={form.contact_phone || ''} onChange={e => f({ contact_phone: e.target.value })} placeholder="+91 ..." /></FormGroup>
          </FormGrid>
          <ModalActions>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>{editing ? 'Update' : 'Add'} Client</Btn>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}

function ClientCard({ client: c, state, idx, onEdit, onDelete, onClick }) {
  const delivCount = state.deliverables.filter(d => d.client_id === c.id).length
  const postedCount = state.deliverables.filter(d => d.client_id === c.id && d.daily_tracker?.[0]?.posting_status === 'Posted').length
  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]

  return (
    <div
      style={{
        background: '#ffffff', border: '1px solid #e2e6ef', borderRadius: 14,
        padding: 20, cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,70,229,0.12)'; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e2e6ef'; e.currentTarget.style.transform = 'translateY(0)' }}
      onClick={onClick}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: avatarColor, borderRadius: '14px 14px 0 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, marginTop: 6 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${avatarColor}22, ${avatarColor}44)`,
          border: `2px solid ${avatarColor}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter', fontWeight: 800, fontSize: 18, color: avatarColor,
        }}>
          {c.name[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
          <div style={{ fontSize: 11, color: avatarColor, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.client_code}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
        {c.industry && <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}><span>🏢</span>{c.industry}</div>}
        {c.contact_name && <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}><span>👤</span>{c.contact_name}</div>}
        {c.contact_email && <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>✉️</span>{c.contact_email}</div>}
      </div>

      {/* Stats strip */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, background: '#f8f9fc', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>{delivCount}</div>
          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1, fontWeight: 600 }}>DELIVERABLES</div>
        </div>
        <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', letterSpacing: '-0.5px' }}>{postedCount}</div>
          <div style={{ fontSize: 10, color: '#6ee7b7', marginTop: 1, fontWeight: 600 }}>POSTED</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
        <Btn size="sm" variant="ghost" onClick={onEdit}>Edit</Btn>
        <Btn size="sm" variant="danger" onClick={onDelete}>Delete</Btn>
        <div style={{ marginLeft: 'auto' }}>
          <Btn size="sm" variant="ghost" onClick={onClick} style={{ color: '#4f46e5', borderColor: '#c7d2fe', background: '#eef2ff' }}>
            View →
          </Btn>
        </div>
      </div>
    </div>
  )
}
