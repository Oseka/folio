/* Reusable bento tile: title, optional hint and right slot, then content */
export default function Tile({ title, hint, right, className = "", children }) {
  return (
    <section className={`tile ${className}`}>
      {title && (
        <header className="tile-head">
          <div><h2>{title}</h2>{hint && <p className="hint">{hint}</p>}</div>{right}
        </header>
      )}
      {children}
    </section>
  );
}
