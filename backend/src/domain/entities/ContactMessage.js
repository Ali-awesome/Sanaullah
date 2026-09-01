/**
 * Domain entity: ContactMessage.
 * Owns its own validity — nothing outside this class decides what a
 * "valid" contact message is. Throws on construction if invariants fail,
 * so an invalid message can never exist in the system.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ContactMessage {
  constructor({ name, email, message }) {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim();
    const cleanMessage = (message || "").trim();

    if (!cleanName) throw new DomainValidationError("Name is required.");
    if (!EMAIL_RE.test(cleanEmail)) throw new DomainValidationError("A valid email is required.");
    if (cleanMessage.length < 5) throw new DomainValidationError("Message is too short.");

    this.name = cleanName;
    this.email = cleanEmail;
    this.message = cleanMessage;
    this.createdAt = new Date();
  }
}

export class DomainValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "DomainValidationError";
  }
}
