import sanitizeHtml from "sanitize-html";

// Tags/attributes the admin's rich text editor (Tiptap, using its
// StarterKit + Link extensions — see frontend/src/components/admin/
// RichTextEditor.jsx) can actually produce. Anything else — script tags,
// inline event handlers, iframes, style attributes — is stripped rather
// than escaped, since these fields are rendered on the public site via
// dangerouslySetInnerHTML (see frontend/src/components/RichText.jsx) and
// must be safe regardless of what a direct API call (bypassing the admin
// UI entirely) might submit.
const ALLOWED_TAGS = ["p", "br", "strong", "em", "s", "u", "ul", "ol", "li", "a", "blockquote", "code"];
const ALLOWED_ATTRIBUTES = { a: ["href", "target", "rel"] };

/**
 * Sanitizes a rich-text field down to a safe HTML subset, and also returns
 * the tag-stripped plain text so callers can validate "is this field
 * actually empty" against real content rather than markup — an editor's
 * "empty" state is often `<p></p>` or `<p><br></p>`, not an empty string.
 */
export function sanitizeRichText(rawHtml) {
  const html = sanitizeHtml((rawHtml || "").trim(), {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    // Every link the editor creates should be safe to open from any
    // context it ends up embedded in.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    },
  }).trim();
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
  return { html, text };
}
