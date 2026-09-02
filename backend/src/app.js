import express from "express";
import cors from "cors";

import { GetProfile } from "./application/use-cases/GetProfile.js";
import { SubmitContactMessage } from "./application/use-cases/SubmitContactMessage.js";
import { ListContactMessages } from "./application/use-cases/ListContactMessages.js";
import { ListBlogPosts } from "./application/use-cases/ListBlogPosts.js";
import { CreateBlogPost } from "./application/use-cases/CreateBlogPost.js";
import { UpdateBlogPost } from "./application/use-cases/UpdateBlogPost.js";
import { ReorderBlogPosts } from "./application/use-cases/ReorderBlogPosts.js";
import { DeleteBlogPost } from "./application/use-cases/DeleteBlogPost.js";
import { ListGalleryPhotos } from "./application/use-cases/ListGalleryPhotos.js";
import { CreateGalleryPhoto } from "./application/use-cases/CreateGalleryPhoto.js";
import { UpdateGalleryPhoto } from "./application/use-cases/UpdateGalleryPhoto.js";
import { ReorderGalleryPhotos } from "./application/use-cases/ReorderGalleryPhotos.js";
import { DeleteGalleryPhoto } from "./application/use-cases/DeleteGalleryPhoto.js";

import { StaticProfileRepository } from "./infrastructure/repositories/StaticProfileRepository.js";
import { makeProfileController } from "./interfaces/http/controllers/profileController.js";
import { makeContactController } from "./interfaces/http/controllers/contactController.js";
import { makeBlogController } from "./interfaces/http/controllers/blogController.js";
import { makeGalleryController } from "./interfaces/http/controllers/galleryController.js";
import { buildRoutes } from "./interfaces/http/routes.js";

/**
 * Composition root: wires domain ports to infrastructure adapters and
 * builds the Express app. `contactRepository`, `blogPostRepository`, and
 * `galleryPhotoRepository` are injected by server.js (or by tests) once
 * it's known whether MongoDB is available — this is also what lets tests
 * run against fast in-memory repositories without touching a real database.
 */
export function createApp({ contactRepository, blogPostRepository, galleryPhotoRepository, clientOrigin }) {
  const app = express();
  app.use(cors({ origin: buildCorsOrigin(clientOrigin) }));
  app.use(express.json());

  const getProfile = new GetProfile(new StaticProfileRepository());
  const submitContactMessage = new SubmitContactMessage(contactRepository);
  const listContactMessages = new ListContactMessages(contactRepository);
  const listBlogPosts = new ListBlogPosts(blogPostRepository);
  const createBlogPost = new CreateBlogPost(blogPostRepository);
  const updateBlogPost = new UpdateBlogPost(blogPostRepository);
  const reorderBlogPosts = new ReorderBlogPosts(blogPostRepository);
  const deleteBlogPost = new DeleteBlogPost(blogPostRepository);
  const listGalleryPhotos = new ListGalleryPhotos(galleryPhotoRepository);
  const createGalleryPhoto = new CreateGalleryPhoto(galleryPhotoRepository);
  const updateGalleryPhoto = new UpdateGalleryPhoto(galleryPhotoRepository);
  const reorderGalleryPhotos = new ReorderGalleryPhotos(galleryPhotoRepository);
  const deleteGalleryPhoto = new DeleteGalleryPhoto(galleryPhotoRepository);

  const profileController = makeProfileController(getProfile);
  const contactController = makeContactController({ submitContactMessage, listContactMessages });
  const blogController = makeBlogController({
    listBlogPosts,
    createBlogPost,
    updateBlogPost,
    reorderBlogPosts,
    deleteBlogPost,
  });
  const galleryController = makeGalleryController({
    listGalleryPhotos,
    createGalleryPhoto,
    updateGalleryPhoto,
    reorderGalleryPhotos,
    deleteGalleryPhoto,
  });

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", buildRoutes({ profileController, contactController, blogController, galleryController }));

  return app;
}

/**
 * CLIENT_ORIGIN may be unset (dev fallback: allow any origin), a single URL,
 * or a comma-separated list — useful in production where the frontend can
 * be reachable from more than one origin at once (a custom domain plus a
 * platform's own preview/deploy URLs, e.g. Vercel or Netlify branch previews).
 */
export function buildCorsOrigin(clientOrigin) {
  if (!clientOrigin) return "*";
  const allowed = clientOrigin.split(",").map((o) => o.trim()).filter(Boolean);
  if (allowed.length <= 1) return allowed[0] || "*";
  return (origin, callback) => {
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  };
}
