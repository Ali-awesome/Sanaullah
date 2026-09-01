import { GalleryPhoto } from "../../domain/entities/GalleryPhoto.js";

export class CreateGalleryPhoto {
  /** @param {import('../../domain/repositories/IGalleryPhotoRepository.js').IGalleryPhotoRepository} galleryPhotoRepository */
  constructor(galleryPhotoRepository) {
    this.galleryPhotoRepository = galleryPhotoRepository;
  }

  async execute(payload) {
    const photo = new GalleryPhoto(payload);
    return this.galleryPhotoRepository.create(photo);
  }
}
