export class ReorderGalleryPhotos {
  /** @param {import('../../domain/repositories/IGalleryPhotoRepository.js').IGalleryPhotoRepository} galleryPhotoRepository */
  constructor(galleryPhotoRepository) {
    this.galleryPhotoRepository = galleryPhotoRepository;
  }

  async execute(orderedIds) {
    return this.galleryPhotoRepository.reorder(orderedIds);
  }
}
