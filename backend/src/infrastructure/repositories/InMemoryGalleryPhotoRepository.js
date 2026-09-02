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
    // `order` starts out matching gallerySeed's own authored order (its
    // array index) — admin drag-reordering is the only thing that ever
    // changes it after that.
    this.photos = gallerySeed.map((p, i) => ({ id: String(seq++), ...new GalleryPhoto(p), order: i }));
  }

  async list() {
    return [...this.photos].sort((a, b) => a.order - b.order);
  }

  async create(photo) {
    // New photos are appended to the end of the manual order, not spliced
    // to the front — the admin dragged everything else into place on purpose.
    const record = { id: String(seq++), ...photo, order: this.photos.length };
    this.photos.push(record);
    return record;
  }

  async update(id, photo) {
    const index = this.photos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    // Keep the original id, createdAt, and manual order — editing a photo's
    // content shouldn't change its identity or reshuffle its position.
    const record = { ...photo, id, createdAt: this.photos[index].createdAt, order: this.photos[index].order };
    this.photos[index] = record;
    return record;
  }

  async delete(id) {
    const before = this.photos.length;
    this.photos = this.photos.filter((p) => p.id !== id);
    return this.photos.length < before;
  }

  async reorder(orderedIds) {
    orderedIds.forEach((id, index) => {
      const photo = this.photos.find((p) => p.id === id);
      if (photo) photo.order = index;
    });
    return this.list();
  }
}
