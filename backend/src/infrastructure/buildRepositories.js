import { tryConnectMongo } from "./db/connect.js";
import { MongoContactRepository } from "./repositories/MongoContactRepository.js";
import { InMemoryContactRepository } from "./repositories/InMemoryContactRepository.js";
import { MongoBlogPostRepository } from "./repositories/MongoBlogPostRepository.js";
import { InMemoryBlogPostRepository } from "./repositories/InMemoryBlogPostRepository.js";
import { MongoGalleryPhotoRepository } from "./repositories/MongoGalleryPhotoRepository.js";
import { InMemoryGalleryPhotoRepository } from "./repositories/InMemoryGalleryPhotoRepository.js";
import { MongoPortfolioProjectRepository } from "./repositories/MongoPortfolioProjectRepository.js";
import { InMemoryPortfolioProjectRepository } from "./repositories/InMemoryPortfolioProjectRepository.js";
import { MongoCvRepository } from "./repositories/MongoCvRepository.js";
import { InMemoryCvRepository } from "./repositories/InMemoryCvRepository.js";

/**
 * Picks MongoDB-backed or in-memory repositories (falling back automatically
 * when MONGODB_URI is unset/unreachable) and seeds each one — shared by
 * server.js (long-running) and api/index.js (Vercel serverless), which
 * would otherwise both need this exact same connect-then-choose-then-seed
 * sequence for all five repositories.
 */
export async function buildRepositories({ onFallback } = {}) {
  const connected = await tryConnectMongo(process.env.MONGODB_URI);

  if (connected) {
    const blogPostRepository = new MongoBlogPostRepository();
    await blogPostRepository.ensureSeeded();
    const galleryPhotoRepository = new MongoGalleryPhotoRepository();
    await galleryPhotoRepository.ensureSeeded();
    const portfolioProjectRepository = new MongoPortfolioProjectRepository();
    await portfolioProjectRepository.ensureSeeded();
    const cvRepository = new MongoCvRepository();
    await cvRepository.ensureSeeded();

    return {
      contactRepository: new MongoContactRepository(),
      blogPostRepository,
      galleryPhotoRepository,
      portfolioProjectRepository,
      cvRepository,
    };
  }

  onFallback?.();
  return {
    contactRepository: new InMemoryContactRepository(),
    blogPostRepository: new InMemoryBlogPostRepository(),
    galleryPhotoRepository: new InMemoryGalleryPhotoRepository(),
    portfolioProjectRepository: new InMemoryPortfolioProjectRepository(),
    cvRepository: new InMemoryCvRepository(),
  };
}
