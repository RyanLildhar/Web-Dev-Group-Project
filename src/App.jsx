import { useState, useEffect } from 'react'
import logo from './assets/atom-logo.png'
import './styles/styles.css'
import Card from './Card'
import FavouriteButton from './FavouriteButton'
import FavouritesPage from './FavouritesPage'
import useFavourites from './hooks/useFavourites'

export default function App() {
  // useState for track view, (null) state is no element selected 
  const [currentElement, setCurrentElement] = useState(null);
  // useState for the element arrays from JSON
  const [elements, setElements] = useState([]);
  // which page: 'home' or 'favourites'
  const [view, setView] = useState('home');
  const { favourites, isFavourite, toggleFavourite } = useFavourites();

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
            <h1>Elements of the Periodic Table</h1>
            <section className="grid">
              {elements.map((element) => (
                <Card
                  key={element.number}
                  element={element}
                  onClick={() => setCurrentElement(element)}
                  isFavourite={isFavourite(element.number)}
                  onToggleFavourite={toggleFavourite}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  )
}