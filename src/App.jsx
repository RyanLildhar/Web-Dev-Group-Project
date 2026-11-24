// AI-assisted - see AI-USAGE.md #N
import { useState, useEffect } from 'react'
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
import logo from './assets/atom-logo.png'
import './styles/styles.css'
import FavouritesPage from './FavouritesPage'
import useFavourites from './hooks/useFavourites'
import Grid from './Grid'
import { useElementFilters } from './hooks/useElementFilters'
import CompareModal from './CompareModal'
import ElementDetail from './ElementDetail'

export default function App() {
  const navigate = useNavigate()
  // useState for the element arrays from JSON
  const [elements, setElements] = useState([])
  const { favourites, isFavourite, toggleFavourite } = useFavourites()
  // search state and filtering (hook)
  const { results: visibleElements, query, setQuery } = useElementFilters(elements)

  // compare state
  const [isCompareMode, setIsCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState([])

  const toggleCompareMode = () => {
    setIsCompareMode((prev) => !prev)
    setSelectedForCompare([])
  }

  const resetCompare = () => {
    setIsCompareMode(false)
    setSelectedForCompare([])
  }

  // normal click opens the element's own URL; in compare mode it selects it
  const handleElementClick = (element) => {
    if (!isCompareMode) {
      navigate(`/element/${element.number}`)
      return
    }

    setSelectedForCompare((prev) => {
      if (prev.some((item) => item.number === element.number)) {
        return prev.filter((item) => item.number !== element.number)
      }
      if (prev.length >= 2) return prev
      return [...prev, element]
    })
  }

  const isSelectedForCompare = (number) =>
    selectedForCompare.some((item) => item.number === number)

  useEffect(() => {
    fetch('/PeriodicTableJSON.json')
      .then((response) => response.json())
      .then((data) => { setElements(data.elements) })
      .catch((error) => console.error('Failed to load data:', error))
  }, [])

  const homePage = (
    <>
      <h1 style={{ textAlign: 'center' }}>Elements of the Periodic Table</h1>
      <div className="table-container">
        <div className="search-bar">
          <label htmlFor="search">Search Elements </label>
          <input
            id="search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="compare-tool">
          <button type="button" aria-pressed={isCompareMode} onClick={toggleCompareMode}>
            {isCompareMode ? 'Cancel Compare' : 'Compare'}
          </button>
          {isCompareMode && (
            <span className="compare-hint">
              Select {2 - selectedForCompare.length} element
              {2 - selectedForCompare.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <section className="periodic-table">
          <Grid
            elements={visibleElements}
            cardActions={{
              setCurrentElement: handleElementClick,
              isFavourite,
              toggleFavourite,
              isCompareMode,
              isSelectedForCompare,
            }}
          />
        </section>
      </div>

      {elements.length > 0 && visibleElements.length === 0 && (
        <p role="status">No elements match "{query}".</p>
      )}
    </>
  )

  return (
    <div className={isCompareMode ? 'compare-mode-active' : undefined}>
      <header className="site-header">
        <Link className="brand" to="/">
          <img src={logo} alt="" />
          Interactive Periodic Table
        </Link>
        <nav aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/favourites">Favourites ({favourites.length})</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={homePage} />
          <Route
            path="/element/:number"
            element={
              <ElementDetail
                elements={elements}
                isFavourite={isFavourite}
                onToggleFavourite={toggleFavourite}
              />
            }
          />
          <Route
            path="/favourites"
            element={
              <FavouritesPage
                elements={elements}
                favourites={favourites}
                onSelect={(element) => navigate(`/element/${element.number}`)}
                onToggleFavourite={toggleFavourite}
              />
            }
          />
          <Route
            path="*"
            element={
              <>
                <h1>Page not found</h1>
                <p><Link to="/">Back to the table</Link></p>
              </>
            }
          />
        </Routes>
      </main>

      {selectedForCompare.length === 2 && (
        <CompareModal elements={selectedForCompare} onClose={resetCompare} />
      )}
    </div>
  )
}