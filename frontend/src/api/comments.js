import { apiRequest } from './client'

// POST /issues/:id/comments -> 201, data = the comment { id, text, createdAt, user { id, name, role } }
export function addComment(issueId, text) {
  return apiRequest(`/issues/${issueId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}
