import mongoose from "mongoose";
import { IGalleryPhotoRepository } from "../../domain/repositories/IGalleryPhotoRepository.js";
import { gallerySeed } from "../data/gallerySeed.js";
import { GalleryPhoto } from "../../domain/entities/GalleryPhoto.js";

const galleryPhotoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
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
      await GalleryPhotoModel.insertMany(gallerySeed.map((p) => new GalleryPhoto(p)));
    }
  }

  async list() {
    // _id (an ObjectId) is monotonically increasing and breaks ties when two
    // photos share the same createdAt millisecond.
    const docs = await GalleryPhotoModel.find().sort({ createdAt: -1, _id: -1 });
    return docs.map(toRecord);
  }

  async create(photo) {
    const doc = await GalleryPhotoModel.create({ ...photo });
    return toRecord(doc);
  }

  async delete(id) {
    const res = await GalleryPhotoModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }
}
