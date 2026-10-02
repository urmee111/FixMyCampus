import { apiRequest } from './client'

// GET /issues/similar?title=&category=&building= -> data is a plain ARRAY (up to 3) of
// { id, title, location, status, upvoteCount }. An empty array means "no possible duplicate".
// The backend needs the title (5+ characters), a valid category and the building (the part before the comma).
export function getSimilarIssues({ title, category, building }) {
  const query = new URLSearchParams({ title, category, building })
  return apiRequest(`/issues/similar?${query}`)
}
