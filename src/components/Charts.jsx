import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboard } from "../context/DashboardContext.jsx";
import { PALETTE } from "../utils/github.js";

const THEMES = {
  light: { ink: "#111318", muted: "#6a7080", line: "#e4e6ec", surface: "#ffffff", hover: "rgba(17,19,24,.06)" },
  dark: { ink: "#f3f4f7", muted: "#9aa0b0", line: "#2d313b", surface: "#17181d", hover: "rgba(255,255,255,.07)" }
};
const useT = () => THEMES[useDashboard().state.theme];
const tipStyle = t => ({ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 14, color: t.ink, boxShadow: "0 8px 24px rgba(0,0,0,.12)" });

export function LanguageDonut({ data }) {
  const { state, dispatch } = useDashboard(), t = useT();
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <p className="empty">No language data yet. Repositories without code are left out.</p>;
  return (
    <div className="donut">
      <div className="donut-chart" role="img" aria-label="Repositories by language">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={3} stroke="none" onClick={d => dispatch({ type: "SET_LANGUAGE", value: d.name })}>
              {data.map((d, i) => <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} opacity={!state.language || state.language === d.name ? 1 : .3} style={{ cursor: "pointer", outline: "none" }} />)}
            </Pie>
            <Tooltip contentStyle={tipStyle(t)} itemStyle={{ color: t.ink }} formatter={(v, n) => [`${v} repos`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-mid"><b>{total}</b><span>repos</span></div>
      </div>
      <ul className="legend">
        {data.map((d, i) => (
          <li key={d.name}><button aria-pressed={state.language === d.name} onClick={() => dispatch({ type: "SET_LANGUAGE", value: d.name })}>
            <i style={{ background: PALETTE[i % PALETTE.length] }} />{d.name}<span>{Math.round(d.value / total * 100)}%</span></button></li>
        ))}
      </ul>
    </div>
  );
}

export function TopRepos({ data, metric }) {
  const t = useT();
  if (!data.length || data.every(d => d.value === 0)) return <p className="empty">{metric === "stars" ? "No stars yet. Switch to Size, or share your projects to earn some." : "No repositories to measure yet."}</p>;
  return (
    <div className="chart" role="img" aria-label="Top repositories">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={112} tickLine={false} axisLine={false} tick={{ fill: t.ink, fontSize: 12 }} />
          <Tooltip contentStyle={tipStyle(t)} itemStyle={{ color: t.ink }} cursor={{ fill: t.hover }} formatter={v => [v.toLocaleString(), metric === "stars" ? "Stars" : "Size (KB)"]} />
          <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={18}>{data.map((d, i) => <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyChart({ data }) {
  const t = useT();
  return (
    <div className="chart" role="img" aria-label="Repositories created per month">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: t.line }} tick={{ fill: t.muted, fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: t.muted, fontSize: 12 }} />
          <Tooltip contentStyle={tipStyle(t)} itemStyle={{ color: t.ink }} cursor={{ fill: t.hover }} formatter={v => [v, "New repos"]} />
          <Bar dataKey="count" fill="#6c5ce7" radius={[10, 10, 0, 0]} maxBarSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
