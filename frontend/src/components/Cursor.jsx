import { useEffect, useRef } from "react";

/**
 * Recreates the original theme's "magic cursor" (tokyo_tm_cursor() in the
 * source init.js): an outer ring + inner dot that track the mouse 1:1,
 * and grow/fade via the .cursor-hover class whenever the pointer is over
 * a link. Direct DOM style writes (not React state) on every mousemove,
 * same as the original — re-rendering on every pixel of mouse movement
 * would be needless overhead. Already hidden on touch/small screens by
 * the theme's own CSS media query.
 */
export default function Cursor() {
  const innerRef = useRef(null);
  const outerRef = useRef(null);

  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    const move = (e) => {
      const t = `translate(${e.clientX}px, ${e.clientY}px)`;
      inner.style.transform = t;
      outer.style.transform = t;
    };
    const onOver = (e) => {
      if (e.target.closest("a")) {
        inner.classList.add("cursor-hover");
        outer.classList.add("cursor-hover");
      }
    };
    const onOut = (e) => {
      if (e.target.closest("a")) {
        inner.classList.remove("cursor-hover");
        outer.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", move);
    document.body.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseout", onOut);
    inner.style.visibility = "visible";
    outer.style.visibility = "visible";

    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div className="mouse-cursor cursor-outer" ref={outerRef}></div>
      <div className="mouse-cursor cursor-inner" ref={innerRef}></div>
    </>
  );
}
