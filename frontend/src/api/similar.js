import { apiRequest, USE_MOCK_API } from './client'
import { MOCK_ISSUES } from '../data/mockData'
import { CATEGORIES } from '../lib/constants'

export async function getSimilarIssues({ title, location, category }) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 200))

    if (!title && !location) {
      return { success: true, data: { similar: [] } }
    }

    const titleWords = (title || '')
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)

    const matches = MOCK_ISSUES.filter((issue) => {
      // Location matching
      const locMatch = location && issue.location.toLowerCase().includes(location.toLowerCase().trim())

      // Title keyword overlap
      const titleMatch = titleWords.some((word) => issue.title.toLowerCase().includes(word))

      // Category match
      const catMatch = category && issue.category === category

      return (locMatch && titleMatch) || (titleMatch && catMatch)
    })

    return {
      success: true,
      data: {
        similar: matches.slice(0, 3),
      },
    }
  }

  if (!title || !location || !category) return { success: true, data: { similar: [] } }
  const apiCategory = CATEGORIES.find((item) => item.id === String(category).toLowerCase())?.label || category
  const query = new URLSearchParams({ title, building: location, category: apiCategory }).toString()
  return apiRequest(`/issues/similar?${query}`)
}
