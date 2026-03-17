import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getPopularMovies, getTrendingMovies } from '../services/api.js'
import { MovieCard } from '../components/MovieCard.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { SkeletonCard } from '../components/SkeletonCard.jsx'
import { Pagination } from '../components/Pagination.jsx'

const tabs = [
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
]

export default function Home() {
  const [tab, setTab] = useState('trending')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const title = useMemo(() => {
    const t = tabs.find((x) => x.id === tab)
    return t ? t.label : 'Movies'
  }, [tab])

  useEffect(() => {
    const controller = new AbortController()
    let alive = true

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const payload =
          tab === 'popular'
            ? await getPopularMovies({ page, signal: controller.signal })
            : await getTrendingMovies({ page, signal: controller.signal })
        if (!alive) return
        setData(payload)
      } catch (e) {
        if (!alive) return
        if (e?.message && String(e.message).toLowerCase().includes('canceled')) return
        setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    }

    run()
    return () => {
      alive = false
      controller.abort()
    }
  }, [tab, page])

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
    >
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">{title} Movies</h1>
          <div className="pageSubtle">Fresh picks from TMDB</div>
        </div>
        <div className="chipRow" aria-label="Movie category">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chip ${tab === t.id ? 'chipActive' : ''}`.trim()}
              onClick={() => {
                setTab(t.id)
                setPage(1)
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {!import.meta.env.VITE_TMDB_API_KEY ? (
        <ErrorState
          title="TMDB API key missing"
          message="Create a .env file and set VITE_TMDB_API_KEY. See .env.example."
        />
      ) : error ? (
        <ErrorState
          title="Couldn’t load movies"
          message={error.message}
          onAction={() => setPage((p) => p)}
        />
      ) : (
        <>
          <div className="grid" aria-busy={loading ? 'true' : 'false'}>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              : (data?.results ?? []).map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>

          {!loading && data?.total_pages ? (
            <Pagination
              page={page}
              totalPages={data.total_pages}
              onPageChange={(next) => setPage(next)}
            />
          ) : null}
        </>
      )}
    </motion.section>
  )
}

