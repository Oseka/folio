import { useEffect, useState } from "react";
import { explain, loadUser } from "../utils/github.js";

/* Loads one GitHub user's profile, repositories and public events with loading / error states */
export default function useGithubUser(name) {
  const [s, setS] = useState({ status: "idle", data: null, error: "" });
  const [tries, setTries] = useState(0);
  useEffect(() => {
    if (!name) { setS({ status: "idle", data: null, error: "" }); return; }
    const ctl = new AbortController();
    setS({ status: "loading", data: null, error: "" });
    loadUser(name, ctl.signal)
      .then(data => setS({ status: "ready", data, error: "" }))
      .catch(e => { if (!ctl.signal.aborted) setS({ status: "error", data: null, error: explain(e, name) }); });
    return () => ctl.abort();
  }, [name, tries]);
  return { ...s, retry: () => setTries(t => t + 1) };
}
