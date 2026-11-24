import FavouriteButton from '../features/favourites/components/FavouriteButton'

export default function Card({ element, onClick, isFavourite, onToggleFavourite, isCompareMode = false, isSelected = false,}) {
  return (
    <article
      className={`card ${isCompareMode ? 'card-selectable' : ''} ${
        isSelected ? 'card-selected' : ''
      }`.trim()}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
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