import { useMemo } from "react";
import { useDashboard } from "./context/DashboardContext.jsx";
import useGithubUser from "./hooks/useGithubUser.js";
import { analyze, fmt, topRepos } from "./utils/github.js";
import Header from "./components/Header.jsx";
import Tile from "./components/Tile.jsx";
import StatTile from "./components/StatTile.jsx";
import ProfileTile from "./components/ProfileTile.jsx";
import { LanguageDonut, MonthlyChart, TopRepos } from "./components/Charts.jsx";
import Feed from "./components/Feed.jsx";
import RepoExplorer from "./components/RepoExplorer.jsx";
import Compare from "./components/Compare.jsx";
import { ErrorBox, Landing, Skeleton } from "./components/States.jsx";

export default function App() {
  const { state, dispatch } = useDashboard();
  const main = useGithubUser(state.user);
  const other = useGithubUser(state.compare);
  const a = useMemo(() => (main.data ? analyze(main.data, state.originalOnly) : null), [main.data, state.originalOnly]);
  const b = useMemo(() => (other.data ? analyze(other.data, state.originalOnly) : null), [other.data, state.originalOnly]);
  const top = useMemo(() => (a ? topRepos(a.list, state.metric) : []), [a, state.metric]);

  return (
    <div className="app">
      <Header />
      {!state.user && <Landing />}
      {state.user && main.status === "loading" && <Skeleton />}
      {state.user && main.status === "error" && <ErrorBox message={main.error} onRetry={main.retry} />}
      {a && (
        <main className="bento">
          <ProfileTile user={main.data.user} />
          <StatTile tone="lime" label="Repositories" value={fmt(a.list.length)} full={a.list.length.toLocaleString()} sub={state.originalOnly ? "original work" : "including forks"} />
          <StatTile tone="lilac" label="Stars earned" value={fmt(a.stars)} full={a.stars.toLocaleString()} sub="across all repos" />
          <StatTile tone="coral" label="Forks" value={fmt(a.forks)} full={a.forks.toLocaleString()} sub="by other developers" />
          <StatTile tone="sky" label="Followers" value={fmt(a.followers)} full={a.followers.toLocaleString()} sub="following this developer" />
          <Tile title="Languages" hint="Tap a slice to filter the explorer" className="s4"><LanguageDonut data={a.langs} /></Tile>
          <Tile title="Top repositories" className="s4"
            right={<div className="seg small" role="group" aria-label="Chart metric">
              {[["stars", "Stars"], ["size", "Size"]].map(([k, l]) => <button key={k} aria-pressed={state.metric === k} onClick={() => dispatch({ type: "SET_METRIC", value: k })}>{l}</button>)}</div>}>
            <TopRepos data={top} metric={state.metric} />
          </Tile>
          <Tile title="Repositories created" hint="Last 12 months" className="s8"><MonthlyChart data={a.months} /></Tile>
          <Tile title="Recent activity" hint="Public events, last 90 days" className="s4"><Feed items={a.feed} /></Tile>
          <Tile title="Repository explorer" hint={`${a.list.length} repositories`} className="s12"><RepoExplorer list={a.list} langs={a.langs} topNames={a.topNames} /></Tile>
          <Tile title="Head to head" className="s12">
            <Compare mainStats={a} mainUser={main.data.user} other={other.data} otherStats={b} otherUser={other.data?.user} status={state.compare ? other.status : "idle"} error={other.error} />
          </Tile>
        </main>
      )}
      <footer className="foot">Data from the <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">GitHub REST API</a>. Public data only. GitHub allows 60 anonymous requests per hour.</footer>
    </div>
  );
}
