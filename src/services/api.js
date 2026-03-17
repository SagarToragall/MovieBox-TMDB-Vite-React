import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const apiKey = import.meta.env.VITE_TMDB_API_KEY
if (!apiKey) {
  // Intentionally not throwing: we render a friendly UI error instead.
  // This keeps the dev server usable even before the user sets .env.
  console.warn(
    '[TMDB] Missing VITE_TMDB_API_KEY. Create a .env file (see .env.example).',
  )
}

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000,
  params: {
    api_key: apiKey,
    language: 'en-US',
  },
})

const cache = new Map()
const DEFAULT_TTL_MS = 60_000

function stableKey(url, params) {
  const entries = Object.entries(params ?? {}).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  )
  entries.sort(([a], [b]) => a.localeCompare(b))
  return `${url}?${entries.map(([k, v]) => `${k}=${String(v)}`).join('&')}`
}

async function cachedGet(url, { params, signal, ttlMs = DEFAULT_TTL_MS } = {}) {
  const key = stableKey(url, { ...client.defaults.params, ...params })
  const now = Date.now()
  const hit = cache.get(key)
  if (hit && hit.expiresAt > now) return hit.data

  const res = await client.get(url, { params, signal })
  cache.set(key, { data: res.data, expiresAt: now + ttlMs })
  return res.data
}

function normalizeError(err) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const apiMessage =
      err.response?.data?.status_message ||
      err.response?.data?.message ||
      err.message

    return {
      status,
      message: apiMessage || 'Something went wrong. Please try again.',
    }
  }

  return { status: undefined, message: 'Something went wrong. Please try again.' }
}

export function tmdbImageUrl(path, size = 'w500') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export async function getTrendingMovies({ page = 1, signal } = {}) {
  try {
    return await cachedGet('/trending/movie/week', { params: { page }, signal })
  } catch (err) {
    throw normalizeError(err)
  }
}

export async function getPopularMovies({ page = 1, signal } = {}) {
  try {
    return await cachedGet('/movie/popular', { params: { page }, signal })
  } catch (err) {
    throw normalizeError(err)
  }
}

export async function searchMovies({ query, page = 1, signal } = {}) {
  try {
    return await cachedGet('/search/movie', {
      params: { query, page, include_adult: false },
      signal,
      ttlMs: 15_000,
    })
  } catch (err) {
    throw normalizeError(err)
  }
}

export async function getMovieDetails({ id, signal } = {}) {
  try {
    return await cachedGet(`/movie/${id}`, {
      params: { append_to_response: 'videos,credits' },
      signal,
      ttlMs: 5 * 60_000,
    })
  } catch (err) {
    throw normalizeError(err)
  }
}

