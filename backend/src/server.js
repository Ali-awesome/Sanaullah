import "dotenv/config";
import { createApp } from "./app.js";
import { tryConnectMongo } from "./infrastructure/db/connect.js";
import { MongoContactRepository } from "./infrastructure/repositories/MongoContactRepository.js";
import { InMemoryContactRepository } from "./infrastructure/repositories/InMemoryContactRepository.js";
import { MongoBlogPostRepository } from "./infrastructure/repositories/MongoBlogPostRepository.js";
import { InMemoryBlogPostRepository } from "./infrastructure/repositories/InMemoryBlogPostRepository.js";
import { MongoGalleryPhotoRepository } from "./infrastructure/repositories/MongoGalleryPhotoRepository.js";
import { InMemoryGalleryPhotoRepository } from "./infrastructure/repositories/InMemoryGalleryPhotoRepository.js";

const PORT = process.env.PORT || 5000;

async function main() {
  const connected = await tryConnectMongo(process.env.MONGODB_URI);

  let contactRepository;
  let blogPostRepository;
  let galleryPhotoRepository;

  if (connected) {
    contactRepository = new MongoContactRepository();
    blogPostRepository = new MongoBlogPostRepository();
    await blogPostRepository.ensureSeeded();
    galleryPhotoRepository = new MongoGalleryPhotoRepository();
    await galleryPhotoRepository.ensureSeeded();
  } else {
    contactRepository = new InMemoryContactRepository();
    blogPostRepository = new InMemoryBlogPostRepository();
    galleryPhotoRepository = new InMemoryGalleryPhotoRepository();
  }

  if (!process.env.ADMIN_TOKEN) {
    console.warn("[server] ADMIN_TOKEN not set — /api/posts (write), /api/gallery (write) and /api/contact (read) are disabled.");
  }

  const app = createApp({ contactRepository, blogPostRepository, galleryPhotoRepository, clientOrigin: process.env.CLIENT_ORIGIN });

  app.listen(PORT, () => {
    console.log(`[server] Portfolio API running on http://localhost:${PORT}`);
  });
}

main();
