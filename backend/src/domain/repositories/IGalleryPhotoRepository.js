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
  async delete(_id) {
    throw new Error("Not implemented");
  }
}
