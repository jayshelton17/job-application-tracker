export const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected']
export const TODAY_LABEL = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
export const TODAY_ISO = new Date().toISOString().slice(0, 10)

export async function api(path, token, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Something went wrong. Please try again.')
  return payload
}

export function formatDate(value) {
  if (!value) return 'No date'
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}