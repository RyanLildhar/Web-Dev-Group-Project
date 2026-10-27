import {useState, useMemo} from 'react'

export function filterElements(elements, query) {
  const q = query.trim().toLowerCase()
  if (q === '') return elements

  // All digits match the atomic number
  if (/^\d+$/.test(q)) {
    return elements.filter((element) => element.number === Number(q))
  }

  // else match name or symbol
  return elements.filter(
    (element) =>
      element.name.toLowerCase().includes(q) || element.symbol.toLowerCase().includes(q)
  )
}

export function useElementFilters(elements) {
  const [query, setQuery] = useState('')

  const results = useMemo(
    () => filterElements(elements, query),
    [elements, query]
  )

  return {results, query, setQuery}
}