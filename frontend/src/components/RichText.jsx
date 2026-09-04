import DOMPurify from "dompurify";

// The backend (sanitizeRichText.js) is the actual source of truth for what
// HTML these fields can contain — this is defense in depth on the render
// side, not the primary guard: it protects against stored data that
// predates sanitization being added, or that reached the database by some
// path other than the sanitizing domain entities.
const ALLOWED_TAGS = ["p", "br", "strong", "em", "s", "u", "ul", "ol", "li", "a", "blockquote", "code"];
const ALLOWED_ATTR = ["href", "target", "rel"];

/**
 * Renders a rich-text field (BlogPost.summary, GalleryPhoto.description,
 * PortfolioProject.summary — all authored via the admin panel's
 * RichTextEditor) as sanitized HTML. `.rich_text_content` in index.css
 * supplies the list/quote/link styling Tailwind's preflight reset strips
 * by default, shared with the editor itself so what the admin sees while
 * typing matches what visitors see.
 */
export default function RichText({ html, className = "" }) {
  const clean = DOMPurify.sanitize(html || "", { ALLOWED_TAGS, ALLOWED_ATTR });
  return <div className={`rich_text_content ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />;
}
