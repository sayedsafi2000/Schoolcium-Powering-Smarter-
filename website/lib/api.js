import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// ─── Notices ──────────────────────────────────────────────────────────────────
export async function getPublicNotices({ category, search, limit = 20, page = 1 } = {}) {
  const params = { limit, page }
  if (category && category !== 'All') params.category = category
  if (search) params.search = search
  const res = await api.get('/notices/public', { params })
  return res.data // { notices, total, page, limit }
}

export async function getPublicNoticeBySlug(slug) {
  const res = await api.get(`/notices/public/${slug}`)
  return res.data
}

// ─── Teachers ─────────────────────────────────────────────────────────────────
// Note: teachers route requires auth in the admin panel.
// For the public website we'll use mock data if the public endpoint isn't available.
export async function getPublicTeachers() {
  try {
    // Attempt a public-friendly fetch (no auth required for listing active teachers)
    const res = await api.get('/teachers/public')
    return res.data
  } catch {
    return [] // fallback to empty, page uses mock data
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function getSchoolSettings() {
  try {
    const res = await api.get('/settings/public')
    return res.data
  } catch {
    return null
  }
}

// ─── Banners ──────────────────────────────────────────────────────────────────
export async function getActiveBanners(position = 'homepage') {
  try {
    const res = await api.get('/banners/active', { params: { position } })
    return res.data
  } catch {
    return []
  }
}
