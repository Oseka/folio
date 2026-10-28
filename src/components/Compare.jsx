import { useState } from "react";
import { useDashboard } from "../context/DashboardContext.jsx";
import { USERNAME_RE } from "../utils/github.js";

function Row({ label, a, b }) {
  const max = Math.max(a, b, 1);
  return (
    <div className="vs-row">
      <span className="vs-val">{a.toLocaleString()}</span>
      <div className="vs-bars" aria-hidden="true"><i className="l" style={{ width: `${a / max * 100}%` }} /><i className="r" style={{ width: `${b / max * 100}%` }} /></div>
      <span className="vs-val">{b.toLocaleString()}</span>
      <span className="vs-label">{label}</span>
    </div>
  );
}

export default function Compare({ mainStats, mainUser, other, otherStats, otherUser, status, error }) {
  const { state, dispatch } = useDashboard();
  const [text, setText] = useState(""); const [err, setErr] = useState("");
  function submit(e) {
    e.preventDefault(); const v = text.trim().replace(/^@/, "");
    if (!USERNAME_RE.test(v)) return setErr("Enter a valid GitHub username.");
    setErr(""); setText(""); dispatch({ type: "SET_COMPARE", value: v });
  }
  return (
    <>
      <form onSubmit={submit} className="explorer-bar">
        <label className="sr" htmlFor="cmp">Compare with a GitHub username</label>
        <input id="cmp" placeholder="Compare with another username" value={text} onChange={e => setText(e.target.value)} maxLength={39} />
        <button className="btn primary" type="submit">Compare</button>
        {state.compare && <button type="button" className="chip" onClick={() => dispatch({ type: "SET_COMPARE", value: "" })}>Clear ✕</button>}
      </form>
      {err && <p className="form-err inline" role="alert">{err}</p>}
      {status === "loading" && <p className="empty">Loading {state.compare}…</p>}
      {status === "error" && <p className="empty" role="alert">{error}</p>}
      {status === "ready" && other && (
        <div className="vs">
          <div className="vs-head"><span>{mainUser.login}</span><span>{otherUser.login}</span></div>
          <Row label="Repositories" a={mainStats.list.length} b={otherStats.list.length} />
          <Row label="Stars" a={mainStats.stars} b={otherStats.stars} />
          <Row label="Forks" a={mainStats.forks} b={otherStats.forks} />
          <Row label="Followers" a={mainUser.followers} b={otherUser.followers} />
        </div>
      )}
      {!state.compare && <p className="hint">Pick any two developers and see them head to head.</p>}
    </>
  );
}
