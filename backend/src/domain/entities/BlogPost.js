import { DomainValidationError } from "./ContactMessage.js";

/**
 * Domain entity: BlogPost (used for the "Publications & Learning" feed).
 * Self-validates on construction so an invalid post can never be stored.
 */
export class BlogPost {
  constructor({ title, source, date, summary, image, link }) {
    const cleanTitle = (title || "").trim();
    const cleanSource = (source || "").trim();
    const cleanDate = (date || "").trim();
    const cleanSummary = (summary || "").trim();

    if (!cleanTitle) throw new DomainValidationError("Title is required.");
    if (!cleanSource) throw new DomainValidationError("Source is required.");
    if (!cleanDate) throw new DomainValidationError("Date is required.");
    if (!cleanSummary) throw new DomainValidationError("Summary is required.");

    this.title = cleanTitle;
    this.source = cleanSource;
    this.date = cleanDate;
    this.summary = cleanSummary;
    this.image = (image || "").trim() || "/img/news/1.jpg";
    this.link = (link || "").trim() || null;
    this.createdAt = new Date();
  }
}
