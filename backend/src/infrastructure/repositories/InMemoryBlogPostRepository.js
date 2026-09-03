import { IBlogPostRepository } from "../../domain/repositories/IBlogPostRepository.js";
import { BlogPost } from "../../domain/entities/BlogPost.js";
import { blogSeed } from "../data/blogSeed.js";
import { seedOrdered, listOrdered, createOrdered, updateOrdered, deleteOrdered, reorderOrdered } from "./orderedInMemoryOps.js";

let seq = 1;
const nextId = () => seq++;

/**
 * Adapter: fulfills IBlogPostRepository with a process-memory array,
 * pre-populated from blogSeed. Used automatically when no MongoDB
 * connection is available.
 */
export class InMemoryBlogPostRepository extends IBlogPostRepository {
  constructor() {
    super();
    this.posts = seedOrdered(blogSeed, BlogPost, nextId);
  }

  async list() {
    return listOrdered(this.posts);
  }

  async create(post) {
    return createOrdered(this.posts, nextId, post);
  }

  async update(id, post) {
    return updateOrdered(this.posts, id, post);
  }

  async delete(id) {
    return deleteOrdered(this.posts, id);
  }

  async reorder(orderedIds) {
    return reorderOrdered(this.posts, orderedIds);
  }
}
