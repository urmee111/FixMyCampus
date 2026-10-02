import { apiRequest } from './client'

// Every function returns the backend's { success, data } object untouched.
// Issue shape (camelCase): id, title, description, category, location, photoUrl, status, upvoteCount,
// commentCount, priority, hasUpvoted, createdBy { id, name }, createdAt, updatedAt, resolvedAt.

// GET /issues -> data { items, page, limit, total, totalPages }
// params: q, category, status, location, sort ('upvotes' | 'newest' | 'oldest'), page, limit. Empty values are not sent.
export async function getIssues(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') query.set(key, String(value))
  })
  const suffix = query.toString() ? `?${query}` : ''
  return apiRequest(`/issues${suffix}`)
}

// GET /issues/:id -> data = the issue + comments [{ id, text, createdAt, user { id, name, role } }]
// + history [{ id, oldStatus, newStatus, note, changedAt, changedBy { id, name } }]
export function getIssue(id) {
  return apiRequest(`/issues/${id}`)
}

// GET /my/issues -> data { items, counts: { Open, "In Progress", Resolved, total } }
export function getMyIssues() {
  return apiRequest('/my/issues')
}

// POST /issues (multipart/form-data, the photo field is named "photo") -> 201 issue
export function createIssue({ title, description, category, location, photo }) {
  const body = new FormData()
  body.append('title', title)
  body.append('description', description)
  body.append('category', category)
  body.append('location', location)
  if (photo) body.append('photo', photo)
  return apiRequest('/issues', { method: 'POST', body })
}

// PUT /issues/:id (owner only, only while Open) -> issue
export function updateIssue(id, { title, description, category, location }) {
  return apiRequest(`/issues/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description, category, location }),
  })
}

// DELETE /issues/:id (owner or admin) -> { id, deleted: true }
export function deleteIssue(id) {
  return apiRequest(`/issues/${id}`, { method: 'DELETE' })
}

// POST /issues/:id/upvote (students only) -> { upvoted, upvoteCount }
export function toggleUpvote(id) {
  return apiRequest(`/issues/${id}/upvote`, { method: 'POST' })
}

// PATCH /issues/:id/status (admin only) -> the issue (without comments/history, so reload the details after)
export function updateStatus(id, status, note) {
  return apiRequest(`/issues/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, ...(note && note.trim() ? { note: note.trim() } : {}) }),
  })
}
