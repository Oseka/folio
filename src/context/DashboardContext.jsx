import { createContext, useContext, useEffect, useReducer } from "react";

/* One reducer holds all UI state: who we are viewing, the compare user, theme and explorer filters */
const read = (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
const init = () => ({ user: read("folio-last", ""), compare: "", theme: read("folio-theme", "light"), language: "", sort: "stars", query: "", metric: "stars", originalOnly: true, recent: JSON.parse(read("folio-recent", "[]")) });

function reducer(s, a) {
  switch (a.type) {
    case "SET_USER": return { ...s, user: a.value, language: "", query: "", compare: "", recent: [a.value, ...s.recent.filter(x => x.toLowerCase() !== a.value.toLowerCase())].slice(0, 5) };
    case "SET_COMPARE": return { ...s, compare: a.value };
    case "TOGGLE_THEME": return { ...s, theme: s.theme === "dark" ? "light" : "dark" };
    case "SET_LANGUAGE": return { ...s, language: s.language === a.value ? "" : a.value };
    case "SET_SORT": return { ...s, sort: a.value };
    case "SET_QUERY": return { ...s, query: a.value };
    case "SET_METRIC": return { ...s, metric: a.value };
    case "SET_ORIGINAL": return { ...s, originalOnly: a.value };
    case "HOME": return { ...s, user: "", compare: "" };
    default: return s;
  }
}

const Ctx = createContext(null);
export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    try { localStorage.setItem("folio-theme", state.theme); localStorage.setItem("folio-last", state.user); localStorage.setItem("folio-recent", JSON.stringify(state.recent)); } catch {}
  }, [state.theme, state.user, state.recent]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
export const useDashboard = () => useContext(Ctx);
