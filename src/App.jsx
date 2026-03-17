import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppLayout } from './components/AppLayout.jsx'
import { Spinner } from './components/Spinner.jsx'

const HomePage = lazy(() => import('./pages/Home.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const MovieDetailsPage = lazy(() => import('./pages/MovieDetails.jsx'))
const FavoritesPage = lazy(() => import('./pages/Favorites.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFound.jsx'))

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <div className="app">
      <div className="topGlow" />
      <Suspense
        fallback={
          <div className="main">
            <div className="container">
              <div className="panel center">
                <Spinner label="Loading page…" />
              </div>
            </div>
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </div>
  )
}
