export default function Card({ element, onClick }) {
  return (
    <article className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <span className="symbol">{element.symbol}</span>
      <span className="name">{element.name}</span>
      <span className="num">{element.number}</span>
    </article>
  );
}