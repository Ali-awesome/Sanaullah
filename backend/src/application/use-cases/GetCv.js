export class GetCv {
  /** @param {import('../../domain/repositories/ICvRepository.js').ICvRepository} cvRepository */
  constructor(cvRepository) {
    this.cvRepository = cvRepository;
  }

  async execute() {
    return this.cvRepository.get();
  }
}
