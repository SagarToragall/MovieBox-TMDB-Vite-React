import { motion } from 'framer-motion'

export function SkeletonCard() {
  return (
    <div className="card skeletonCard" aria-hidden="true">
      <div className="cardPoster skeletonPoster">
        <motion.div
          className="skeletonShine"
          animate={{ x: ['-30%', '130%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="cardBody">
        <div className="skeletonLine" style={{ width: '80%' }} />
        <div className="skeletonLine" style={{ width: '45%', marginTop: 10 }} />
      </div>
    </div>
  )
}

