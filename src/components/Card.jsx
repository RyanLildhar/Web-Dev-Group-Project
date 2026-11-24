import FavouriteButton from '../features/favourites/components/FavouriteButton'

export default function Card({ element, onClick, isFavourite, onToggleFavourite, isCompareMode = false, isSelected = false, isTopRow = false, isLeftEdge = false, isRightEdge = false,}) {
  const previewClassName = [
    'card-preview',
    isTopRow ? 'card-preview--below' : '',
    isLeftEdge ? 'card-preview--left' : '',
    isRightEdge ? 'card-preview--right' : '',
  ]
    .filter(Boolean)
    .join(' ');

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

      {/* Hover preview: hidden by default, shown with CSS when the card is hovered.
          role="tooltip" tells screen readers this is supplementary info. */}
      <div className={previewClassName} role="tooltip">
        {/* Element name + category as a small header */}
        <strong className="preview-title">{element.name}</strong>
        <span className="preview-category">{element.category}</span>

        {/* Summary from the JSON; CSS cuts it off after a few lines with "…"
            so the user sees "some" of the description, not the whole thing */}
        <p className="preview-summary">{element.summary}</p>
      </div>
    </article>
  );
}