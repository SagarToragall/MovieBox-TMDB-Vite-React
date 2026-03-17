export function Pagination({ page, totalPages, onPageChange }) {
  const clampedTotal = Math.min(totalPages || 1, 500) // TMDB caps at 500
  const canPrev = page > 1
  const canNext = page < clampedTotal

  return (
    <div className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="chip"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <div className="pageIndicator">
        Page <strong>{page}</strong> / {clampedTotal}
      </div>
      <button
        type="button"
        className="chip"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  )
}

