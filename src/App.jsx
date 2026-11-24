// AI-assisted - see AI-USAGE.md #3
import { useState, useEffect } from 'react'
import { Link, NavLink, Routes, Route, useLocation } from 'react-router-dom'
import logo from './assets/atom-logo.png'
import './styles/styles.css'
import Card from './components/Card'
import FavouriteButton from './features/favourites/components/FavouriteButton'
import FavouritesPage from './features/favourites/FavouritesPage'
import useFavourites from './features/favourites/hooks/useFavourites'
import Grid from './components/Grid'
import {useElementFilters, SORT_OPTIONS, DEFAULT_SORT} from './hooks/useElementFilters'
import CompareModal from './features/compare/CompareModal'
import ElementQuiz from './features/quiz/ElementQuiz'

export default function App() {
  // useState for track view, (null) state is no element selected 
  const [currentElement, setCurrentElement] = useState(null);
  // useState for the element arrays from JSON
  const [elements, setElements] = useState([]);
  const { favourites, isFavourite, toggleFavourite } = useFavourites();
  // the URL decides which page we are on (/ or /favourites)
  const location = useLocation();
  const onFavourites = location.pathname === '/favourites';
  // search state and filtering (hook)
  const {results: visibleElements, query, setQuery, options,
          reset, category, setCategory, phase, setPhase, period,
          setPeriod, sortKey, setSortKey, sortDirection,setSortDirection,
         }= useElementFilters(elements);
  const isSorted = sortKey !== DEFAULT_SORT || sortDirection !== 'asc';

  // compare state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  const toggleCompareMode = () => {
    setIsCompareMode((prev) => !prev);
    setSelectedForCompare([]);
  };

  const resetCompare = () => {
    setIsCompareMode(false);
    setSelectedForCompare([]);
  };

  const handleElementClick = (element) => {
    if (!isCompareMode) {
      setCurrentElement(element);
      return;
    }

    setSelectedForCompare((prev) => {
      if (prev.some((item) => item.number === element.number)) {
        return prev.filter((item) => item.number !== element.number);
      }
      if (prev.length >= 2) return prev;
      return [...prev, element];
    });
  };

  const isSelectedForCompare = (number) =>
    selectedForCompare.some((item) => item.number === number);

  // fetch elements from JSON file
  useEffect(() => {
    fetch('/PeriodicTableJSON.json')
      .then((response) => response.json())
      .then((data) => {setElements(data.elements);})
      .catch((error) => console.error('Failed to load data:', error));
  }, []);

  return (
    <div className={isCompareMode ? 'compare-mode-active' : undefined}>
      <header className="site-header">
        <Link className="brand" to="/" onClick={() => setCurrentElement(null)}>
          <img src={logo} alt="free atom clipart logo" />
          Interactive Periodic Table
        </Link>
        <nav>
          <NavLink to="/" end onClick={() => setCurrentElement(null)}>Home</NavLink>
          <NavLink to="/favourites" onClick={() => setCurrentElement(null)}>
            Favourites ({favourites.length})
          </NavLink>
        </nav>
      </header>

      <main>
        {/* detail page managed with useState (? conditional) */}
        {currentElement ? (
          <article className='detail-view'>
            <h1>{currentElement.name}</h1>
            <p>Atomic Number: {currentElement.number}</p>
            <p>Atomic Mass: {currentElement.atomic_mass}</p>
            <p>Melting point: {currentElement.melt} k</p>
            <p>Boiling point: {currentElement.boil} k</p>
            <p>Category: {currentElement.category}</p>
            <p>Summary: {currentElement.summary}</p>
            <FavouriteButton
              element={currentElement}
              isFavourite={isFavourite(currentElement.number)}
              onToggle={toggleFavourite}
            />
            <div className="detail-quiz-wrapper">
              <ElementQuiz elementKey={currentElement.number}/>
            </div>
            <a href="#" className='detail-back-link' onClick={(e) => { e.preventDefault(); setCurrentElement(null); }}>
              {onFavourites ? 'Back to Favourites' : 'Return Home'}
            </a>
          </article>
        ) : (
          <Routes>
            <Route
              path="/favourites"
              element={
                <FavouritesPage
                  elements={elements}
                  favourites={favourites}
                  onSelect={setCurrentElement}
                  onToggleFavourite={toggleFavourite}
                />
              }
            />
            <Route
              path="*"
              element={
                <>
                  <h1 style={{ textAlign: 'center' }}>Elements of the Periodic Table</h1>
                  <div className='table-container'>
                    <div className='search-bar'>
                      <label htmlFor="search">Search Elements </label>
                      <input
                        id="search"
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    </div>
                    <div className="filter-bar">
                      <label>
                        Category
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                          <option value="">Any</option>
                          {options.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </label>

                      <label>
                        Phase
                        <select value={phase} onChange={(e) => setPhase(e.target.value)}>
                          <option value="">Any</option>
                          {options.phases.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </label>

                      <label>
                        Period
                        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                          <option value="">Any</option>
                          {options.periods.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </label>

                      <label>
                        Sort by
                        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </label>

                      <label>
                        Order
                        <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </select>
                      </label>

                      <button type="button" onClick={reset}>Clear filters</button>
                    </div>

                    <div className='compare-tool'>
                      <button
                        type='button'
                        aria-pressed={isCompareMode}
                        onClick={toggleCompareMode}
                      >
                        {isCompareMode ? 'Cancel Compare' : 'Compare'}
                      </button>
                      {isCompareMode && (
                        <span className='compare-hint'>
                          Select {2 - selectedForCompare.length} element
                          {2 - selectedForCompare.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>

                    {isSorted ? (
                      <section className="grid">
                        {visibleElements.map((element) => (
                          <Card
                            key={element.number}
                            element={element}
                            onClick={() => handleElementClick(element)}
                            isFavourite={isFavourite(element.number)}
                            onToggleFavourite={toggleFavourite}
                            isCompareMode={isCompareMode}
                            isSelected={isSelectedForCompare(element.number)}
                          />
                        ))}
                      </section>
                    ) : (
                      <section className="periodic-table">
                        <Grid
                          elements={visibleElements}
                          cardActions={{ setCurrentElement: handleElementClick, isFavourite, toggleFavourite, isCompareMode, isSelectedForCompare}}
                        />
                      </section>
                    )}
                  </div>

                  {elements.length > 0 && visibleElements.length === 0 && (
                    <div role="status" className="no-results">
                      <p>
                        No elements match
                        {query.trim() !== '' ? ` "${query.trim()}"` : ' these filters'}.
                      </p>
                      <button type="button" onClick={reset}>Clear filters</button>
                    </div>
                  )}
                </>
              }
            />
          </Routes>
        )}
      </main>
      {selectedForCompare.length === 2 && (
        <CompareModal
          elements={selectedForCompare}
          onClose={resetCompare}
        />
      )}
    </div>
  )
}