import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { ICvRepository } from "../../domain/repositories/ICvRepository.js";
import { CvDocument } from "../../domain/entities/CvDocument.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CV_PATH = path.join(__dirname, "..", "data", "assets", "default-cv.pdf");

// A single fixed-id document ("current") rather than a collection — there's
// only ever one CV, and "upload" always means "replace the current one".
const cvSchema = new mongoose.Schema({
  _id: { type: String, default: "current" },
  buffer: { type: Buffer, required: true },
  mimetype: { type: String, required: true },
  filename: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const CvModel = mongoose.models.Cv || mongoose.model("Cv", cvSchema);

function toDocument(doc) {
  return { buffer: doc.buffer, mimetype: doc.mimetype, filename: doc.filename, uploadedAt: doc.uploadedAt };
}

/**
 * Adapter: fulfills ICvRepository via MongoDB (Mongoose), storing the PDF
 * directly as a Buffer field — comfortably under MongoDB's 16MB document
 * limit for a CV, and simpler than GridFS for a single small file.
 */
export class MongoCvRepository extends ICvRepository {
  async ensureSeeded() {
    const count = await CvModel.countDocuments();
    if (count > 0) return;
    // Seeds the bundled default CV so "Download CV" always works even
    // before an admin has ever uploaded a replacement. Must not throw:
    // this runs during the shared, once-per-instance app setup (see
    // api/index.js's cached `appPromise`), so an uncaught error here would
    // take down every route, not just CV downloads. A serverless
    // deployment's static-file bundling can fail to include this asset
    // even when it works locally — degrade to "no CV yet" (cvController
    // already returns 404 for that) rather than crash the whole API.
    try {
      const seed = new CvDocument({
        buffer: readFileSync(DEFAULT_CV_PATH),
        mimetype: "application/pdf",
        filename: "Mohammad_Sanaullah_CV.pdf",
      });
      await CvModel.create({ _id: "current", ...seed });
    } catch (err) {
      console.warn(`[cv] Could not seed the bundled default CV (${err.message}). Starting with no CV until one is uploaded.`);
    }
  }

  async get() {
    const doc = await CvModel.findById("current");
    return doc ? toDocument(doc) : null;
  }

  async set(cvDocument) {
    const doc = await CvModel.findByIdAndUpdate(
      "current",
      { buffer: cvDocument.buffer, mimetype: cvDocument.mimetype, filename: cvDocument.filename, uploadedAt: cvDocument.uploadedAt },
      { upsert: true, new: true }
    );
    return toDocument(doc);
  }
}
