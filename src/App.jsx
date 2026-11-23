import { useState, useEffect } from 'react'
import logo from './assets/atom-logo.png'
import './styles/styles.css'
import Card from './Card'
import FavouriteButton from './FavouriteButton'
import FavouritesPage from './FavouritesPage'
import useFavourites from './hooks/useFavourites'
import Grid from './Grid'
import {useElementFilters,SORT_OPTIONS,DEFAULT_SORT} from './hooks/useElementFilters'

export default function App() {
  // useState for track view, (null) state is no element selected 
  const [currentElement, setCurrentElement] = useState(null);
  // useState for the element arrays from JSON
  const [elements, setElements] = useState([]);
  // which page: 'home' or 'favourites'
  const [view, setView] = useState('home');
  const { favourites, isFavourite, toggleFavourite } = useFavourites();
  // search state and filtering (hook)
  const {results: visibleElements, query, setQuery, options,
          reset, category, setCategory, phase, setPhase, period,
          setPeriod, sortKey, setSortKey, sortDirection,setSortDirection,
         }= useElementFilters(elements);
  const isSorted = sortKey !== DEFAULT_SORT || sortDirection !== 'asc';

  const goTo = (e, nextView) => {
    e.preventDefault();
    setCurrentElement(null);
    setView(nextView);
  };

  useEffect(() => {
    fetch('/PeriodicTableJSON.json')
      .then((response) => response.json())
      .then((data) => {setElements(data.elements);})
      .catch((error) => console.error('Failed to load data:', error));
  }, []);

  return (
    <div>
      <header className="site-header">
        <a className="brand" href="#" onClick={(e) => goTo(e, 'home')}>
          <img src={logo} alt="free atom clipart logo" />
          Interactive Periodic Table
        </a>
        <nav>
          <a href="#" onClick={(e) => goTo(e, 'home')} aria-current={view === 'home' && !currentElement ? 'page' : undefined}>Home</a>
          <a href="#" onClick={(e) => goTo(e, 'favourites')} aria-current={view === 'favourites' && !currentElement ? 'page' : undefined}>Favourites ({favourites.length})</a>
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
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentElement(null); }}>
              {view === 'favourites' ? 'Back to Favourites' : 'Return Home'}
            </a></p>
          </article>
        ) : view === 'favourites' ? (
          <FavouritesPage
            elements={elements}
            favourites={favourites}
            onSelect={setCurrentElement}
            onToggleFavourite={toggleFavourite}
          />
        ) : (
          /* grid view (home/null)  */
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
              {isSorted ? (
                <section className="grid">
                  {visibleElements.map((element) => (
                    <Card
                      key={element.number}
                      element={element}
                      onClick={() => setCurrentElement(element)}
                      isFavourite={isFavourite(element.number)}
                      onToggleFavourite={toggleFavourite}
                    />
                  ))}
                </section>
              ) : (
              <section className="periodic-table">
              <Grid 
                elements={visibleElements} 
                cardActions={{ setCurrentElement, isFavourite, toggleFavourite}}
              />
            </section>
            )}
            </div>
          
            {/* <section className="grid">
              {visibleElements.map((element) => (
                <Card
                  key={element.number}
                  element={element}
                  onClick={() => setCurrentElement(element)}
                  isFavourite={isFavourite(element.number)}
                  onToggleFavourite={toggleFavourite}
                />
              ))}
            </section> */}
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
        )}
      </main>
    </div>
  )
}