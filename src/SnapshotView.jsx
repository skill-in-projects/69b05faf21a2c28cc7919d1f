import { useEffect, useState } from 'react'
import { getSnapshot } from './api'
import ReportTable from './ReportTable'

// Shows one saved snapshot. The banner makes it obvious this is an archived report and not the live
// numbers, and the badge is the "proof it was not modified" the customer asked for.
export default function SnapshotView({ snapshotId, onBack }) {
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getSnapshot(snapshotId)
      .then(setSnapshot)
      .catch((err) => setError(err.message))
  }, [snapshotId])

  if (error) {
    return <p style={{ color: '#b91c1c' }}>{error}</p>
  }

  if (!snapshot) {
    return <p style={{ color: '#6b7280' }}>Loading snapshot...</p>
  }

  const generatedAt = new Date(snapshot.generatedAt).toLocaleString()

  return (
    <div>
      <button onClick={onBack} style={linkButtonStyle}>
        &larr; Back to analytics
      </button>

      <div
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '0.75rem 1rem',
          margin: '1rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <span style={{ color: '#4b5563' }}>Archived report — generated on {generatedAt}</span>
        {snapshot.verified ? (
          <span style={{ ...badgeStyle, background: '#ecfdf5', color: '#047857' }}>✓ Verified</span>
        ) : (
          <span style={{ ...badgeStyle, background: '#fef2f2', color: '#b91c1c' }}>
            ⚠ Integrity check failed
          </span>
        )}
      </div>

      <ReportTable rows={snapshot.data} />
    </div>
  )
}

const badgeStyle = {
  padding: '0.2rem 0.6rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  whiteSpace: 'nowrap',
}

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#4b5563',
  cursor: 'pointer',
  fontSize: '0.9rem',
}
