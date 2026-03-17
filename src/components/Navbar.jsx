import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SearchBar } from './SearchBar.jsx'
import { useFavorites } from '../state/FavoritesContext.jsx'

function NavItem({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `navLink ${isActive ? 'navLinkActive' : ''}`.trim()
      }
    >
      {children}
    </NavLink>
  )
}

export function Navbar() {
  const navigate = useNavigate()
  const { favoritesCount } = useFavorites()

  return (
    <header className="navWrap">
      <div className="container">
        <motion.div
          className="nav"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="navLeft">
            <Link to="/" className="brand" aria-label="Go to home">
              <span className="brandMark" />
              <span className="brandText">MovieBox</span>
            </Link>

            <nav className="navLinks" aria-label="Primary navigation">
              <NavItem to="/" end>
                Home
              </NavItem>
              <NavItem to="/favorites">
                Favorites
                {favoritesCount > 0 ? (
                  <span className="badge" aria-label={`${favoritesCount} favorites`}>
                    {favoritesCount}
                  </span>
                ) : null}
              </NavItem>
            </nav>
          </div>

          <div className="navRight">
            <SearchBar
              placeholder="Search movies…"
              onSubmit={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
            />
          </div>
        </motion.div>
      </div>
    </header>
  )
}

