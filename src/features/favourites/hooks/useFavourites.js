import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'elementBohrd:favourites'

// Read saved favourites (array of atomic numbers). Falls back to [] if
// nothing is saved, the data is corrupt, or localStorage is blocked.
function loadFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(Number.isInteger) : []
  } catch {
    return []
  }
}

export default function useFavourites() {
  // lazy initializer: localStorage is only read once, on first render
  const [favourites, setFavourites] = useState(loadFavourites)

  // persist every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch {
      /* storage full / blocked: favourites still work for this session */
    }
  }, [favourites])

  // never mutates: always returns a new array
  const toggleFavourite = useCallback((number) => {
    setFavourites((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    )
  }, [])

  const isFavourite = useCallback((number) => favourites.includes(number), [favourites])

  return { favourites, isFavourite, toggleFavourite }
}