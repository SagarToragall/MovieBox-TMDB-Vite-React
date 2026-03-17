import { useEffect, useId, useRef, useState } from 'react'

export function SearchBar({
  placeholder = 'Search…',
  initialValue = '',
  onSubmit,
}) {
  const id = useId()
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const trimmed = value.trim()

  return (
    <form
      className="search"
      role="search"
      aria-label="Search movies"
      onSubmit={(e) => {
        e.preventDefault()
        if (!trimmed) return
        onSubmit?.(trimmed)
        inputRef.current?.blur()
      }}
    >
      <label className="srOnly" htmlFor={id}>
        Search movies
      </label>
      <div className="searchField">
        <span className="searchIcon" aria-hidden="true">
          ⌕
        </span>
        <input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="searchInput"
          autoComplete="off"
          inputMode="search"
        />
        {value ? (
          <button
            type="button"
            className="iconButton"
            aria-label="Clear search"
            onClick={() => {
              setValue('')
              inputRef.current?.focus()
            }}
          >
            ×
          </button>
        ) : null}
      </div>
    </form>
  )
}

