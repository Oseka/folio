import { useDashboard } from "../context/DashboardContext.jsx";

const SAMPLES = ["Oseka", "torvalds", "gaearon", "sindresorhus"];

export function Landing() {
  const { state, dispatch } = useDashboard();
  const go = v => dispatch({ type: "SET_USER", value: v });
  return (
    <section className="landing">
      <h1>Your code,<br /><em>in numbers.</em></h1>
      <p>Folio turns any GitHub profile into a live analytics dashboard: languages, top projects, growth over time, recent activity and head-to-head comparisons.</p>
      <div className="chips" aria-label="Try a profile">
        {[...new Set([...state.recent, ...SAMPLES])].slice(0, 6).map(u => <button key={u} className="chip big" onClick={() => go(u)}>@{u}</button>)}
      </div>
    </section>
  );
}

export const Skeleton = () => <div className="skeleton" aria-label="Loading dashboard">{Array.from({ length: 6 }, (_, i) => <div key={i} />)}</div>;

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="tile error" role="alert"><h2>Couldn’t load this profile</h2><p>{message}</p><button className="btn primary" onClick={onRetry}>Try again</button></div>
  );
}
