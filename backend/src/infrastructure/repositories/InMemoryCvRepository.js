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
    this.current = new CvDocument({
      buffer: readFileSync(DEFAULT_CV_PATH),
      mimetype: "application/pdf",
      filename: "Mohammad_Sanaullah_CV.pdf",
    });
  }

  async get() {
    return this.current;
  }

  async set(cvDocument) {
    this.current = cvDocument;
    return this.current;
  }
}
