import { IProfileRepository } from "../../domain/repositories/IProfileRepository.js";
import { profileData } from "../data/profileData.js";

/**
 * Adapter: fulfills IProfileRepository from a static seed file.
 * Swap this for a DB-backed adapter later without changing use cases/routes.
 */
export class StaticProfileRepository extends IProfileRepository {
  async getProfile() {
    return profileData;
  }
}
