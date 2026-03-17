import { motion } from 'framer-motion'
import { MovieCard } from '../components/MovieCard.jsx'
import { useFavorites } from '../state/FavoritesContext.jsx'

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites()

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
    >
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Your Favorites</h1>
          <div className="pageSubtle">Saved locally on this device</div>
        </div>
        {favorites.length ? (
          <button type="button" className="chip" onClick={clearFavorites}>
            Clear all
          </button>
        ) : null}
      </div>

      {favorites.length ? (
        <div className="grid">
          {favorites.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      ) : (
        <div className="panel center">
          <div>
            <div className="emptyTitle">No favorites yet</div>
            <div className="emptyMessage">
              Tap the heart on a movie to save it here.
            </div>
          </div>
        </div>
      )}
    </motion.section>
  )
}

