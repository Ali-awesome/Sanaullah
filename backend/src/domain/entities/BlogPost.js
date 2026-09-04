import { DomainValidationError } from "./ContactMessage.js";
import { sanitizeRichText } from "./sanitizeRichText.js";

/**
 * Domain entity: BlogPost (used for the "Publications & Learning" feed).
 * Self-validates on construction so an invalid post can never be stored.
 */
export class BlogPost {
  constructor({ title, source, date, summary, image, link }) {
    const cleanTitle = (title || "").trim();
    const cleanSource = (source || "").trim();
    const cleanDate = (date || "").trim();
    // Authored as rich text (the admin panel's RichTextEditor): sanitized
    // down to a safe HTML subset for storage/rendering, but "required" is
    // checked against the tag-stripped text — an editor's empty state is
    // markup like `<p></p>`, not an empty string.
    const cleanSummary = sanitizeRichText(summary);

    if (!cleanTitle) throw new DomainValidationError("Title is required.");
    if (!cleanSource) throw new DomainValidationError("Source is required.");
    if (!cleanSummary.text) throw new DomainValidationError("Summary is required.");
    // Date is optional: some entries (a course with no fixed completion
    // date) genuinely have nothing meaningful to show here — the frontend
    // renders the source/date line without it when it's blank, rather than
    // forcing every post to carry a fabricated placeholder date.

    this.title = cleanTitle;
    this.source = cleanSource;
    this.date = cleanDate;
    this.summary = cleanSummary.html;
    this.image = (image || "").trim() || "/img/news/1.jpg";
    this.link = (link || "").trim() || null;
    this.createdAt = new Date();
  }
}
