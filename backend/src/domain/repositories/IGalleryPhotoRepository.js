/**
 * Port (interface) for storing and reading gallery photos.
 */
export class IGalleryPhotoRepository {
  async list() {
    throw new Error("Not implemented");
  }
  /** @param {import('../entities/GalleryPhoto.js').GalleryPhoto} photo */
  async create(_photo) {
    throw new Error("Not implemented");
  }
  /**
   * @param {string} _id
   * @param {import('../entities/GalleryPhoto.js').GalleryPhoto} _photo
   * @returns the updated record, or null/undefined if no photo has that id.
   */
  async update(_id, _photo) {
    throw new Error("Not implemented");
  }
  async delete(_id) {
    throw new Error("Not implemented");
  }
}
