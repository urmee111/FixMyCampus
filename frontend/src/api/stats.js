// Admin statistics endpoint. Returns response.data.data.

import api from './client';

// GET /stats  ->  { total, byStatus, byCategory, topUpvoted, avgResolutionHours, resolvedLast7Days, topLocations }
export async function getStats() {
  const response = await api.get('/stats');
  return response.data.data;
}
