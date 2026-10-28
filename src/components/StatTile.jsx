/* Reusable coloured number tile. The number's font size adapts to its length so long values never overflow. */
export default function StatTile({ label, value, full, sub, tone }) {
  const text = String(value);
  return (
    <div className={`tile stat ${tone}`}>
      <span className="stat-label">{label}</span>
      <b className="stat-value" style={{ "--len": Math.max(text.length, 2) }} title={full} aria-hidden={full ? "true" : undefined}>{text}</b>
      {full && <span className="sr">{full}</span>}
      <span className="stat-sub">{sub}</span>
    </div>
  );
}
