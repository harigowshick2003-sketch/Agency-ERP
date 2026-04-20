'use client'
import { useState, useMemo } from 'react'
import { Card, CardTitle, StatCard, Table, Td, Badge, ActivityBadge, EmptyState } from '@/components/UI'

const AVATAR_COLORS = ['#4f46e5', '#7c3aed', '#0ea5e9', '#059669', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981']
const DEPT_COLORS = {
  Creative:   { bg: '#ede9fe', color: '#7c3aed' },
  Content:    { bg: '#dbeafe', color: '#1d4ed8' },
  Strategy:   { bg: '#d1fae5', color: '#065f46' },
  Tech:       { bg: '#fef3c7', color: '#92400e' },
  Management: { bg: '#fce7f3', color: '#9d174d' },
}

const SORT_OPTIONS = [
  { value: 'total',       label: 'Total Jobs' },
  { value: 'done',        label: 'Completed' },
  { value: 'rate',        label: 'Completion Rate' },
  { value: 'corrections', label: 'Corrections' },
]

function buildStats(emp, jobs) {
  const myJobs   = jobs.filter(j => j.assigned_to === emp.id)
  const total       = myJobs.length
  const done        = myJobs.filter(j => j.status === 'Done').length
  const inProgress  = myJobs.filter(j => j.status === 'In Progress').length
  const pending     = myJobs.filter(j => j.status === 'Pending').length
  // Count corrections: either flagged as correction OR has Correction status
  const corrections = myJobs.filter(j => j.is_correction || j.status === 'Correction').length
  const rate        = total ? Math.round((done / total) * 100) : 0

  // Task type breakdown
  const taskTypes = {}
  myJobs.forEach(j => {
    const k = j.task_type || 'Unspecified'
    taskTypes[k] = (taskTypes[k] || 0) + 1
  })

  return { total, done, inProgress, pending, corrections, rate, taskTypes, myJobs }
}

// ── Mini radial arc progress ──────────────────────────────────────────
function RadialProgress({ pct, color, size = 60 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (pct / 100)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f3f8" strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle"
        fontFamily="Inter,sans-serif" fontSize="11" fontWeight="800" fill="#111827">
        {pct}%
      </text>
    </svg>
  )
}

// ── Mini task-type bar ────────────────────────────────────────────────
function TaskTypeBar({ taskTypes, total }) {
  if (!total) return <div style={{ fontSize: 11, color: '#d1d5db' }}>No tasks</div>
  const COLORS = ['#4f46e5', '#0ea5e9', '#059669', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#dc2626']
  const entries = Object.entries(taskTypes).sort((a, b) => b[1] - a[1])
  return (
    <div>
      <div style={{ display: 'flex', height: 6, borderRadius: 4, overflow: 'hidden', gap: 1, marginBottom: 6 }}>
        {entries.map(([k, v], i) => (
          <div key={k} style={{ flex: v, background: COLORS[i % COLORS.length], minWidth: 2 }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {entries.slice(0, 4).map(([k, v], i) => (
          <span key={k} style={{ fontSize: 10, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: COLORS[i % COLORS.length], display: 'inline-block' }} />
            {k} ({v})
          </span>
        ))}
        {entries.length > 4 && <span style={{ fontSize: 10, color: '#9ca3af' }}>+{entries.length - 4} more</span>}
      </div>
    </div>
  )
}

// ── Employee Performance Card ─────────────────────────────────────────
function EmpCard({ emp, stats, idx, rank, isSelected, onClick }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const deptStyle = DEPT_COLORS[emp.department] || { bg: '#f3f4f6', color: '#6b7280' }
  const corrRate = stats.total ? Math.round((stats.corrections / stats.total) * 100) : 0

  return (
    <div
      onClick={onClick}
      style={{
        background: '#ffffff',
        border: isSelected ? `2px solid #4f46e5` : '1px solid #e2e6ef',
        borderRadius: 16,
        padding: 20,
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: isSelected
          ? '0 4px 20px rgba(79,70,229,0.18)'
          : '0 1px 4px rgba(0,0,0,0.05)',
        transform: isSelected ? 'translateY(-2px)' : undefined,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.borderColor = '#c7d2fe'
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = '#e2e6ef'
        }
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: isSelected ? '#4f46e5' : color, borderRadius: '16px 16px 0 0'
      }} />

      {/* Rank badge */}
      <div style={{
        position: 'absolute', top: 12, right: 14,
        width: 26, height: 26, borderRadius: 8,
        background: rank <= 3 ? (rank === 1 ? '#fbbf24' : rank === 2 ? '#94a3b8' : '#d97706') : '#f1f3f8',
        color: rank <= 3 ? '#ffffff' : '#9ca3af',
        fontSize: 11, fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>#{rank}</div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, marginTop: 6 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter', fontWeight: 800, fontSize: 18, color: '#ffffff',
          boxShadow: `0 2px 8px ${color}44`,
        }}>
          {emp.name[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {emp.name}
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>{emp.role || '—'}</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {emp.department && (
              <span style={{ background: deptStyle.bg, color: deptStyle.color, padding: '1px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
                {emp.department}
              </span>
            )}
            <span style={{ background: '#f1f3f8', color: '#9ca3af', padding: '1px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
              {emp.emp_id || '—'}
            </span>
          </div>
        </div>
        <RadialProgress pct={stats.rate} color={isSelected ? '#4f46e5' : color} size={56} />
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
        {[
          { label: 'Total', value: stats.total, bg: '#f8f9fc', fg: '#111827' },
          { label: 'Done', value: stats.done, bg: '#f0fdf4', fg: '#059669' },
          { label: 'Active', value: stats.inProgress, bg: '#eff6ff', fg: '#1d4ed8' },
          { label: 'Fixes', value: stats.corrections, bg: corrRate > 20 ? '#fef2f2' : '#fafafa', fg: corrRate > 20 ? '#dc2626' : '#9ca3af' },
        ].map(m => (
          <div key={m.label} style={{ background: m.bg, borderRadius: 8, padding: '7px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: m.fg, letterSpacing: '-0.5px' }}>{m.value}</div>
            <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Task type bar */}
      <TaskTypeBar taskTypes={stats.taskTypes} total={stats.total} />
    </div>
  )
}

// ── Employee Drill-Down Panel ─────────────────────────────────────────
function DrillDown({ emp, stats, idx, clients, onClose }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const corrRate = stats.total ? Math.round((stats.corrections / stats.total) * 100) : 0

  const taskTypeEntries = Object.entries(stats.taskTypes).sort((a, b) => b[1] - a[1])
  const maxTaskCount = Math.max(...taskTypeEntries.map(e => e[1]), 1)
  const COLORS = ['#4f46e5', '#0ea5e9', '#059669', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#dc2626']

  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e2e6ef', borderRadius: 16,
      padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      animation: 'slideIn 0.25s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter', fontWeight: 800, fontSize: 22, color: '#ffffff',
          boxShadow: `0 4px 12px ${color}44`,
        }}>
          {emp.name[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px' }}>{emp.name}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{emp.role || 'No role'} · {emp.department || 'No dept'} · {emp.emp_id || 'No ID'}</div>
          {emp.email && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{emp.email}</div>}
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#f8f9fc', border: '1px solid #e2e6ef', borderRadius: 8,
            cursor: 'pointer', padding: '6px 12px', fontSize: 12, fontWeight: 600,
            color: '#6b7280', fontFamily: 'Inter',
          }}
        >✕ Close</button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Jobs',    value: stats.total,       color: '#4f46e5', bg: '#eef2ff' },
          { label: 'Completed',     value: stats.done,        color: '#059669', bg: '#f0fdf4' },
          { label: 'In Progress',   value: stats.inProgress,  color: '#1d4ed8', bg: '#eff6ff' },
          { label: 'Pending',       value: stats.pending,     color: '#d97706', bg: '#fff7ed' },
          { label: 'Corrections',   value: stats.corrections, color: corrRate > 20 ? '#dc2626' : '#6b7280', bg: corrRate > 20 ? '#fef2f2' : '#f8f9fc' },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, fontFamily: 'Inter', letterSpacing: '-1px' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Completion rate + Task type chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Completion gauge */}
        <div style={{ background: '#f8f9fc', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completion Rate</div>
          <RadialProgress pct={stats.rate} color={color} size={100} />
          <div style={{ marginTop: 12, fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
            <span style={{ color: '#059669', fontWeight: 700 }}>{stats.done}</span> completed of <span style={{ fontWeight: 700 }}>{stats.total}</span> total
          </div>
          {corrRate > 0 && (
            <div style={{ marginTop: 6, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
              ⚠ {corrRate}% correction rate
            </div>
          )}
        </div>

        {/* Task type breakdown */}
        <div style={{ background: '#f8f9fc', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Type Breakdown</div>
          {taskTypeEntries.length === 0 ? (
            <div style={{ color: '#d1d5db', fontSize: 13, textAlign: 'center', paddingTop: 20 }}>No tasks yet</div>
          ) : (
            taskTypeEntries.map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 3, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: '#374151', fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', minWidth: 20, textAlign: 'right' }}>{v}</div>
                <div style={{ width: 80, background: '#e2e6ef', borderRadius: 3, height: 5 }}>
                  <div style={{ width: `${Math.round((v / maxTaskCount) * 100)}%`, background: COLORS[i % COLORS.length], height: 5, borderRadius: 3, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Job history table */}
      <div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12, letterSpacing: '-0.2px' }}>
          Job History
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e6ef', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#f8f9fc' }}>
                  {['Deliverable', 'Client', 'Type', 'Task Type', 'Status', 'Correction'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 14px',
                      fontSize: 10, letterSpacing: '0.05em',
                      textTransform: 'uppercase', color: '#6b7280',
                      borderBottom: '1px solid #e2e6ef', whiteSpace: 'nowrap', fontWeight: 600
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.myJobs.map(j => (
                  <tr key={j.id} style={{
                    background: j.is_correction ? 'rgba(220,38,38,0.03)' : j.status === 'Done' ? 'rgba(5,150,105,0.03)' : undefined
                  }}>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f3f8', verticalAlign: 'middle' }}>
                      <span style={{ color: '#4f46e5', fontWeight: 700 }}>{j.deliverable?.activity_code || '-'}</span>
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f3f8', verticalAlign: 'middle', color: '#6b7280' }}>
                      {clients.find(c => c.id === j.deliverable?.client_id)?.name || '-'}
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f3f8', verticalAlign: 'middle' }}>
                      <ActivityBadge type={j.deliverable?.activity_type} />
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f3f8', verticalAlign: 'middle', color: '#374151', fontWeight: 500 }}>
                      {j.task_type || <span style={{ color: '#d1d5db' }}>—</span>}
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f3f8', verticalAlign: 'middle' }}>
                      <Badge status={j.status} />
                    </td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f3f8', verticalAlign: 'middle' }}>
                      {j.is_correction
                        ? <span style={{ color: '#dc2626', fontSize: 11, fontWeight: 700, background: '#fee2e2', padding: '2px 8px', borderRadius: 5 }}>Yes</span>
                        : <span style={{ color: '#d1d5db', fontSize: 11 }}>—</span>}
                    </td>
                  </tr>
                ))}
                {stats.myJobs.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                      No jobs assigned yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Performance Page ─────────────────────────────────────────────
export default function Performance({ state }) {
  const [sortBy, setSortBy] = useState('total')
  const [selectedEmpId, setSelectedEmpId] = useState(null)
  const [deptFilter, setDeptFilter] = useState('')
  const [search, setSearch] = useState('')

  const { employees, jobs, clients } = state

  // Compute per-employee stats
  const empStats = useMemo(() =>
    employees.map((emp, idx) => ({ emp, idx, stats: buildStats(emp, jobs) })),
    [employees, jobs]
  )

  // Filter + sort
  const sorted = useMemo(() => {
    let list = empStats.filter(({ emp }) => {
      const matchSearch = !search || emp.name.toLowerCase().includes(search.toLowerCase()) || emp.role?.toLowerCase().includes(search.toLowerCase())
      const matchDept = !deptFilter || emp.department === deptFilter
      return matchSearch && matchDept
    })
    return list.sort((a, b) => {
      if (sortBy === 'total')       return b.stats.total       - a.stats.total
      if (sortBy === 'done')        return b.stats.done        - a.stats.done
      if (sortBy === 'rate')        return b.stats.rate        - a.stats.rate
      if (sortBy === 'corrections') return b.stats.corrections - a.stats.corrections
      return 0
    })
  }, [empStats, sortBy, search, deptFilter])

  // Team-wide summary
  const totalJobs   = jobs.length
  const totalDone   = jobs.filter(j => j.status === 'Done').length
  const totalCorr   = jobs.filter(j => j.is_correction).length
  const avgRate     = empStats.length ? Math.round(empStats.reduce((a, { stats }) => a + stats.rate, 0) / empStats.length) : 0
  const topPerformer = [...empStats].sort((a, b) => b.stats.done - a.stats.done)[0]

  // Search ALL employees (not just filtered) so selection survives filter changes
  const selectedItem = selectedEmpId ? empStats.find(i => i.emp.id === selectedEmpId) : null
  // If filtered out, close the drill-down
  const drillDownVisible = selectedItem && sorted.some(i => i.emp.id === selectedEmpId)

  const DEPTS = ['Creative', 'Content', 'Strategy', 'Tech', 'Management']

  const filterInput = {
    background: '#f8f9fc', border: '1.5px solid #e2e6ef', borderRadius: 8,
    padding: '8px 13px', color: '#374151', fontFamily: 'Inter,sans-serif',
    fontSize: 13, outline: 'none', fontWeight: 500, cursor: 'pointer',
  }

  return (
    <div className="p-[16px] md:p-[24px_28px]">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-2xl p-[22px_20px] md:p-[22px_28px] mb-[24px] flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_4px_20px_rgba(79,70,229,0.25)] relative overflow-hidden gap-[16px]"
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, right: 120, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>
            Team Overview
          </div>
          <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 4 }}>
            Employee Performance
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            {employees.length} team member{employees.length !== 1 ? 's' : ''} · {totalJobs} total jobs tracked
          </div>
        </div>
        {topPerformer && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>🏆 Top Performer</div>
            <div style={{ color: '#ffffff', fontSize: 16, fontWeight: 800 }}>{topPerformer.emp.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{topPerformer.stats.done} jobs completed</div>
          </div>
        )}
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-[24px]">
        <StatCard label="Team Members"  value={employees.length} sub="Active employees"    accentColor="#4f46e5" />
        <StatCard label="Total Jobs"    value={totalJobs}        sub="All assignments"     accentColor="#0ea5e9" />
        <StatCard label="Completed"     value={totalDone}        sub={`${totalJobs ? Math.round((totalDone/totalJobs)*100) : 0}% completion rate`} accentColor="#059669" />
        <StatCard label="Corrections"   value={totalCorr}        sub={`${totalJobs ? Math.round((totalCorr/totalJobs)*100) : 0}% rework rate`} accentColor="#dc2626" />
      </div>

      {/* Filters */}
      <div className="flex gap-[10px] mb-[20px] flex-wrap items-center">
        <input
          placeholder="Search by name or role..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...filterInput, cursor: 'text' }}
          className="flex-1 min-w-[200px]"
        />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={filterInput} className="flex-1 min-w-[140px]">
          <option value="">All Departments</option>
          {DEPTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 2, background: '#f1f3f8', border: '1px solid #e2e6ef', borderRadius: 10, padding: 3, marginLeft: 'auto' }}>
          {SORT_OPTIONS.map(o => (
            <button key={o.value} onClick={() => setSortBy(o.value)} style={{
              padding: '6px 12px', borderRadius: 7, border: 'none',
              cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
              background: sortBy === o.value ? '#ffffff' : 'transparent',
              color: sortBy === o.value ? '#4f46e5' : '#6b7280',
              boxShadow: sortBy === o.value ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              whiteSpace: 'nowrap',
            }}>{o.label}</button>
          ))}
        </div>
      </div>

      {/* Content area */}
      {sorted.length === 0 ? (
        <EmptyState icon="👥" message="No employees found" />
      ) : (
        <div className={`grid gap-[20px] ${drillDownVisible ? 'grid-cols-1 xl:grid-cols-[1fr_1.1fr]' : 'grid-cols-1'}`}>
          {/* Left: Employee cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: drillDownVisible ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, alignContent: 'start' }}>
            {sorted.map(({ emp, idx, stats }, rankIdx) => (
              <EmpCard
                key={emp.id}
                emp={emp}
                stats={stats}
                idx={idx}
                rank={rankIdx + 1}
                isSelected={selectedEmpId === emp.id}
                onClick={() => setSelectedEmpId(selectedEmpId === emp.id ? null : emp.id)}
              />
            ))}
          </div>

          {/* Right: Drill-down panel */}
          {drillDownVisible && (
            <div style={{ alignSelf: 'start', position: 'sticky', top: 24 }}>
              <DrillDown
                emp={selectedItem.emp}
                stats={selectedItem.stats}
                idx={selectedItem.idx}
                clients={clients}
                onClose={() => setSelectedEmpId(null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
