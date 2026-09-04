import { FilterXSS, safeAttrValue } from "xss";

// Tags/attributes the admin's rich text editor (Tiptap, using its
// StarterKit — see frontend/src/components/admin/RichTextEditor.jsx) can
// actually produce. Anything else — script tags, inline event handlers,
// iframes, style attributes — is stripped rather than escaped, since these
// fields are rendered on the public site via dangerouslySetInnerHTML (see
// frontend/src/components/RichText.jsx) and must be safe regardless of
// what a direct API call (bypassing the admin UI entirely) might submit.
//
// Uses the `xss` package rather than `sanitize-html`: the latter's current
// release depends on an ESM-only htmlparser2, which crashes with
// ERR_REQUIRE_ESM under Node runtimes that don't support requiring ESM
// from CommonJS (this broke every API route in production on Vercel,
// since sanitizeRichText is imported by the domain entities the whole app
// depends on at cold start). `xss` is plain CommonJS with no such
// transitive-dependency risk.
const richTextFilter = new FilterXSS({
  whiteList: {
    p: [],
    br: [],
    strong: [],
    em: [],
    s: [],
    u: [],
    ul: [],
    ol: [],
    li: [],
    a: ["href"],
    blockquote: [],
    code: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
  onTagAttr: (tag, name, value) => {
    if (tag !== "a" || name !== "href") return undefined; // fall through to default handling
    // Every link the editor creates should be safe to open from any
    // context it ends up embedded in. `safeAttrValue` is the same
    // protocol/quote validation the library applies to any other
    // whitelisted attribute — reused explicitly here (rather than just
    // whitelisting target/rel too) so a submitted target/rel can't
    // override the ones actually enforced.
    const safeHref = safeAttrValue(tag, name, value);
    return safeHref ? `href="${safeHref}" target="_blank" rel="noopener noreferrer"` : 'href=""';
  },
});
const plainTextFilter = new FilterXSS({ whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ["script", "style"] });

/**
 * Sanitizes a rich-text field down to a safe HTML subset, and also returns
 * the tag-stripped plain text so callers can validate "is this field
 * actually empty" against real content rather than markup — an editor's
 * "empty" state is often `<p></p>` or `<p><br></p>`, not an empty string.
 */
export function sanitizeRichText(rawHtml) {
  const html = richTextFilter.process((rawHtml || "").trim()).trim();
  const text = plainTextFilter.process(html).trim();
  return { html, text };
}
