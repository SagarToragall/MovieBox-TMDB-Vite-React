import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { getMovieDetails, tmdbImageUrl } from '../services/api.js'
import { Spinner } from '../components/Spinner.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { useFavorites } from '../state/FavoritesContext.jsx'

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    const controller = new AbortController()
    let alive = true

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const payload = await getMovieDetails({ id, signal: controller.signal })
        if (!alive) return
        setMovie(payload)
      } catch (e) {
        if (!alive) return
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
  }, [id])

  const fav = movie?.id ? isFavorite(movie.id) : false

  const trailer = useMemo(() => {
    const vids = movie?.videos?.results ?? []
    const best =
      vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
      vids.find((v) => v.site === 'YouTube' && v.type === 'Teaser')
    return best ? `https://www.youtube.com/watch?v=${best.key}` : null
  }, [movie])

  if (!import.meta.env.VITE_TMDB_API_KEY) {
    return (
      <ErrorState
        title="TMDB API key missing"
        message="Create a .env file and set VITE_TMDB_API_KEY. See .env.example."
      />
    )
  }

  if (loading) {
    return (
      <div className="panel center">
        <Spinner label="Loading details…" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn’t load details"
        message={error.message}
        onAction={() => setLoading((v) => v)}
      />
    )
  }

  if (!movie) {
    return (
      <div className="panel center">
        <div>
          <div className="emptyTitle">Movie not found</div>
          <div className="emptyMessage">
            <Link className="link" to="/">
              Go back home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const poster =
    tmdbImageUrl(movie.poster_path, 'w780') ||
    'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="780"><rect width="100%" height="100%" fill="#141722"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9aa4b2" font-family="Arial" font-size="18">No poster</text></svg>`,
      )

  const backdrop = tmdbImageUrl(movie.backdrop_path, 'w1280')

  return (
    <motion.section
      className="details"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
    >
      <div className="detailsHero panel">
        {backdrop ? (
          <div
            className="detailsBackdrop"
            style={{ backgroundImage: `url(${backdrop})` }}
            aria-hidden="true"
          />
        ) : null}

        <div className="detailsContent">
          <div className="detailsPosterWrap">
            <img className="detailsPoster" src={poster} alt={movie.title} />
          </div>

          <div className="detailsInfo">
            <div className="detailsTop">
              <div>
                <h1 className="detailsTitle">{movie.title}</h1>
                <div className="detailsMeta">
                  <span>★ {Number(movie.vote_average || 0).toFixed(1)}</span>
                  <span className="dot">•</span>
                  <span>{formatDate(movie.release_date)}</span>
                  {movie.runtime ? (
                    <>
                      <span className="dot">•</span>
                      <span>{movie.runtime} min</span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="detailsActions">
                <button
                  type="button"
                  className={`primaryButton ${fav ? 'primaryButtonAlt' : ''}`.trim()}
                  onClick={() => toggleFavorite(movie)}
                >
                  {fav ? 'Saved ♥' : 'Add to Favorites'}
                </button>
                {trailer ? (
                  <a
                    className="secondaryButton"
                    href={trailer}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch Trailer
                  </a>
                ) : null}
              </div>
            </div>

            <p className="detailsOverview">{movie.overview || 'No overview.'}</p>

            {movie.genres?.length ? (
              <div className="chipRow" aria-label="Genres">
                {movie.genres.map((g) => (
                  <span key={g.id} className="chip chipStatic">
                    {g.name}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="detailsFooter">
              <Link className="link" to="/">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

