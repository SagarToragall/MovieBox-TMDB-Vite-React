import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
    >
      <div className="panel center">
        <div>
          <div className="emptyTitle">Page not found</div>
          <div className="emptyMessage">
            <Link className="link" to="/">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

