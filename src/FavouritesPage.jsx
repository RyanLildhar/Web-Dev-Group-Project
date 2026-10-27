import Card from './Card'

export default function FavouritesPage({ elements, favourites, onSelect, onToggleFavourite }) {
  // keep favourites in the order the user saved them
  const saved = favourites
    .map((n) => elements.find((el) => el.number === n))
    .filter(Boolean)

  return (
    <>
      <h1>Your Favourites</h1>
      {saved.length === 0 ? (
        <p className="empty-msg">
          No favourites yet. Press “Save” on any element to add it here.
        </p>
      ) : (
        <section className="grid">
          {saved.map((element) => (
            <Card
              key={element.number}
              element={element}
              onClick={() => onSelect(element)}
              isFavourite={true}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </section>
      )}
    </>
  )
}