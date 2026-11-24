import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useElementFilters,
  filterElements,
  applyFilters,
  sortElements,
  normalizeCategory,
  DEFAULT_SORT,
} from './useElementFilters'

// Small, realistic sample: mixed phases, periods, a null melt, and "unknown" categories
const elements = [
  { number: 1, name: 'Hydrogen', symbol: 'H', category: 'diatomic nonmetal', phase: 'Gas', period: 1, atomic_mass: 1.008, melt: 13.99 },
  { number: 2, name: 'Helium', symbol: 'He', category: 'noble gas', phase: 'Gas', period: 1, atomic_mass: 4.0026, melt: 0.95 },
  { number: 3, name: 'Lithium', symbol: 'Li', category: 'alkali metal', phase: 'Solid', period: 2, atomic_mass: 6.94, melt: 453.65 },
  { number: 80, name: 'Mercury', symbol: 'Hg', category: 'transition metal', phase: 'Liquid', period: 6, atomic_mass: 200.59, melt: 234.32 },
  { number: 109, name: 'Meitnerium', symbol: 'Mt', category: 'unknown, probably transition metal', phase: 'Solid', period: 7, atomic_mass: 278, melt: null },
  { number: 118, name: 'Oganesson', symbol: 'Og', category: 'unknown, predicted to be noble gas', phase: 'Solid', period: 7, atomic_mass: 294, melt: null },
]

const names = (list) => list.map((e) => e.name)

describe('filterElements (search)', () => {
  it('returns everything for an empty or whitespace query', () => {
    expect(filterElements(elements, '')).toHaveLength(elements.length)
    expect(filterElements(elements, '   ')).toHaveLength(elements.length)
  })

  it('matches by name, case-insensitively', () => {
    expect(names(filterElements(elements, 'hYdRo'))).toEqual(['Hydrogen'])
  })

  it('matches by symbol', () => {
    expect(names(filterElements(elements, 'hg'))).toEqual(['Mercury'])
  })

  it('treats an all-digit query as an exact atomic number', () => {
    // "1" must match only element 1, not 109 or 118
    expect(names(filterElements(elements, '1'))).toEqual(['Hydrogen'])
    expect(names(filterElements(elements, '80'))).toEqual(['Mercury'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterElements(elements, 'zzz')).toEqual([])
  })
})

describe('normalizeCategory', () => {
  it('groups every "unknown..." category into "unknown"', () => {
    expect(normalizeCategory('unknown, probably transition metal')).toBe('unknown')
    expect(normalizeCategory('unknown, predicted to be noble gas')).toBe('unknown')
  })

  it('leaves normal categories unchanged', () => {
    expect(normalizeCategory('noble gas')).toBe('noble gas')
  })
})

describe('applyFilters (category, phase, period)', () => {
  it('filters by category', () => {
    expect(names(applyFilters(elements, { category: 'noble gas' }))).toEqual(['Helium'])
  })

  it('filters the grouped "unknown" category', () => {
    expect(names(applyFilters(elements, { category: 'unknown' }))).toEqual(['Meitnerium', 'Oganesson'])
  })

  it('filters by phase', () => {
    expect(names(applyFilters(elements, { phase: 'Liquid' }))).toEqual(['Mercury'])
  })

  it('filters by period, accepting the string value a <select> gives', () => {
    expect(names(applyFilters(elements, { period: '1' }))).toEqual(['Hydrogen', 'Helium'])
  })

  it('combines search with filters', () => {
    const result = applyFilters(elements, { query: 'm', phase: 'Solid' })
    expect(names(result)).toEqual(['Lithium', 'Meitnerium'])
  })

  it('returns everything when no filters are set', () => {
    expect(applyFilters(elements)).toHaveLength(elements.length)
  })
})

describe('sortElements', () => {
  it('sorts by atomic number ascending by default', () => {
    expect(sortElements(elements).map((e) => e.number)).toEqual([1, 2, 3, 80, 109, 118])
  })

  it('sorts descending', () => {
    expect(sortElements(elements, 'number', 'desc').map((e) => e.number)).toEqual([118, 109, 80, 3, 2, 1])
  })

  it('sorts text keys alphabetically', () => {
    expect(names(sortElements(elements, 'name', 'asc'))).toEqual([
      'Helium', 'Hydrogen', 'Lithium', 'Meitnerium', 'Mercury', 'Oganesson',
    ])
  })

  it('sorts numeric keys by value, not as text', () => {
    // 200.59 must come after 6.94 (string sort would put "200.59" first)
    expect(sortElements(elements, 'atomic_mass', 'asc').map((e) => e.number)).toEqual([1, 2, 3, 80, 109, 118])
  })

  it('puts elements with missing values last, in both directions', () => {
    const asc = sortElements(elements, 'melt', 'asc').map((e) => e.number)
    const desc = sortElements(elements, 'melt', 'desc').map((e) => e.number)
    expect(asc.slice(-2)).toEqual([109, 118])
    expect(desc.slice(-2)).toEqual([109, 118])
  })

  it('does not mutate the original array', () => {
    const copy = [...elements]
    sortElements(elements, 'name', 'desc')
    expect(elements).toEqual(copy)
  })
})

describe('useElementFilters hook', () => {
  it('starts with all elements and default sort', () => {
    const { result } = renderHook(() => useElementFilters(elements))
    expect(result.current.results).toHaveLength(elements.length)
    expect(result.current.sortKey).toBe(DEFAULT_SORT)
    expect(result.current.isFiltering).toBe(false)
  })

  it('narrows results when the query changes', () => {
    const { result } = renderHook(() => useElementFilters(elements))
    act(() => result.current.setQuery('lith'))
    expect(names(result.current.results)).toEqual(['Lithium'])
    expect(result.current.isFiltering).toBe(true)
  })

  it('applies category, phase and sort together', () => {
    const { result } = renderHook(() => useElementFilters(elements))
    act(() => {
      result.current.setPhase('Solid')
      result.current.setSortKey('name')
      result.current.setSortDirection('desc')
    })
    expect(names(result.current.results)).toEqual(['Oganesson', 'Meitnerium', 'Lithium'])
  })

  it('builds dropdown options from the data, with "unknown" grouped', () => {
    const { result } = renderHook(() => useElementFilters(elements))
    expect(result.current.options.categories).toContain('unknown')
    expect(result.current.options.categories).not.toContain('unknown, probably transition metal')
    expect(result.current.options.phases).toEqual(['Gas', 'Liquid', 'Solid'])
    expect(result.current.options.periods).toEqual([1, 2, 6, 7])
  })

  it('reset() clears filters and restores the default sort', () => {
    const { result } = renderHook(() => useElementFilters(elements))
    act(() => {
      result.current.setQuery('he')
      result.current.setCategory('noble gas')
      result.current.setSortKey('name')
      result.current.setSortDirection('desc')
    })
    act(() => result.current.reset())
    expect(result.current.results).toHaveLength(elements.length)
    expect(result.current.sortKey).toBe(DEFAULT_SORT)
    expect(result.current.sortDirection).toBe('asc')
    expect(result.current.isFiltering).toBe(false)
  })
})