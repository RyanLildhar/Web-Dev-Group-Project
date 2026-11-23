import FavouriteButton from './FavouriteButton'

export default function Card({ element, onClick, isFavourite, onToggleFavourite }) {
  return (
    // "card" now also acts as the anchor point for the hover preview (see styles.css)
    <article className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
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
      <div className="card-preview" role="tooltip">
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