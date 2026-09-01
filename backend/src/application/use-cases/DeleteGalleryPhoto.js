export class DeleteGalleryPhoto {
  /** @param {import('../../domain/repositories/IGalleryPhotoRepository.js').IGalleryPhotoRepository} galleryPhotoRepository */
  constructor(galleryPhotoRepository) {
    this.galleryPhotoRepository = galleryPhotoRepository;
  }

  async execute(id) {
    return this.galleryPhotoRepository.delete(id);
  }
}
