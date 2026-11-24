import {useState, useMemo} from 'react'
export const SORT_OPTIONS = [
  {value: 'number', label: 'Atomic number'},
  {value: 'name', label: 'Name'},
  {value: 'atomic_mass', label: 'Atomic mass'},
  {value: 'melt', label: 'Melting point'},
  {value: 'boil', label: 'Boiling point'},
]

export const DEFAULT_SORT = 'number'

// The data has several "unknown, probably ..." categories; group them as one.
export function normalizeCategory(category) {
  return category.startsWith('unknown') ? 'unknown' : category
}

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

// category, phase and period
export function applyFilters(elements, {query = '', category = '', phase = '', period = ''} = {}) {
  return filterElements(elements, query).filter(
    (element) =>
      (category === '' || normalizeCategory(element.category) === category) &&
      (phase === '' || element.phase === phase) &&
      (period === '' || element.period === Number(period))
  )
}

// returns new array
// null elements last
export function sortElements(elements, key = DEFAULT_SORT, direction = 'asc') {
  const sign = direction === 'desc' ? -1 : 1
  return [...elements].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av == null && bv == null) return a.number - b.number
    if (av == null) return 1
    if (bv == null) return -1
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
    return cmp !== 0 ? sign * cmp : a.number - b.number
  })
}

export function useElementFilters(elements) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [phase, setPhase] = useState('')
  const [period, setPeriod] = useState('')
  const [sortKey, setSortKey] = useState(DEFAULT_SORT)
  const [sortDirection, setSortDirection] = useState('asc')
  const options = useMemo(() => {
  const unique = (values) => [...new Set(values)]
  return {
    categories: unique(elements.map((e) => normalizeCategory(e.category))).sort(),
    phases: unique(elements.map((e) => e.phase)).sort(),
    periods: unique(elements.map((e) => e.period)).sort((a, b) => a - b),
      }
    },
    [elements]
    )

    const results = useMemo(
      () => sortElements(
        applyFilters(elements, {query, category, phase, period}),
        sortKey,
        sortDirection
      ),
      [elements, query, category, phase, period, sortKey, sortDirection]
    )

    const isFiltering = query.trim() !== '' || category !== '' || phase !== '' || period !== ''

    const reset = () => {
      setQuery('')
      setCategory('')
      setPhase('')
      setPeriod('')
      setSortKey(DEFAULT_SORT)
      setSortDirection('asc')
    }

    return {
      results, options, isFiltering, reset,
      query, setQuery,
      category, setCategory,
      phase, setPhase,
      period, setPeriod,
      sortKey, setSortKey,
      sortDirection, setSortDirection,
    }
  }