import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tmdbImageUrl } from '../services/api.js'
import { useFavorites } from '../state/FavoritesContext.jsx'

function formatRating(voteAverage) {
  if (voteAverage === null || voteAverage === undefined) return '—'
  return Number(voteAverage).toFixed(1)
}

export function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(movie.id)
  const posterUrl =
    tmdbImageUrl(movie.poster_path, 'w500') ||
    'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="100%" height="100%" fill="#141722"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9aa4b2" font-family="Arial" font-size="18">No poster</text></svg>`,
      )

  return (
    <motion.article
      className="card"
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 520, damping: 34 }}
    >
      <div className="cardPoster">
        <Link to={`/movie/${movie.id}`} aria-label={`Open ${movie.title}`}>
          <img
            src={posterUrl}
            alt={movie.title || 'Movie poster'}
            loading="lazy"
            className="cardImg"
          />
        </Link>

        <button
          type="button"
          className={`favButton ${fav ? 'favActive' : ''}`.trim()}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => toggleFavorite(movie)}
        >
          {fav ? '♥' : '♡'}
        </button>

        <div className="ratingPill" aria-label={`Rating ${formatRating(movie.vote_average)}`}>
          ★ {formatRating(movie.vote_average)}
        </div>
      </div>

      <div className="cardBody">
        <h3 className="cardTitle" title={movie.title}>
          {movie.title}
        </h3>
        <p className="cardMeta">
          {(movie.release_date || '').slice(0, 4) || '—'}
        </p>
      </div>
    </motion.article>
  )
}

