import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const THEME_KEY = "portfolio_theme";

// Defaults to light rather than following `prefers-color-scheme`: the site
// has one designed default look (light, per the original theme), and dark
// is an opt-in alternative a visitor switches to explicitly — not something
// that should silently change based on their OS setting. Once a visitor
// does toggle it, that explicit choice is what persists (via localStorage),
// not a re-check of system preference on the next visit.
function getInitialTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/**
 * Switches the whole public site between its light theme (the original
 * design) and a dark theme, by toggling `data-theme` on <html> — every
 * themed color in index.css is a CSS custom property read from that
 * attribute (see the `:root` / `:root[data-theme="dark"]` blocks), so this
 * one attribute repaints everything at once. `index.html` carries a small
 * inline script that applies a saved choice before first paint, so a
 * returning dark-mode visitor never sees a light-mode flash; this
 * component just needs to start in agreement with whatever that script
 * already applied (see getInitialTheme) and keep localStorage in sync from
 * then on.
 */
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Private browsing / storage disabled — the toggle still works for
      // the rest of this visit, it just won't be remembered next time.
    }
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme_toggle flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--fg)] transition-colors duration-300 ease-in-out hover:border-[var(--fg)] ${className}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
}
