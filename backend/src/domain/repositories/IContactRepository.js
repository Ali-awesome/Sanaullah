/**
 * Port (interface) the application layer depends on.
 * Infrastructure provides the real implementation (Mongo or in-memory);
 * the domain/application layers never know which one is in use.
 */
export class IContactRepository {
  /** @param {import('../entities/ContactMessage.js').ContactMessage} contactMessage */
  async save(_contactMessage) {
    throw new Error("Not implemented");
  }

  /** Newest-first list of received messages, for the admin inbox. */
  async list() {
    throw new Error("Not implemented");
  }
}
