/* GitHub public API helpers (free, no key, 60 requests per hour per visitor) */
const API = "https://api.github.com";
const cache = new Map();
export const PALETTE = ["#6c5ce7", "#00b894", "#ff7675", "#0984e3", "#fdcb6e", "#e17055", "#00cec9"];
/* Big numbers shrink to a compact form (265.9K) so they always fit their tile */
export const fmt = n => (n >= 10000 ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n) : n.toLocaleString());
export const USERNAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

async function gh(path, signal) {
  const res = await fetch(API + path, { signal, headers: { Accept: "application/vnd.github+json" } });
  if (res.status === 404) throw Object.assign(new Error("not-found"), { code: 404 });
  if (res.status === 403 || res.status === 429) {
    const reset = +res.headers.get("x-ratelimit-reset") * 1000 || 0;
    throw Object.assign(new Error("rate-limit"), { code: "rate", reset });
  }
  if (!res.ok) throw new Error(`GitHub replied with an error (${res.status}).`);
  return res.json();
}

export async function loadUser(name, signal) {
  const key = name.toLowerCase();
  if (cache.has(key)) return cache.get(key);
  const n = encodeURIComponent(name);
  const [user, repos, events] = await Promise.all([
    gh(`/users/${n}`, signal), gh(`/users/${n}/repos?per_page=100&sort=updated`, signal), gh(`/users/${n}/events/public?per_page=30`, signal).catch(() => [])
  ]);
  const data = { user, repos, events };
  cache.set(key, data);
  return data;
}

export function explain(e, name) {
  if (e.code === 404) return `No GitHub user named “${name}”. Check the spelling and try again.`;
  if (e.code === "rate") return `GitHub's free request limit was reached${e.reset ? `. Try again after ${new Date(e.reset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}.`;
  if (e instanceof TypeError) return "Could not reach GitHub. Check your connection.";
  return e.message;
}

export function relTime(iso) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${Math.max(m, 1)} min ago`;
  const h = Math.round(m / 60); if (h < 48) return `${h} h ago`;
  const d = Math.round(h / 24); if (d < 60) return `${d} days ago`;
  return `${Math.round(d / 30)} months ago`;
}

export function accountAge(iso) {
  const months = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / (30.44 * 864e5)));
  return months < 24 ? `${months} mo` : `${(months / 12).toFixed(1)} yrs`;
}

export function analyze({ user, repos, events }, originalOnly) {
  const list = repos.filter(r => !originalOnly || !r.fork);
  const sum = k => list.reduce((s, r) => s + (r[k] || 0), 0);
  const count = {};
  list.forEach(r => { if (r.language) count[r.language] = (count[r.language] || 0) + 1; });
  let langs = Object.entries(count).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  const topNames = langs.slice(0, 6).map(l => l.name);
  if (langs.length > 7) langs = [...langs.slice(0, 6), { name: "Other", value: langs.slice(6).reduce((s, l) => s + l.value, 0) }];
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => { const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1); return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString([], { month: "short" }), count: 0 }; });
  list.forEach(r => { const d = new Date(r.created_at), m = months.find(x => x.key === `${d.getFullYear()}-${d.getMonth()}`); if (m) m.count++; });
  const feed = events.slice(0, 8).map(e => {
    const p = e.payload || {}, repo = (e.repo?.name || "").split("/").pop();
    const t = {
      PushEvent: ["⬆️", `Pushed ${p.size ?? p.commits?.length ?? 1} commit(s) to ${repo}`],
      CreateEvent: ["✨", `Created ${p.ref_type || "something"} ${p.ref_type === "repository" ? repo : (p.ref || repo)}`],
      WatchEvent: ["⭐", `Starred ${repo}`], ForkEvent: ["🍴", `Forked ${repo}`],
      PullRequestEvent: ["🔀", `${p.action || "Updated"} a pull request in ${repo}`], IssuesEvent: ["🐞", `${p.action || "Updated"} an issue in ${repo}`]
    }[e.type] || ["•", `${e.type.replace("Event", "")} in ${repo}`];
    return { id: e.id, icon: t[0], text: t[1], time: e.created_at };
  });
  return { list, stars: sum("stargazers_count"), forks: sum("forks_count"), langs, topNames, months, feed, followers: user.followers };
}

export function topRepos(list, metric) {
  const val = r => (metric === "stars" ? r.stargazers_count : r.size);
  return [...list].sort((a, b) => val(b) - val(a)).slice(0, 6).map(r => ({ name: r.name.length > 18 ? r.name.slice(0, 17) + "…" : r.name, value: val(r) }));
}
