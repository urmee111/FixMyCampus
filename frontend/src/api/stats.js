import { apiRequest, USE_MOCK_API } from './client'
import { MOCK_STATS } from '../data/mockData'

const normalizeStats = (stats = {}) => {
  const totalIssues = Number(stats.totalIssues ?? stats.total ?? 0)
  const statusCounts = stats.byStatus || {}
  const openIssues = Number(stats.openIssues ?? statusCounts.Open ?? 0)
  const inProgressIssues = Number(stats.inProgressIssues ?? statusCounts['In Progress'] ?? 0)
  const resolvedIssues = Number(stats.resolvedIssues ?? statusCounts.Resolved ?? 0)
  const categoryEntries = Array.isArray(stats.byCategory)
    ? stats.byCategory
    : Object.entries(stats.byCategory || {}).map(([category, count]) => ({ category, count }))

  return {
    ...stats,
    totalIssues,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    resolutionRate: Number(stats.resolutionRate ?? (totalIssues ? (resolvedIssues / totalIssues) * 100 : 0)),
    avgResolutionHours: stats.avgResolutionHours ?? null,
    byCategory: categoryEntries.map((item) => {
      const count = Number(item.count || 0)
      const label = item.label || item.category
      return {
        ...item,
        label,
        count,
        percentage: Number(item.percentage ?? (totalIssues ? Math.round((count / totalIssues) * 100) : 0)),
      }
    }),
    hotspots: stats.hotspots || stats.topLocations || [],
  }
}

export async function getStats() {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 240))
    return {
      success: true,
      data: normalizeStats(MOCK_STATS),
    }
  }

  const response = await apiRequest('/stats')
  return { ...response, data: normalizeStats(response.data) }
}
