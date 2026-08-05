// The same table is used for the live report and for a saved snapshot, so a snapshot really looks
// like the report it was taken from.
export default function ReportTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <p style={{ color: '#6b7280' }}>No data for these filters.</p>
  }

  const columns = Object.keys(rows[0])

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                borderBottom: '1px solid #e5e7eb',
                color: '#4b5563',
                fontWeight: 600,
              }}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td
                key={column}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid #f3f4f6',
                  color: '#374151',
                }}
              >
                {String(row[column] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
