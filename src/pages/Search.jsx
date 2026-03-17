import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { searchMovies } from '../services/api.js'
import { MovieCard } from '../components/MovieCard.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { SkeletonCard } from '../components/SkeletonCard.jsx'
import { Pagination } from '../components/Pagination.jsx'
import { SearchBar } from '../components/SearchBar.jsx'

export default function Search() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const query = (params.get('q') || '').trim()
  const page = Math.max(1, Number(params.get('page') || '1') || 1)

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const title = useMemo(() => (query ? `Results for “${query}”` : 'Search'), [query])

  useEffect(() => {
    if (!query) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    let alive = true
    const t = window.setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const payload = await searchMovies({
          query,
          page,
          signal: controller.signal,
        })
        if (!alive) return
        setData(payload)
      } catch (e) {
        if (!alive) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    }, 350)

    return () => {
      alive = false
      window.clearTimeout(t)
      controller.abort()
    }
  }, [query, page])

  const goTo = (q, p = 1) => {
    const next = new URLSearchParams()
    if (q) next.set('q', q)
    if (p > 1) next.set('page', String(p))
    navigate(`/search?${next.toString()}`)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
    >
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">{title}</h1>
          <div className="pageSubtle">Search the TMDB catalog</div>
        </div>
      </div>

      <div className="panel searchPanel">
        <SearchBar initialValue={query} onSubmit={(q) => goTo(q, 1)} />
      </div>

      {!import.meta.env.VITE_TMDB_API_KEY ? (
        <ErrorState
          title="TMDB API key missing"
          message="Create a .env file and set VITE_TMDB_API_KEY. See .env.example."
        />
      ) : error ? (
        <ErrorState
          title="Search failed"
          message={error.message}
          onAction={() => goTo(query, page)}
        />
      ) : !query ? (
        <div className="panel center">
          <div>
            <div className="emptyTitle">Search for a movie</div>
            <div className="emptyMessage">
              Try “Dune”, “Inception”, or “Interstellar”.
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid" aria-busy={loading ? 'true' : 'false'}>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              : (data?.results ?? []).map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>

          {!loading && (data?.results?.length ?? 0) === 0 ? (
            <div className="panel center">
              <div>
                <div className="emptyTitle">No results</div>
                <div className="emptyMessage">Try a different keyword.</div>
              </div>
            </div>
          ) : null}

          {!loading && data?.total_pages ? (
            <Pagination
              page={page}
              totalPages={data.total_pages}
              onPageChange={(next) => goTo(query, next)}
            />
          ) : null}
        </>
      )}
    </motion.section>
  )
}

