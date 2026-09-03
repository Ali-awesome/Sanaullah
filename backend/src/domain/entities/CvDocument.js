import { DomainValidationError } from "./ContactMessage.js";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB — comfortably above any real CV, well under MongoDB's 16MB document limit

/**
 * Domain entity: CvDocument — the single downloadable CV file backing the
 * "Download CV" links on the public site. Only one exists at a time;
 * uploading a new one replaces it (see UploadCv). Self-validates on
 * construction so an invalid file can never be stored.
 */
export class CvDocument {
  constructor({ buffer, mimetype, filename }) {
    if (!buffer || !buffer.length) throw new DomainValidationError("A CV file is required.");
    if (mimetype !== "application/pdf") throw new DomainValidationError("The CV must be a PDF file.");
    if (buffer.length > MAX_BYTES) throw new DomainValidationError("The CV file is too large (max 10MB).");

    this.buffer = buffer;
    this.mimetype = mimetype;
    this.filename = (filename || "").trim() || "CV.pdf";
    this.uploadedAt = new Date();
  }
}
