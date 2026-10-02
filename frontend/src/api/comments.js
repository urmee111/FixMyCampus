import { apiRequest } from './client'
import { MOCK_USERS } from '../data/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function addComment(issueId, text, currentUser = MOCK_USERS.student) {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 260))
    const newComment = {
      id: Date.now(),
      text,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
      },
    }
    return {
      success: true,
      data: { comment: newComment },
    }
  }

  return apiRequest(`/issues/${issueId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}
