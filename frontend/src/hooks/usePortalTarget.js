import { useEffect, useState } from "react";

/**
 * Returns the DOM node modals should portal into: `.tokyo_tm_all_wrap`
 * itself — a sibling of the sidebar, outside any section's stacking context
 * (see the portal comment in Portfolio.jsx) — rather than `document.body`.
 * `document.body` fixes the stacking issue too, but it's also outside the
 * reach of the theme's `.tokyo_tm_all_wrap *{ box-sizing: border-box }`
 * reset, which every padding/width calculation in the modal markup assumes;
 * without it, `.description_wrap`'s `padding: 50px` adds to its
 * `width: 100%` instead of being included in it, overflowing `.box_inner`'s
 * boundary (the image spilling past the popup's right edge, an unwanted
 * scrollbar, content pushed down). Portaling into `.tokyo_tm_all_wrap`
 * keeps the modal a real descendant of it, so the reset still applies.
 *
 * Only resolvable after mount — `.tokyo_tm_all_wrap` doesn't exist in the
 * real DOM yet during the render pass that creates it — so this starts
 * `null` and resolves once via an effect; callers must guard their portal
 * on the returned node being non-null. Falls back to `document.body` when
 * `.tokyo_tm_all_wrap` isn't present at all (a section rendered in
 * isolation, as the component tests do, without the real page's wrapper) —
 * production always has it, so the fallback only ever applies to tests,
 * where the box-sizing/stacking concerns above don't come up.
 */
export function usePortalTarget() {
  const [node, setNode] = useState(null);
  useEffect(() => {
    setNode(document.querySelector(".tokyo_tm_all_wrap") || document.body);
  }, []);
  return node;
}
