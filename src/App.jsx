import { useState } from 'react'
import logo from './assets/atom-logo.png'
import './styles/styles.css'

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div>
      <header className="site-header">
        <a className="brand" href="#" onClick={() => setCurrentView('home')}>
          <img src={logo} alt="free atom clipart logo" />
          Interactive Periodic Table
        </a>
        <nav>
          <a href="#" onClick={() => setCurrentView('home')}>Home</a>
          <a href="#" onClick={() => setCurrentView('detail')}>Details</a>
        </nav>
      </header>
      <main>
        {/* detail page managed with useState (? conditional) */}
        {currentView === 'detail' ? (
          <article className='detail-view'>
            <h1>Hydrogen gas</h1>
            <p>Atomic Number: 1</p>
            <p>Atomic Mass: 1.008</p>
            <p>Category: Diatomic Nonmetal</p>
            <p>Summary: Summary: Hydrogen is a chemical element with chemical symbol H and atomic number 1. With an atomic weight of 1.00794 u, hydrogen is the lightest element on the periodic table. Its monatomic form (H) is the most abundant chemical substance in the Universe, constituting roughly 75% of all baryonic mass.</p>
            <a href="#" onClick={() => setCurrentView('home')}>Home</a>
          </article>
        ):(
          /* grid view (home)  */
          <>
            <h1>Elements of the Periodic Table</h1>
            <section className="grid">
              <article className="card" onClick={() => setCurrentView('detail')} style={{ cursor: 'pointer' }}>
                <span className="symbol">H</span>
                <span className="name">Hydrogen</span>
                <span className="num">1</span>
              </article>

              <article className="card" onClick={() => setCurrentView('detail')} style={{ cursor: 'pointer' }}>
                <span className="symbol">He</span>
                <span className="name">Helium</span>
                <span className="num">2</span>
              </article>

              <article className="card" onClick={() => setCurrentView('detail')} style={{ cursor: 'pointer' }}>
                <span className="symbol">Mg</span>
                <span className="name">Magnesium</span>
                <span className="num">12</span>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  )
}