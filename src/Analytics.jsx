import { useEffect, useState } from 'react'
import { listSnapshots, saveSnapshot } from './api'
import SnapshotView from './SnapshotView'

const REPORT_TYPES = [
  { value: 'daily_contributions', label: 'Daily Contributions' },
  { value: 'historical_orders', label: 'Historical Orders' },
  { value: 'weekly_champions', label: 'Weekly Champions' },
]

export default function Analytics() {
  const [reportType, setReportType] = useState('daily_contributions')
  const [filters, setFilters] = useState({ startDate: '', endDate: '', contributorId: '' })
  const [snapshots, setSnapshots] = useState([])
  const [openSnapshotId, setOpenSnapshotId] = useState(null)
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function loadSnapshots() {
    listSnapshots()
      .then(setSnapshots)
      .catch((err) => setError(err.message))
  }

  useEffect(loadSnapshots, [])

  async function handleSaveSnapshot() {
    setSaving(true)
    setError('')
    setConfirmation('')
    try {
      const saved = await saveSnapshot(reportType, filters)
      setConfirmation('Snapshot #' + saved.id + ' saved')
      loadSnapshots()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleExport() {
    // The CSV export already existed - left as it was.
    window.alert('Export is not part of this change.')
  }

  if (openSnapshotId) {
    return <SnapshotView snapshotId={openSnapshotId} onBack={() => setOpenSnapshotId(null)} />
  }

  return (
    <div>
      <h2 style={headingStyle}>Analytics</h2>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label style={labelStyle}>
          Report
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={inputStyle}
          >
            {REPORT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          From
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          To
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            style={inputStyle}
          />
        </label>

        <button onClick={handleExport} style={buttonStyle}>
          Export CSV
        </button>
        <button onClick={handleSaveSnapshot} disabled={saving} style={buttonStyle}>
          {saving ? 'Saving...' : 'Save Snapshot'}
        </button>
      </div>

      {confirmation && <p style={{ color: '#047857', marginTop: '0.75rem' }}>{confirmation}</p>}
      {error && <p style={{ color: '#b91c1c', marginTop: '0.75rem' }}>{error}</p>}

      <h2 style={{ ...headingStyle, marginTop: '2rem' }}>Saved Snapshots</h2>
      {snapshots.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No snapshots saved yet.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
          <thead>
            <tr>
              {['Date', 'Report', 'Filters', ''].map((header) => (
                <th key={header} style={thStyle}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot) => (
              <tr key={snapshot.id}>
                <td style={tdStyle}>{new Date(snapshot.generatedAt).toLocaleString()}</td>
                <td style={tdStyle}>{snapshot.reportType}</td>
                <td style={tdStyle}>{describeFilters(snapshot.parameters)}</td>
                <td style={tdStyle}>
                  <button onClick={() => setOpenSnapshotId(snapshot.id)} style={linkButtonStyle}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function describeFilters(parameters) {
  if (!parameters) return '—'
  const parts = []
  if (parameters.startDate) parts.push('from ' + parameters.startDate.substring(0, 10))
  if (parameters.endDate) parts.push('to ' + parameters.endDate.substring(0, 10))
  if (parameters.contributorId) parts.push('contributor ' + parameters.contributorId)
  return parts.length > 0 ? parts.join(', ') : 'all'
}

const headingStyle = { fontSize: '1.1rem', color: '#374151', marginBottom: '0.75rem' }
const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: '0.8rem', color: '#6b7280' }
const inputStyle = {
  marginTop: '0.25rem',
  padding: '0.4rem 0.5rem',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  color: '#374151',
}
const buttonStyle = {
  padding: '0.45rem 0.9rem',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  background: '#f9fafb',
  color: '#374151',
  cursor: 'pointer',
}
const thStyle = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid #e5e7eb',
  color: '#4b5563',
  fontWeight: 600,
}
const tdStyle = { padding: '0.5rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#374151' }
const linkButtonStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#2563eb',
  cursor: 'pointer',
  fontSize: '0.9rem',
}
