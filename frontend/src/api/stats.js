import { apiRequest } from './client'

// GET /stats (admin only) -> data {
//   total, byStatus { Open, "In Progress", Resolved }, byCategory { Electrical, ... },
//   topUpvoted [{ id, title, upvoteCount }], avgResolutionHours (null until something is resolved),
//   resolvedLast7Days, topLocations [{ building, count }] }
export function getStats() {
  return apiRequest('/stats')
}
