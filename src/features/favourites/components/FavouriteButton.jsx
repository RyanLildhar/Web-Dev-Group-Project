
// Shows state with an icon AND text (not colour alone) for accessibility.
export default function FavouriteButton({ element, isFavourite, onToggle }) {
  return (
    <button
      type="button"
      className={`fav-btn${isFavourite ? ' fav-btn--active' : ''}`}
      aria-pressed={isFavourite}
      aria-label={`${isFavourite ? 'Remove' : 'Add'} ${element.name} ${isFavourite ? 'from' : 'to'} favourites`}
      onClick={(e) => {
        e.stopPropagation() // don't also open the element
        onToggle(element.number)
      }}
    >
      <span aria-hidden="true">{isFavourite ? '★' : '☆'}</span>
      <span className="fav-btn__text">{isFavourite ? 'Saved' : 'Save'}</span>
    </button>
  )
}