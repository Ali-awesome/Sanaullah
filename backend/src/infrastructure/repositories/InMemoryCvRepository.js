import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { ICvRepository } from "../../domain/repositories/ICvRepository.js";
import { CvDocument } from "../../domain/entities/CvDocument.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CV_PATH = path.join(__dirname, "..", "data", "assets", "default-cv.pdf");

/**
 * Adapter: fulfills ICvRepository with a process-memory value, starting out
 * as the bundled default CV so "Download CV" always works even before an
 * admin has ever uploaded a replacement. Used automatically when no MongoDB
 * connection is available.
 */
export class InMemoryCvRepository extends ICvRepository {
  constructor() {
    super();
    // Reading the bundled PDF must never be allowed to throw here: this
    // constructor runs during the shared, once-per-instance app setup (see
    // api/index.js's cached `appPromise`), so an uncaught error would take
    // down every route — not just CV downloads — for the rest of that
    // instance's life. A serverless deployment's static-file bundling can
    // fail to include this asset even when it works locally (e.g. if
    // Vercel's file tracer doesn't pick it up), so this has to degrade to
    // "no CV yet" (cvController already returns 404 for that) rather than
    // crash the whole API.
    try {
      this.current = new CvDocument({
        buffer: readFileSync(DEFAULT_CV_PATH),
        mimetype: "application/pdf",
        filename: "Mohammad_Sanaullah_CV.pdf",
      });
    } catch (err) {
      console.warn(`[cv] Could not read the bundled default CV (${err.message}). Starting with no CV until one is uploaded.`);
      this.current = null;
    }
  }

  async get() {
    return this.current;
  }

  async set(cvDocument) {
    this.current = cvDocument;
    return this.current;
  }
}
