// Comment endpoints. Returns response.data.data.

import api from './client';

// POST /issues/:id/comments  { text }  ->  the new comment
export async function addComment(issueId, text) {
  const response = await api.post(`/issues/${issueId}/comments`, { text });
  return response.data.data;
}
