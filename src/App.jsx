import { useState, useEffect } from 'react'
import logo from './assets/atom-logo.png'
import './styles/styles.css'
import FavouriteButton from './features/favourites/components/FavouriteButton'
import FavouritesPage from './features/favourites/FavouritesPage'
import useFavourites from './features/favourites/hooks/useFavourites'
import Grid from './components/Grid'
import {useElementFilters} from './hooks/useElementFilters'
import CompareModal from './features/compare/CompareModal'
import ElementQuiz from './features/quiz/ElementQuiz'

export default function App() {
  // useState for track view, (null) state is no element selected 
  const [currentElement, setCurrentElement] = useState(null);
  // useState for the element arrays from JSON
  const [elements, setElements] = useState([]);
  // which page: 'home' or 'favourites'
  const [view, setView] = useState('home');
  const { favourites, isFavourite, toggleFavourite } = useFavourites();
  // search state and filtering (hook)
  const {results: visibleElements, query, setQuery} = useElementFilters(elements);

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


  const goTo = (e, nextView) => {
    e.preventDefault();
    setCurrentElement(null);
    setView(nextView);
  };

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
            <div className="detail-quiz-wrapper">
              <ElementQuiz elementKey={currentElement.number}/>
              </div>
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
              <section className="periodic-table">
              <Grid 
                elements={visibleElements} 
                cardActions={{ setCurrentElement: handleElementClick, isFavourite, toggleFavourite, isCompareMode, isSelectedForCompare}}
              />
            </section>
            </div>
            
            {elements.length > 0 && visibleElements.length === 0 && (
                <p role="status">No elements match "{query}".</p>
            )}
          </>
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