// Issue endpoints. Each function returns response.data.data.
// For create/update you can pass a FormData (when there is a photo) or a plain object.

import api from './client';

// GET /issues?q=&category=&status=&location=&sort=&page=&limit=  ->  { items, page, limit, total, totalPages }
export async function getIssues(params) {
  const response = await api.get('/issues', { params });
  return response.data.data;
}

// GET /issues/similar?title=&category=&building=  ->  { items } (up to 3 possible duplicates)
export async function getSimilarIssues(params) {
  const response = await api.get('/issues/similar', { params });
  return response.data.data;
}

// GET /issues/:id  ->  issue + comments + history
export async function getIssue(id) {
  const response = await api.get(`/issues/${id}`);
  return response.data.data;
}

// POST /issues  (title, description, category, location, optional photo)
export async function createIssue(data) {
  const response = await api.post('/issues', data);
  return response.data.data;
}

// PUT /issues/:id  (owner only, only while the issue is Open)
export async function updateIssue(id, data) {
  const response = await api.put(`/issues/${id}`, data);
  return response.data.data;
}

// DELETE /issues/:id  (owner or admin)
export async function deleteIssue(id) {
  const response = await api.delete(`/issues/${id}`);
  return response.data.data;
}

// POST /issues/:id/upvote  ->  { upvoted, upvoteCount }  (toggle, students only)
export async function toggleUpvote(id) {
  const response = await api.post(`/issues/${id}/upvote`);
  return response.data.data;
}

// PATCH /issues/:id/status  { status, note? }  ->  issue  (admin only)
export async function updateStatus(id, { status, note }) {
  const response = await api.patch(`/issues/${id}/status`, { status, note });
  return response.data.data;
}

// GET /my/issues  ->  { items } (issues created by the logged-in user)
export async function getMyIssues() {
  const response = await api.get('/my/issues');
  return response.data.data;
}
