import { IGalleryPhotoRepository } from "../../domain/repositories/IGalleryPhotoRepository.js";
import { GalleryPhoto } from "../../domain/entities/GalleryPhoto.js";
import { gallerySeed } from "../data/gallerySeed.js";

let seq = 1;

/**
 * Adapter: fulfills IGalleryPhotoRepository with a process-memory array,
 * pre-populated from gallerySeed. Used automatically when no MongoDB
 * connection is available.
 */
export class InMemoryGalleryPhotoRepository extends IGalleryPhotoRepository {
  constructor() {
    super();
    this.photos = gallerySeed.map((p) => ({ id: String(seq++), ...new GalleryPhoto(p) }));
  }

  async list() {
    // Sort by the numeric id (an insertion sequence), not createdAt alone —
    // two photos created within the same millisecond would otherwise tie
    // and silently fall back to array order, breaking "newest first".
    return [...this.photos].sort((a, b) => Number(b.id) - Number(a.id));
  }

  async create(photo) {
    const record = { id: String(seq++), ...photo };
    this.photos.push(record);
    return record;
  }

  async delete(id) {
    const before = this.photos.length;
    this.photos = this.photos.filter((p) => p.id !== id);
    return this.photos.length < before;
  }
}
