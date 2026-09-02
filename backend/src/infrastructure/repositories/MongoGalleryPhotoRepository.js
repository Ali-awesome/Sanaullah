import mongoose from "mongoose";
import { IGalleryPhotoRepository } from "../../domain/repositories/IGalleryPhotoRepository.js";
import { gallerySeed } from "../data/gallerySeed.js";
import { GalleryPhoto } from "../../domain/entities/GalleryPhoto.js";

const galleryPhotoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  // Manual display order (ascending) — set by the admin panel's drag-to-
  // reorder, not by the user directly. Absent on documents written before
  // this field existed; ensureSeeded() backfills those on boot.
  order: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const GalleryPhotoModel = mongoose.models.GalleryPhoto || mongoose.model("GalleryPhoto", galleryPhotoSchema);

function toRecord(doc) {
  const obj = doc.toObject();
  return { ...obj, id: String(obj._id) };
}

/**
 * Adapter: fulfills IGalleryPhotoRepository via MongoDB (Mongoose).
 * Seeds the starter photos from gallerySeed.js the first time the
 * collection is empty, so the "All" tab never starts out blank.
 */
export class MongoGalleryPhotoRepository extends IGalleryPhotoRepository {
  async ensureSeeded() {
    const count = await GalleryPhotoModel.countDocuments();
    if (count === 0) {
      // order = seed array index, so the initial listing matches the order
      // the photos are authored in gallerySeed.js.
      await GalleryPhotoModel.insertMany(gallerySeed.map((p, i) => ({ ...new GalleryPhoto(p), order: i })));
      return;
    }
    await this.#backfillOrder();
  }

  // Documents written before the `order` field existed have no value for
  // it at all — a plain ascending sort would push all of them to the very
  // front ahead of anything with a real order. Runs once at boot; assigns
  // order by each unordered document's existing createdAt/_id position, so
  // an upgrade doesn't silently reshuffle a deployment's existing photos.
  async #backfillOrder() {
    const unordered = await GalleryPhotoModel.find({ order: { $exists: false } }).sort({ createdAt: 1, _id: 1 });
    if (!unordered.length) return;
    const highest = await GalleryPhotoModel.findOne({ order: { $exists: true } }).sort({ order: -1 });
    let next = typeof highest?.order === "number" ? highest.order + 1 : 0;
    await GalleryPhotoModel.bulkWrite(
      unordered.map((doc) => ({ updateOne: { filter: { _id: doc._id }, update: { order: next++ } } }))
    );
  }

  async list() {
    // createdAt/_id remain as a tiebreaker for any rows that briefly share
    // an order value (e.g. mid-migration).
    const docs = await GalleryPhotoModel.find().sort({ order: 1, createdAt: 1, _id: 1 });
    return docs.map(toRecord);
  }

  async create(photo) {
    // New photos are appended to the end of the manual order, not spliced
    // to the front — the admin dragged everything else into place on purpose.
    const highest = await GalleryPhotoModel.findOne().sort({ order: -1 });
    const order = typeof highest?.order === "number" ? highest.order + 1 : 0;
    const doc = await GalleryPhotoModel.create({ ...photo, order });
    return toRecord(doc);
  }

  async update(id, photo) {
    try {
      const doc = await GalleryPhotoModel.findByIdAndUpdate(
        id,
        { name: photo.name, image: photo.image },
        { new: true, runValidators: true }
      );
      return doc ? toRecord(doc) : null;
    } catch (err) {
      // A malformed id (not a valid ObjectId) throws CastError before ever
      // reaching the database — treat it the same as "not found" rather
      // than a 500, matching what a real invalid id means to the caller.
      if (err.name === "CastError") return null;
      throw err;
    }
  }

  async delete(id) {
    const res = await GalleryPhotoModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  async reorder(orderedIds) {
    const ops = orderedIds
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id, index) => ({ updateOne: { filter: { _id: id }, update: { order: index } } }));
    if (ops.length) await GalleryPhotoModel.bulkWrite(ops);
    return this.list();
  }
}
