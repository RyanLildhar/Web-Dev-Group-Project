import FavouriteButton from './FavouriteButton'

export default function Card({ element, onClick, isFavourite, onToggleFavourite }) {
  return (
    <article className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <span className="symbol">{element.symbol}</span>
      <span className="name">{element.name}</span>
      <span className="num">{element.number}</span>
      <FavouriteButton
        element={element}
        isFavourite={isFavourite}
        onToggle={onToggleFavourite}
      />
    </article>
  );
}