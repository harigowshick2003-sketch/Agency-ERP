'use client'
import { StatCard, Card, CardTitle, Table, Td, PipelineBar, Badge, ActivityBadge } from '@/components/UI'
import { fmtDate, ACTIVITY_LABELS, ACTIVITY_COLORS, ACTIVITY_BG } from '@/lib/utils'

export default function Dashboard({ state }) {
  const { clients, deliverables, jobs } = state
  const totalDel = deliverables.length
  const completed = deliverables.filter(d => {
    const t = d.daily_tracker?.[0]
    return t?.content_status === 'Content Approved' && t?.creative_status === 'Creative Approved'
      && t?.client_status === 'Client Approved' && t?.posting_status === 'Posted'
  }).length
  const pending = totalDel - completed
  const posted = deliverables.filter(d => d.daily_tracker?.[0]?.posting_status === 'Posted').length
  const notPosted = totalDel - posted
  const contentApproved = deliverables.filter(d => d.daily_tracker?.[0]?.content_status === 'Content Approved').length
  const clientApproved = deliverables.filter(d => d.daily_tracker?.[0]?.client_status === 'Client Approved').length
  const totalJobs = jobs.length
  const corrections = jobs.filter(j => j.is_correction).length
  const pct = totalDel ? Math.round((completed / totalDel) * 100) : 0

  const clientCounts = {}
  deliverables.forEach(d => {
    const name = d.client?.name || 'Unknown'
    clientCounts[name] = (clientCounts[name] || 0) + 1
  })
  const topClients = Object.entries(clientCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxCount = Math.max(...topClients.map(c => c[1]), 1)

  const types = { AT001: 0, AT002: 0, AT004: 0, AT005: 0 }
  deliverables.forEach(d => { if (types[d.activity_type] !== undefined) types[d.activity_type]++ })
  const typeTotal = Object.values(types).reduce((a, b) => a + b, 0) || 1

  const r = 42, circ = 2 * Math.PI * r, dash = circ * (pct / 100)

  const statCards = [
    { label: 'Total Clients',  value: clients.length, sub: 'Active accounts',      color: '#4f46e5' },
    { label: 'Deliverables',   value: totalDel,        sub: 'This month',           color: '#0ea5e9' },
    { label: 'Completed',      value: completed,       sub: `${pct}% of total`,     color: '#059669' },
    { label: 'Pending',        value: pending,         sub: 'Need action',          color: '#f59e0b' },
    { label: 'Posted',         value: posted,          sub: `${notPosted} not posted`, color: '#8b5cf6' },
    { label: 'Job Tasks',      value: totalJobs,       sub: `${corrections} corrections`, color: '#ec4899' },
  ]

  return (
    <div className="p-[16px] md:p-[24px_28px]">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-2xl p-[24px_20px] md:p-[24px_28px] mb-[24px] flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_4px_20px_rgba(79,70,229,0.25)] overflow-hidden relative gap-4"
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, right: 100, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
            Good day 👋
          </div>
          <div style={{ color: '#ffffff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
            Agency Operations
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            {totalDel} deliverables tracked · {clients.length} active clients
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Overall Progress</div>
          <div style={{ color: '#ffffff', fontSize: 40, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>{pct}%</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>completed</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {statCards.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} accentColor={s.color} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] mb-[24px]">
        {/* Donut */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <CardTitle>Overall Completion</CardTitle>
          <svg width="120" height="120" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={r} fill="none" stroke="#f1f3f8" strokeWidth="10" />
            <circle cx="55" cy="55" r={r} fill="none" stroke="#4f46e5" strokeWidth="10"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
            <text x="55" y="52" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="18" fontWeight="800" fill="#111827">{pct}%</text>
            <text x="55" y="66" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="9" fill="#9ca3af">COMPLETED</text>
          </svg>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ color: '#059669', fontWeight: 600 }}>✓ {completed} done</span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>◷ {pending} pending</span>
          </div>
        </Card>

        {/* Pipeline */}
        <Card>
          <CardTitle>Approval Pipeline</CardTitle>
          <PipelineBar label="Content Approved" count={contentApproved} total={totalDel} color="#4f46e5" />
          <PipelineBar label="Client Approved"  count={clientApproved}  total={totalDel} color="#0ea5e9" />
          <PipelineBar label="Posted"           count={posted}          total={totalDel} color="#059669" />
        </Card>

        {/* Type split */}
        <Card>
          <CardTitle>Content Type Split</CardTitle>
          {Object.entries(types).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: ACTIVITY_COLORS[k], flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{ACTIVITY_LABELS[k]}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', minWidth: 24, textAlign: 'right' }}>{v}</div>
              <div style={{ width: 64, background: '#f1f3f8', borderRadius: 3, height: 5 }}>
                <div style={{ width: `${Math.round((v / typeTotal) * 100)}%`, background: ACTIVITY_COLORS[k], height: 5, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Bar chart */}
      {topClients.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <CardTitle>Client Deliverable Load</CardTitle>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 110, paddingBottom: 4 }}>
            {topClients.map(([name, count]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
                <div style={{ fontSize: 11, color: '#374151', fontWeight: 700 }}>{count}</div>
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(180deg, #4f46e5, #7c3aed)',
                  borderRadius: '5px 5px 0 0',
                  height: Math.round((count / maxCount) * 85), minHeight: 6,
                  transition: 'height 0.4s ease',
                }} />
                <div style={{
                  fontSize: 10, color: '#9ca3af', textAlign: 'center',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 64, fontWeight: 500,
                }}>{name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent deliverables */}
      <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#111827', letterSpacing: '-0.2px' }}>
        Recent Deliverables
      </div>
      <Card style={{ padding: 0 }}>
        <Table headers={['Date', 'Client', 'Activity', 'Type', 'Content', 'Creative', 'Client', 'Posted']}>
          {deliverables.slice(0, 12).map(d => {
            const t = d.daily_tracker?.[0] || {}
            const done = t.posting_status === 'Posted'
            return (
              <tr key={d.id} style={{ background: done ? 'rgba(5,150,105,0.04)' : undefined }}>
                <Td style={{ color: '#9ca3af', whiteSpace: 'nowrap', fontSize: 12 }}>{fmtDate(d.date)}</Td>
                <Td><span style={{ fontWeight: 600, color: '#111827' }}>{d.client?.name || '-'}</span></Td>
                <Td><span style={{ color: '#4f46e5', fontWeight: 600 }}>{d.activity_code}</span></Td>
                <Td><ActivityBadge type={d.activity_type} /></Td>
                <Td><Badge status={t.content_status} /></Td>
                <Td><Badge status={t.creative_status} /></Td>
                <Td><Badge status={t.client_status} /></Td>
                <Td><Badge status={t.posting_status} /></Td>
              </tr>
            )
          })}
        </Table>
        {deliverables.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af', fontSize: 13 }}>
            No deliverables yet
          </div>
        )}
      </Card>
    </div>
  )
}
