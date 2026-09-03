import mongoose from "mongoose";
import { IGalleryPhotoRepository } from "../../domain/repositories/IGalleryPhotoRepository.js";
import { gallerySeed } from "../data/gallerySeed.js";
import { GalleryPhoto } from "../../domain/entities/GalleryPhoto.js";
import { ensureSeededOrdered, listOrdered, createOrdered, updateOrdered, deleteOrdered, reorderOrdered } from "./orderedMongoOps.js";

const galleryPhotoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  // Optional — shown in the lightbox when a visitor clicks the photo.
  description: { type: String, default: "" },
  // Manual display order (ascending) — set by the admin panel's drag-to-
  // reorder, not by the user directly. Absent on documents written before
  // this field existed; ensureSeeded() backfills those on boot.
  order: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const GalleryPhotoModel = mongoose.models.GalleryPhoto || mongoose.model("GalleryPhoto", galleryPhotoSchema);

/**
 * Adapter: fulfills IGalleryPhotoRepository via MongoDB (Mongoose).
 * Seeds the starter photos from gallerySeed.js the first time the
 * collection is empty, so the "All" tab never starts out blank.
 */
export class MongoGalleryPhotoRepository extends IGalleryPhotoRepository {
  async ensureSeeded() {
    return ensureSeededOrdered(GalleryPhotoModel, gallerySeed, GalleryPhoto);
  }

  async list() {
    return listOrdered(GalleryPhotoModel);
  }

  async create(photo) {
    return createOrdered(GalleryPhotoModel, photo);
  }

  async update(id, photo) {
    return updateOrdered(GalleryPhotoModel, id, photo);
  }

  async delete(id) {
    return deleteOrdered(GalleryPhotoModel, id);
  }

  async reorder(orderedIds) {
    return reorderOrdered(GalleryPhotoModel, orderedIds);
  }
}
