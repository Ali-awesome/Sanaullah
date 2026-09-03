/**
 * Port (interface) for storing and reading Portfolio project cards (the
 * category-tab entries — "All" is the separate IGalleryPhotoRepository).
 */
export class IPortfolioProjectRepository {
  async list() {
    throw new Error("Not implemented");
  }
  /** @param {import('../entities/PortfolioProject.js').PortfolioProject} project */
  async create(_project) {
    throw new Error("Not implemented");
  }
  /**
   * @param {string} _id
   * @param {import('../entities/PortfolioProject.js').PortfolioProject} _project
   * @returns the updated record, or null/undefined if no project has that id.
   */
  async update(_id, _project) {
    throw new Error("Not implemented");
  }
  async delete(_id) {
    throw new Error("Not implemented");
  }
  /**
   * Persists a new manual display order: `_orderedIds` is every project's
   * id, front-to-back, in the order they should now be listed.
   * @returns the full list, re-sorted to match.
   */
  async reorder(_orderedIds) {
    throw new Error("Not implemented");
  }
}
