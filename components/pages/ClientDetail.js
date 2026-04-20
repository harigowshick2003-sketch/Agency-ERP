'use client'
import { useState } from 'react'
import { Card, CardTitle, Btn, Table, Td, Badge, ActivityBadge, StatCard, PipelineBar } from '@/components/UI'
import Modal, { FormGroup, FormGrid, ModalActions } from '@/components/Modal'
import { supabase } from '@/lib/supabase'
import { showToast } from '@/components/Toast'
import { fmtDate, CONTENT_STATUSES, CREATIVE_STATUSES, CLIENT_STATUSES, POSTING_STATUSES } from '@/lib/utils'

const TABS = [
  { id: 'info',          label: 'Overview' },
  { id: 'deliverables',  label: 'Deliverables' },
  { id: 'content',       label: 'Content Details' },
]

const selStyle = {
  background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 6,
  fontFamily: 'Inter,sans-serif', fontSize: 12, cursor: 'pointer',
  color: '#374151', outline: 'none', minWidth: 120, padding: '4px 8px', fontWeight: 500,
}

export default function ClientDetail({ state, onRefresh, onNavigate }) {
  const client = state.selectedClient
  const [tab, setTab] = useState('info')
  const [showAddDeliv, setShowAddDeliv] = useState(false)
  const [showAddContent, setShowAddContent] = useState(false)
  const [form, setForm] = useState({})
  const [uploadingField, setUploadingField] = useState(null)
  const [editingContentId, setEditingContentId] = useState(null)

  // Guard: if no client selected (e.g. direct nav), go back to clients list
  if (!client) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center', color: '#9ca3af' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>No client selected</div>
        <button
          onClick={() => onNavigate('clients')}
          style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600 }}
        >← Back to Clients</button>
      </div>
    )
  }


  const clientDelivs = state.deliverables.filter(d => d.client_id === client.id)
  const clientContent = state.contentDetails.filter(cd => clientDelivs.some(d => d.id === cd.deliverable_id))

  const posted = clientDelivs.filter(d => d.daily_tracker?.[0]?.posting_status === 'Posted').length
  const contentApproved = clientDelivs.filter(d => d.daily_tracker?.[0]?.content_status === 'Content Approved').length
  const clientApproved = clientDelivs.filter(d => d.daily_tracker?.[0]?.client_status === 'Client Approved').length

  const f = v => setForm(p => ({ ...p, ...v }))

  async function saveDeliverable() {
    const payload = {
      client_id: client.id, activity_code: form.activity_code,
      activity_type: form.activity_type, date: form.date || null,
      platform: form.platform || null, notes: form.notes || null,
    }
    const { error } = await supabase.from('deliverables').insert([payload])
    if (error) { showToast(error.message, 'error'); return }
    setShowAddDeliv(false); showToast('Deliverable added'); onRefresh()
  }

  async function saveContentDetail() {
    const payload = {
      deliverable_id: form.deliverable_id, title: form.title || null,
      copy: form.copy || null, description: form.description || null,
      thumbnail_content: form.thumbnail_content || null, reference: form.reference || null,
      rough_cut: form.rough_cut || null, final_output: form.final_output || null,
      thumbnail: form.thumbnail || null,
      content_approval_status: form.content_approval_status || 'Content Not Written',
    }
    if (!payload.deliverable_id) { showToast('Select a deliverable', 'error'); return }

    let error;
    if (editingContentId) {
      ({ error } = await supabase.from('content_details').update(payload).eq('id', editingContentId));
    } else {
      ({ error } = await supabase.from('content_details').insert([payload]));
    }
    
    if (error) { showToast(error.message, 'error'); return }
    setShowAddContent(false); showToast(editingContentId ? 'Content detail updated' : 'Content detail saved'); onRefresh()
  }

  function openEditContent(cd) {
    setEditingContentId(cd.id)
    setForm({
      deliverable_id: cd.deliverable_id,
      title: cd.title || '',
      copy: cd.copy || '',
      description: cd.description || '',
      reference: cd.reference || '',
      rough_cut: cd.rough_cut || '',
      final_output: cd.final_output || '',
      thumbnail: cd.thumbnail || '',
      content_approval_status: cd.content_approval_status || 'Content Not Written'
    })
    setShowAddContent(true)
  }

  function openAddContent() {
    setEditingContentId(null)
    setForm({ deliverable_id: '', title: '', copy: '', description: '', reference: '', rough_cut: '', final_output: '', thumbnail: '', content_approval_status: 'Content Not Written' })
    setShowAddContent(true)
  }

  async function updateTracker(trackerId, delivId, field, value) {
    if (trackerId) {
      await supabase.from('daily_tracker').update({ [field]: value }).eq('id', trackerId)
    } else {
      await supabase.from('daily_tracker').insert([{ deliverable_id: delivId, [field]: value }])
    }
    onRefresh()
  }

  async function handleFileUpload(file, field) {
    if (!file) return;
    setUploadingField(field);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('content_files')
      .upload(filePath, file);

    if (uploadError) {
      showToast(uploadError.message, 'error');
      setUploadingField(null);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('content_files').getPublicUrl(filePath);
    
    f({ [field]: publicUrlData.publicUrl });
    setUploadingField(null);
    showToast('File attached successfully');
  }

  return (
    <div className="p-[16px] md:p-[24px_28px] w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[16px] mb-[24px]">
        <Btn variant="ghost" size="sm" onClick={() => onNavigate('clients')}>← Back</Btn>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#ffffff',
          boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
        }}>
          {client.name[0]}
        </div>
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>{client.name}</div>
          <div style={{ fontSize: 11, color: '#4f46e5', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2, fontWeight: 700 }}>{client.client_code}</div>
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-auto flex gap-[8px] w-full sm:w-auto">
          <Btn onClick={() => { setForm({ activity_code: '', activity_type: 'AT001', date: '', platform: '', notes: '' }); setShowAddDeliv(true) }} style={{ flex: 1 }}>+ Add Deliverable</Btn>
          <Btn variant="ghost" onClick={openAddContent} style={{ flex: 1 }}>+ Add Content</Btn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-[22px]">
        <StatCard label="Deliverables" value={clientDelivs.length} sub="Total"              accentColor="#4f46e5" />
        <StatCard label="Posted"       value={posted}             sub={`${clientDelivs.length - posted} remaining`} accentColor="#059669" />
        <StatCard label="Content OK"   value={contentApproved}   sub="Approved"             accentColor="#0ea5e9" />
        <StatCard label="Client OK"    value={clientApproved}    sub="Approved"             accentColor="#8b5cf6" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: '#f1f3f8', border: '1px solid #e2e6ef', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600,
            transition: 'all 0.15s',
            background: tab === t.id ? '#ffffff' : 'transparent',
            color: tab === t.id ? '#4f46e5' : '#6b7280',
            boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <Card>
            <CardTitle>Client Info</CardTitle>
            <InfoRow label="Industry"    value={client.industry} />
            <InfoRow label="Brand Tone"  value={client.brand_tone} />
            <InfoRow label="Contact"     value={client.contact_name} />
            <InfoRow label="Email"       value={client.contact_email} />
            <InfoRow label="Phone"       value={client.contact_phone} />
          </Card>
          <Card>
            <CardTitle>Approval Pipeline</CardTitle>
            <PipelineBar label="Content Approved" count={contentApproved} total={clientDelivs.length} color="#4f46e5" />
            <PipelineBar label="Client Approved"  count={clientApproved}  total={clientDelivs.length} color="#0ea5e9" />
            <PipelineBar label="Posted"           count={posted}          total={clientDelivs.length} color="#059669" />
          </Card>
        </div>
      )}

      {/* Deliverables */}
      {tab === 'deliverables' && (
        <Card style={{ padding: 0 }}>
          <Table headers={['Date', 'Code', 'Type', 'Platform', 'Content', 'Ref', 'Creative', 'Ref', 'Client', 'Posted']}>
            {clientDelivs.map(d => {
              const t = d.daily_tracker?.[0] || {}
              return (
                <tr key={d.id}>
                  <Td style={{ color: '#9ca3af', fontSize: 12 }}>{fmtDate(d.date)}</Td>
                  <Td><span style={{ color: '#4f46e5', fontWeight: 700 }}>{d.activity_code}</span></Td>
                  <Td><ActivityBadge type={d.activity_type} /></Td>
                  <Td style={{ color: '#6b7280', fontSize: 12 }}>{d.platform || '-'}</Td>
                  <Td><select value={t.content_status || ''} onChange={e => updateTracker(t.id, d.id, 'content_status', e.target.value)} style={selStyle}><option value="">—</option>{CONTENT_STATUSES.map(s => <option key={s}>{s}</option>)}</select></Td>
                  <Td><RefLinkCell value={t.content_reference} onSave={url => updateTracker(t.id, d.id, 'content_reference', url)} color="#4f46e5" /></Td>
                  <Td><select value={t.creative_status || ''} onChange={e => updateTracker(t.id, d.id, 'creative_status', e.target.value)} style={selStyle}><option value="">—</option>{CREATIVE_STATUSES.map(s => <option key={s}>{s}</option>)}</select></Td>
                  <Td><RefLinkCell value={t.creative_reference} onSave={url => updateTracker(t.id, d.id, 'creative_reference', url)} color="#8b5cf6" /></Td>
                  <Td><select value={t.client_status || ''} onChange={e => updateTracker(t.id, d.id, 'client_status', e.target.value)} style={selStyle}><option value="">—</option>{CLIENT_STATUSES.map(s => <option key={s}>{s}</option>)}</select></Td>
                  <Td><select value={t.posting_status || ''} onChange={e => updateTracker(t.id, d.id, 'posting_status', e.target.value)} style={selStyle}><option value="">—</option>{POSTING_STATUSES.map(s => <option key={s}>{s}</option>)}</select></Td>
                </tr>
              )
            })}
          </Table>
        </Card>
      )}

      {/* Content Details */}
      {tab === 'content' && (
        <Card style={{ padding: 0 }}>
          <Table headers={['Deliverable', 'Title', 'Copy', 'Status', 'Reference', 'Rough Cut', 'Final Output', 'Actions']}>
            {clientContent.map(cd => (
              <tr key={cd.id}>
                <Td><span style={{ color: '#4f46e5', fontWeight: 700 }}>{cd.deliverable?.activity_code || '-'}</span></Td>
                <Td style={{ fontWeight: 500 }}>{cd.title || '-'}</Td>
                <Td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#6b7280', fontSize: 12 }}>{cd.copy || '-'}</Td>
                <Td><Badge status={cd.content_approval_status} /></Td>
                <Td>{cd.reference ? <a href={cd.reference} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontWeight: 600 }}>↗ Link</a> : '-'}</Td>
                <Td>{cd.rough_cut ? <a href={cd.rough_cut} target="_blank" rel="noreferrer" style={{ color: '#8b5cf6', fontWeight: 600 }}>↗ Link</a> : '-'}</Td>
                <Td>{cd.final_output ? <a href={cd.final_output} target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: 600 }}>↗ Link</a> : '-'}</Td>
                <Td>
                  <Btn size="sm" variant="ghost" onClick={() => openEditContent(cd)}>Edit</Btn>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Modals */}
      {showAddDeliv && (
        <Modal title="Add Deliverable" onClose={() => setShowAddDeliv(false)}>
          <FormGrid>
            <FormGroup label="Activity Code *"><input value={form.activity_code || ''} onChange={e => f({ activity_code: e.target.value })} placeholder="e.g. ACT001" /></FormGroup>
            <FormGroup label="Activity Type">
              <select value={form.activity_type || 'AT001'} onChange={e => f({ activity_type: e.target.value })}>
                <option value="AT001">Post</option><option value="AT002">Reel</option>
                <option value="AT004">YT Short</option><option value="AT005">YT Long</option>
              </select>
            </FormGroup>
            <FormGroup label="Date"><input type="date" value={form.date || ''} onChange={e => f({ date: e.target.value })} /></FormGroup>
            <FormGroup label="Platform"><input value={form.platform || ''} onChange={e => f({ platform: e.target.value })} placeholder="Instagram, YouTube..." /></FormGroup>
            <FormGroup label="Notes" fullWidth><textarea value={form.notes || ''} onChange={e => f({ notes: e.target.value })} placeholder="Additional notes..." /></FormGroup>
          </FormGrid>
          <ModalActions>
            <Btn variant="ghost" onClick={() => setShowAddDeliv(false)}>Cancel</Btn>
            <Btn onClick={saveDeliverable}>Add Deliverable</Btn>
          </ModalActions>
        </Modal>
      )}

      {showAddContent && (
        <Modal title={editingContentId ? 'Edit Content Detail' : 'Add Content Detail'} onClose={() => setShowAddContent(false)}>
          <FormGrid>
            <FormGroup label="Deliverable *">
              <select value={form.deliverable_id || ''} onChange={e => f({ deliverable_id: e.target.value })}>
                <option value="">Select</option>
                {clientDelivs.map(d => <option key={d.id} value={d.id}>{d.activity_code}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Title"><input value={form.title || ''} onChange={e => f({ title: e.target.value })} placeholder="Content title" /></FormGroup>
            <FormGroup label="Copy (Caption)" fullWidth><textarea value={form.copy || ''} onChange={e => f({ copy: e.target.value })} placeholder="Social media caption..." /></FormGroup>
            <FormGroup label="Description" fullWidth><textarea value={form.description || ''} onChange={e => f({ description: e.target.value })} placeholder="Content description..." /></FormGroup>
            <FormGroup label="Reference">
              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <input type="file" onChange={e => handleFileUpload(e.target.files[0], 'reference')} style={{ fontSize: 13 }} />
                <input value={form.reference || ''} onChange={e => f({ reference: e.target.value })} placeholder="Or paste URL..." />
                {uploadingField === 'reference' && <span style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600 }}>Uploading...</span>}
              </div>
            </FormGroup>
            <FormGroup label="Rough Cut">
              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <input type="file" onChange={e => handleFileUpload(e.target.files[0], 'rough_cut')} style={{ fontSize: 13 }} />
                <input value={form.rough_cut || ''} onChange={e => f({ rough_cut: e.target.value })} placeholder="Or paste URL..." />
                {uploadingField === 'rough_cut' && <span style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600 }}>Uploading...</span>}
              </div>
            </FormGroup>
            <FormGroup label="Final Output">
              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <input type="file" onChange={e => handleFileUpload(e.target.files[0], 'final_output')} style={{ fontSize: 13 }} />
                <input value={form.final_output || ''} onChange={e => f({ final_output: e.target.value })} placeholder="Or paste URL..." />
                {uploadingField === 'final_output' && <span style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600 }}>Uploading...</span>}
              </div>
            </FormGroup>
            <FormGroup label="Thumbnail URL"><input value={form.thumbnail || ''} onChange={e => f({ thumbnail: e.target.value })} placeholder="https://..." /></FormGroup>
            <FormGroup label="Content Status">
              <select value={form.content_approval_status || 'Content Not Written'} onChange={e => f({ content_approval_status: e.target.value })}>
                {CONTENT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </FormGroup>
          </FormGrid>
          <ModalActions>
            <Btn variant="ghost" onClick={() => setShowAddContent(false)}>Cancel</Btn>
            <Btn onClick={saveContentDetail}>{editingContentId ? 'Update' : 'Save'} Content</Btn>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 13 }}>
      <span style={{ color: '#9ca3af', minWidth: 100, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#374151', fontWeight: 500 }}>{value || '—'}</span>
    </div>
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
