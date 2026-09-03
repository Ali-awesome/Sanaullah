import { CvDocument } from "../../domain/entities/CvDocument.js";

export class UploadCv {
  /** @param {import('../../domain/repositories/ICvRepository.js').ICvRepository} cvRepository */
  constructor(cvRepository) {
    this.cvRepository = cvRepository;
  }

  async execute(payload) {
    const cv = new CvDocument(payload);
    return this.cvRepository.set(cv);
  }
}
