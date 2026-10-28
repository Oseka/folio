import { useState } from "react";
import { useDashboard } from "../context/DashboardContext.jsx";
import { PALETTE, relTime } from "../utils/github.js";

export default function RepoExplorer({ list, langs, topNames }) {
  const { state, dispatch } = useDashboard();
  const [all, setAll] = useState(false);
  const q = state.query.trim().toLowerCase();
  const idx = name => Math.max(0, langs.findIndex(l => l.name === name));
  const rows = list
    .filter(r => !state.language || (state.language === "Other" ? r.language && !topNames.includes(r.language) : r.language === state.language))
    .filter(r => !q || r.name.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q))
    .sort((a, b) => state.sort === "stars" ? b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at)
      : state.sort === "name" ? a.name.localeCompare(b.name) : new Date(b.pushed_at) - new Date(a.pushed_at));
  const shown = all ? rows : rows.slice(0, 8);
  return (
    <>
      <div className="explorer-bar">
        <input type="search" placeholder="Search repositories" aria-label="Search repositories" value={state.query} onChange={e => dispatch({ type: "SET_QUERY", value: e.target.value })} />
        <div className="seg" role="group" aria-label="Sort repositories">
          {[["stars", "Stars"], ["updated", "Latest"], ["name", "A to Z"]].map(([k, l]) => <button key={k} aria-pressed={state.sort === k} onClick={() => dispatch({ type: "SET_SORT", value: k })}>{l}</button>)}
        </div>
        {state.language && <button className="chip" onClick={() => dispatch({ type: "SET_LANGUAGE", value: state.language })}>{state.language} ✕</button>}
      </div>
      {rows.length === 0 ? <p className="empty">No repositories match these filters.</p> : (
        <ul className="repos">
          {shown.map(r => (
            <li key={r.id}>
              <a href={r.html_url} target="_blank" rel="noopener noreferrer">
                <b>{r.name}</b>{r.fork && <em>fork</em>}
                <p>{r.description || "No description yet."}</p>
                <div className="repo-meta">
                  {r.language && <span><i style={{ background: PALETTE[idx(r.language) % PALETTE.length] }} />{r.language}</span>}
                  <span>⭐ {r.stargazers_count}</span><span>🍴 {r.forks_count}</span><span>Updated {relTime(r.pushed_at)}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
      {rows.length > 8 && <button className="btn" onClick={() => setAll(a => !a)}>{all ? "Show fewer" : `Show all ${rows.length}`}</button>}
    </>
  );
}
