/**
 * Use case: fetch the portfolio owner's profile.
 * Depends only on the IProfileRepository port, not on any concrete storage.
 */
export class GetProfile {
  /** @param {import('../../domain/repositories/IProfileRepository.js').IProfileRepository} profileRepository */
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute() {
    return this.profileRepository.getProfile();
  }
}
