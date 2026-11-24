import { Link, useParams } from 'react-router-dom'
import FavouriteButton from './FavouriteButton'

// Show a value, or "Not available" when the data has null/undefined
function show(value, unit = '') {
  return value == null ? 'Not available' : `${value}${unit}`
}

export default function ElementDetail({ elements, isFavourite, onToggleFavourite }) {
  // the :number part of /element/:number
  const { number } = useParams()

  if (elements.length === 0) {
    return <p role="status">Loading element…</p>
  }

  const element = elements.find((el) => el.number === Number(number))

  if (!element) {
    return (
      <article className="detail-view">
        <h1>Element not found</h1>
        <p>There is no element with the number “{number}”.</p>
        <p><Link to="/">Back to the table</Link></p>
      </article>
    )
  }

  return (
    <article className="detail-view">
      <h1>{element.name}</h1>
      <p>Atomic Number: {element.number}</p>
      <p>Atomic Mass: {show(element.atomic_mass)}</p>
      <p>Melting point: {show(element.melt, ' K')}</p>
      <p>Boiling point: {show(element.boil, ' K')}</p>
      <p>Category: {show(element.category)}</p>
      <p>Summary: {show(element.summary)}</p>
      <FavouriteButton
        element={element}
        isFavourite={isFavourite(element.number)}
        onToggle={onToggleFavourite}
      />
      <p><Link to="/">Back to the table</Link></p>
    </article>
  )
}