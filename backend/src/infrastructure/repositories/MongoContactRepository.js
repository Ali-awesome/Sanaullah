import mongoose from "mongoose";
import { IContactRepository } from "../../domain/repositories/IContactRepository.js";

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ContactMessageModel =
  mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema);

/**
 * Adapter: fulfills IContactRepository via MongoDB (Mongoose).
 */
export class MongoContactRepository extends IContactRepository {
  async save(contactMessage) {
    const doc = await ContactMessageModel.create({ ...contactMessage });
    return doc.toObject();
  }

  async list() {
    // _id (an ObjectId) is monotonically increasing and breaks ties when two
    // messages share the same createdAt millisecond.
    const docs = await ContactMessageModel.find().sort({ createdAt: -1, _id: -1 });
    return docs.map((d) => d.toObject());
  }
}
