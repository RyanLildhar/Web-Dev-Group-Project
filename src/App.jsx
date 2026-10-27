import { useState, useEffect } from 'react'
import logo from './assets/atom-logo.png'
import './styles/styles.css'
import Card from './Card'

export default function App() {
  // useState for track view, (null) state is no element selected 
  const [currentElement, setCurrentElement] = useState(null);
  // useState for the element arrays from JSON
  const [elements, setElements] = useState([]);
  // useState for search
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/PeriodicTableJSON.json')
      .then((response) => response.json())
      .then((data) => {setElements(data.elements);})
      .catch((error) => console.error('Failed to load data:', error));
  }, []);

  return (
    <div>
      <header className="site-header">
        <a className="brand" href="#" onClick={() => setCurrentElement(null)}>
          <img src={logo} alt="free atom clipart logo" />
          Interactive Periodic Table
        </a>
        <nav>
          <a href="#" onClick={() => setCurrentElement(null)}>Home</a>
        </nav>
      </header>

      <main>
        {/* detail page managed with useState (? conditional) */}
        {currentElement ? (
          <article className='detail-view'>
            <h1>{currentElement.name}</h1>
            <p>Atomic Number: {currentElement.number}</p>
            <p>Atomic Mass: {currentElement.atomic_mass}</p>
            <p>Category: {currentElement.category}</p>
            <p>Summary: {currentElement.summary}</p>
            <a href="#" onClick={() => setCurrentElement(null)}>Return Home</a>
          </article>
        ):(
          /* grid view (home/null)  */
          <>
            <h1>Elements of the Periodic Table</h1>
               <label htmlFor="search">Search Elements</label>
               <input
                 id="search"
                 type="text"
                 value={query}
                 onChange={(event) => setQuery(event.target.value)}
               />
               <section className="grid">

              {elements.map((element) => (
                <Card key={element.number} element={element} onClick={() => setCurrentElement(element)}/>
              ))}              
            </section>
          </>
        )}
      </main>
    </div>
  )
}