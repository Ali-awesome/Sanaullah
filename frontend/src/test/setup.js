import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement the layout/geometry APIs ProseMirror (which
// Tiptap's RichTextEditor is built on) uses for cursor placement and
// scroll-into-view — real browsers have no such gap. These are the
// standard, widely-used no-op shims for exercising a ProseMirror-based
// editor under jsdom; they don't affect any other test.
if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}
if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () => [];
}
if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 });
}
