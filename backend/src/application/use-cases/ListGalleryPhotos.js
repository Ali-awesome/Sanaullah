export class ListGalleryPhotos {
  /** @param {import('../../domain/repositories/IGalleryPhotoRepository.js').IGalleryPhotoRepository} galleryPhotoRepository */
  constructor(galleryPhotoRepository) {
    this.galleryPhotoRepository = galleryPhotoRepository;
  }

  async execute() {
    return this.galleryPhotoRepository.list();
  }
}
