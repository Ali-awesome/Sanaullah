/**
 * Port (interface) for storing and reading the single current CV document.
 */
export class ICvRepository {
  /** @returns {import('../entities/CvDocument.js').CvDocument | null} the current CV, or null if none has been uploaded yet. */
  async get() {
    throw new Error("Not implemented");
  }
  /**
   * Replaces whatever CV currently exists.
   * @param {import('../entities/CvDocument.js').CvDocument} _cvDocument
   */
  async set(_cvDocument) {
    throw new Error("Not implemented");
  }
}
