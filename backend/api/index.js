import "dotenv/config";
import { createApp } from "../src/app.js";
import { tryConnectMongo } from "../src/infrastructure/db/connect.js";
import { MongoContactRepository } from "../src/infrastructure/repositories/MongoContactRepository.js";
import { InMemoryContactRepository } from "../src/infrastructure/repositories/InMemoryContactRepository.js";
import { MongoBlogPostRepository } from "../src/infrastructure/repositories/MongoBlogPostRepository.js";
import { InMemoryBlogPostRepository } from "../src/infrastructure/repositories/InMemoryBlogPostRepository.js";
import { MongoGalleryPhotoRepository } from "../src/infrastructure/repositories/MongoGalleryPhotoRepository.js";
import { InMemoryGalleryPhotoRepository } from "../src/infrastructure/repositories/InMemoryGalleryPhotoRepository.js";

/**
 * Vercel serverless entrypoint (see backend/vercel.json, which routes every
 * request here). A serverless function may be reused ("warm") across
 * requests on the same instance, or may cold-start fresh at any time — so
 * the Express app and its DB connection are built once and cached at
 * module scope (`appPromise`), not per-request. On a cold start, MongoDB
 * must be reachable via MONGODB_URI: the in-memory repository fallback
 * that's convenient for local dev is NOT durable here, since a fresh
 * instance starts with empty memory and instances aren't shared across
 * regions/scale-to-zero cycles. Set MONGODB_URI for any real deployment.
 */
let appPromise;

async function buildApp() {
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
    console.warn("[api] No MongoDB connection — using in-memory storage, which will NOT persist between invocations.");
    contactRepository = new InMemoryContactRepository();
    blogPostRepository = new InMemoryBlogPostRepository();
    galleryPhotoRepository = new InMemoryGalleryPhotoRepository();
  }

  return createApp({ contactRepository, blogPostRepository, galleryPhotoRepository, clientOrigin: process.env.CLIENT_ORIGIN });
}

export default async function handler(req, res) {
  if (!appPromise) appPromise = buildApp();
  const app = await appPromise;
  return app(req, res);
}
