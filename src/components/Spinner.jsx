import { motion } from 'framer-motion'

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinnerWrap" role="status" aria-live="polite">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
      />
      <div className="spinnerLabel">{label}</div>
    </div>
  )
}

