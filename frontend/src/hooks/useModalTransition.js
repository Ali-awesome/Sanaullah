import { useEffect, useState } from "react";

/**
 * Keeps a modal's last non-null content displayed for `duration` ms after
 * `value` clears, so a CSS close-fade (`.tokyo_tm_modalbox`'s opacity/
 * visibility transition) has something to fade out instead of the content
 * disappearing the instant it's deselected.
 *
 * This does NOT also gate the "opened" class — that must come directly from
 * `value != null`, synchronously, in the same render. An earlier version
 * tried to delay adding "opened" by one requestAnimationFrame so the CSS
 * transition would have a "before" state to animate from, but rAF callbacks
 * are throttled or dropped entirely for backgrounded/hidden tabs, which left
 * the modal permanently stuck invisible (mounted, but never gaining
 * "opened") — worse than the pop-in it was meant to smooth out. The correct
 * "before" state instead comes from the modal shell being unconditionally
 * rendered by the caller from first mount (see Portfolio/Service/
 * Publications), matching the original theme's own markup: the popup div
 * always exists in the DOM, hidden by `.tokyo_tm_modalbox`'s own opacity/
 * visibility rules, with JS only ever toggling the "opened" class.
 */
export function useModalTransition(value, duration = 300) {
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    if (value != null) {
      setDisplayed(value);
      return;
    }
    const timer = setTimeout(() => setDisplayed(null), duration);
    return () => clearTimeout(timer);
  }, [value, duration]);

  return [displayed, value != null];
}
