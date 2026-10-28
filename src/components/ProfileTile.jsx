import { useDashboard } from "../context/DashboardContext.jsx";
import { accountAge } from "../utils/github.js";

const site = b => { const v = (b || "").trim(); return /^https?:\/\//i.test(v) ? v : /^[\w-]+(\.[\w-]+)+/.test(v) ? "https://" + v : null; };

export default function ProfileTile({ user }) {
  const { state, dispatch } = useDashboard();
  const link = site(user.blog);
  return (
    <section className="tile profile">
      <img src={user.avatar_url} alt={`${user.login}'s avatar`} width="96" height="96" />
      <h1>{user.name || user.login}</h1>
      <a href={user.html_url} target="_blank" rel="noopener noreferrer">@{user.login}</a>
      {user.bio && <p className="bio">{user.bio}</p>}
      <ul className="meta">
        {user.location && <li>📍 {user.location}</li>}
        {user.company && <li>🏢 {user.company}</li>}
        {link && <li>🔗 <a href={link} target="_blank" rel="noopener noreferrer">{link.replace(/^https?:\/\//, "")}</a></li>}
        <li>🗓️ On GitHub for {accountAge(user.created_at)}</li>
        <li>👥 {user.followers} followers · {user.following} following</li>
      </ul>
      <label className="switch">
        <input type="checkbox" checked={state.originalOnly} onChange={e => dispatch({ type: "SET_ORIGINAL", value: e.target.checked })} />
        <span>Count original repos only (skip forks)</span>
      </label>
    </section>
  );
}
