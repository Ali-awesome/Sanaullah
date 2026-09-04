import { DomainValidationError } from "./ContactMessage.js";
import { sanitizeRichText } from "./sanitizeRichText.js";

/**
 * Domain entity: PortfolioProject — a single card under one of the
 * Portfolio section's category tabs (Data Analytics, AI/ML, etc; "All" is
 * the separate photo GalleryPhoto gallery, not this). Self-validates on
 * construction so an invalid project can never be stored.
 */
export class PortfolioProject {
  constructor({ title, category, client, date, image, summary, link, images }) {
    const cleanTitle = (title || "").trim();
    const cleanCategory = (category || "").trim();
    // Authored as rich text (the admin panel's RichTextEditor) — see
    // BlogPost.js for why "required" is checked against the stripped text.
    const cleanSummary = sanitizeRichText(summary);

    if (!cleanTitle) throw new DomainValidationError("Title is required.");
    if (!cleanCategory) throw new DomainValidationError("Category is required.");
    if (!cleanSummary.text) throw new DomainValidationError("Summary is required.");

    this.title = cleanTitle;
    this.category = cleanCategory;
    this.summary = cleanSummary.html;
    // Client/date are display-only context (e.g. "Bdjobs.com" / "January
    // 2026") — optional since not every project has a named client or a
    // meaningful single date.
    this.client = (client || "").trim();
    this.date = (date || "").trim();
    this.image = (image || "").trim() || "/img/portfolio/3.jpg";
    // A link to the original work (a paper, a live product, a repo) — the
    // "View publication" / "View project" link shown in the detail popup.
    this.link = (link || "").trim() || null;
    this.images = Array.isArray(images) ? images.filter((i) => typeof i === "string" && i.trim()) : [];
    this.createdAt = new Date();
  }
}
