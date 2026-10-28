import { useState } from "react";
import { useDashboard } from "../context/DashboardContext.jsx";
import { USERNAME_RE } from "../utils/github.js";

export default function Header() {
  const { state, dispatch } = useDashboard();
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  function submit(e) {
    e.preventDefault();
    const v = text.trim().replace(/^@/, "");
    if (!v) return setErr("Type a GitHub username to explore.");
    if (!USERNAME_RE.test(v)) return setErr("GitHub usernames use letters, numbers and hyphens only.");
    setErr(""); setText(""); dispatch({ type: "SET_USER", value: v });
  }
  return (
    <header className="topbar">
      <button className="logo" onClick={() => dispatch({ type: "HOME" })} aria-label="Folio home"><span className="mark" />folio</button>
      <form onSubmit={submit} className="search" role="search">
        <label className="sr" htmlFor="u">GitHub username</label>
        <input id="u" value={text} onChange={e => setText(e.target.value)} placeholder="Search a GitHub username" maxLength={39} autoComplete="off" />
        <button type="submit" className="btn primary">Analyze</button>
      </form>
      <button className="btn icon" onClick={() => dispatch({ type: "TOGGLE_THEME" })} aria-label={`Switch to ${state.theme === "dark" ? "light" : "dark"} theme`}>{state.theme === "dark" ? "☀️" : "🌙"}</button>
      {err && <p className="form-err" role="alert">{err}</p>}
    </header>
  );
}
