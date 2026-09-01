import { useEffect, useState } from "react";

/**
 * Recreates the original theme's intro preloader: a full-screen curtain
 * with a growing/pulsing center line, matching its exact timing —
 * `preloaded` (curtain starts closing) at 1300ms, fully removed at 2500ms
 * — skipped on mobile, same as the source site (tokyo_tm_preloader() in
 * the original init.js).
 */
export default function Preloader() {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    if (isMobile) {
      setPhase("removed");
      return;
    }
    const t1 = setTimeout(() => setPhase("preloaded"), 1300);
    const t2 = setTimeout(() => setPhase("removed"), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "removed") return null;

  return (
    <div id="preloader" className={phase === "preloaded" ? "preloaded" : ""}>
      <div className="loader_line"></div>
    </div>
  );
}
