import { GalleryPhoto } from "../../domain/entities/GalleryPhoto.js";

export class UpdateGalleryPhoto {
  /** @param {import('../../domain/repositories/IGalleryPhotoRepository.js').IGalleryPhotoRepository} galleryPhotoRepository */
  constructor(galleryPhotoRepository) {
    this.galleryPhotoRepository = galleryPhotoRepository;
  }

  async execute(id, payload) {
    const photo = new GalleryPhoto(payload);
    return this.galleryPhotoRepository.update(id, photo);
  }
}
