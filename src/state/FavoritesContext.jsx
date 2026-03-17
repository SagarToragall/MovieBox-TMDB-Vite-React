import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'movieapp:favorites:v1'

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json)
    return v ?? fallback
  } catch {
    return fallback
  }
}

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favoritesById, setFavoritesById] = useState(() => {
    if (typeof window === 'undefined') return {}
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return safeParse(raw, {})
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesById))
  }, [favoritesById])

  const value = useMemo(() => {
    const favorites = Object.values(favoritesById)
    const isFavorite = (id) => Boolean(favoritesById[String(id)])

    const addFavorite = (movie) => {
      if (!movie?.id) return
      const minimal = {
        id: movie.id,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path ?? null,
        vote_average: movie.vote_average ?? null,
        release_date: movie.release_date ?? null,
      }
      setFavoritesById((prev) => ({ ...prev, [String(movie.id)]: minimal }))
    }

    const removeFavorite = (id) => {
      setFavoritesById((prev) => {
        const next = { ...prev }
        delete next[String(id)]
        return next
      })
    }

    const toggleFavorite = (movie) => {
      if (!movie?.id) return
      setFavoritesById((prev) => {
        const key = String(movie.id)
        if (prev[key]) {
          const next = { ...prev }
          delete next[key]
          return next
        }

        const minimal = {
          id: movie.id,
          title: movie.title || movie.name || 'Untitled',
          poster_path: movie.poster_path ?? null,
          vote_average: movie.vote_average ?? null,
          release_date: movie.release_date ?? null,
        }
        return { ...prev, [key]: minimal }
      })
    }

    return {
      favoritesById,
      favorites,
      favoritesCount: favorites.length,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites: () => setFavoritesById({}),
    }
  }, [favoritesById])

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

