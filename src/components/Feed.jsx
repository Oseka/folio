import { relTime } from "../utils/github.js";

export default function Feed({ items }) {
  if (!items.length) return <p className="empty">No public activity in the last 90 days.</p>;
  return (
    <ul className="feed">
      {items.map(i => (
        <li key={i.id}><span className="ico" aria-hidden="true">{i.icon}</span><div><p>{i.text}</p><small>{relTime(i.time)}</small></div></li>
      ))}
    </ul>
  );
}
