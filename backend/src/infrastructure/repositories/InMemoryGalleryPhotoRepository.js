import { IGalleryPhotoRepository } from "../../domain/repositories/IGalleryPhotoRepository.js";
import { GalleryPhoto } from "../../domain/entities/GalleryPhoto.js";
import { gallerySeed } from "../data/gallerySeed.js";
import { seedOrdered, listOrdered, createOrdered, updateOrdered, deleteOrdered, reorderOrdered } from "./orderedInMemoryOps.js";

let seq = 1;
const nextId = () => seq++;

/**
 * Adapter: fulfills IGalleryPhotoRepository with a process-memory array,
 * pre-populated from gallerySeed. Used automatically when no MongoDB
 * connection is available.
 */
export class InMemoryGalleryPhotoRepository extends IGalleryPhotoRepository {
  constructor() {
    super();
    this.photos = seedOrdered(gallerySeed, GalleryPhoto, nextId);
  }

  async list() {
    return listOrdered(this.photos);
  }

  async create(photo) {
    return createOrdered(this.photos, nextId, photo);
  }

  async update(id, photo) {
    return updateOrdered(this.photos, id, photo);
  }

  async delete(id) {
    return deleteOrdered(this.photos, id);
  }

  async reorder(orderedIds) {
    return reorderOrdered(this.photos, orderedIds);
  }
}
