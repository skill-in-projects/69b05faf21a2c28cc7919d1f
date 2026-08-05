// Small helper so I don't repeat the base url in every component.
const BASE_URL =
  (typeof window !== 'undefined' && window.CONFIG?.API_URL) || 'http://localhost:5000'

async function request(path, options) {
  const response = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    // The backend sends { error: "..." } when something goes wrong.
    let message = 'Request failed (' + response.status + ')'
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // response was not json, keep the generic message
    }
    throw new Error(message)
  }

  return response.json()
}

export function saveSnapshot(reportType, filters) {
  return request('/api/reports/snapshots', {
    method: 'POST',
    body: JSON.stringify({
      reportType,
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
      contributorId: filters.contributorId ? Number(filters.contributorId) : null,
    }),
  })
}

export function listSnapshots() {
  return request('/api/reports/snapshots')
}

export function getSnapshot(id) {
  return request('/api/reports/snapshots/' + id)
}
