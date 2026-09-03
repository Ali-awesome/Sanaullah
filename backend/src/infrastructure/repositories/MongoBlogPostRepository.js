import mongoose from "mongoose";
import { IBlogPostRepository } from "../../domain/repositories/IBlogPostRepository.js";
import { blogSeed } from "../data/blogSeed.js";
import { BlogPost } from "../../domain/entities/BlogPost.js";
import { ensureSeededOrdered, listOrdered, createOrdered, updateOrdered, deleteOrdered, reorderOrdered } from "./orderedMongoOps.js";

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  // Optional: some entries (e.g. a course with no fixed completion date)
  // genuinely have nothing meaningful here — see BlogPost.js.
  date: { type: String, default: "" },
  summary: { type: String, required: true },
  image: { type: String, default: "/img/news/1.jpg" },
  link: { type: String, default: null },
  // Manual display order (ascending) — set by the admin panel's drag-to-
  // reorder, not by the user directly. Absent on documents written before
  // this field existed; ensureSeeded() backfills those on boot.
  order: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const BlogPostModel = mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);

/**
 * Adapter: fulfills IBlogPostRepository via MongoDB (Mongoose).
 * Seeds the real publications from blogSeed.js the first time the
 * collection is empty, so the site never starts with no content.
 */
export class MongoBlogPostRepository extends IBlogPostRepository {
  async ensureSeeded() {
    return ensureSeededOrdered(BlogPostModel, blogSeed, BlogPost);
  }

  async list() {
    return listOrdered(BlogPostModel);
  }

  async create(post) {
    return createOrdered(BlogPostModel, post);
  }

  async update(id, post) {
    return updateOrdered(BlogPostModel, id, post);
  }

  async delete(id) {
    return deleteOrdered(BlogPostModel, id);
  }

  async reorder(orderedIds) {
    return reorderOrdered(BlogPostModel, orderedIds);
  }
}
