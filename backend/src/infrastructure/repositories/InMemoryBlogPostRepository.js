import { IBlogPostRepository } from "../../domain/repositories/IBlogPostRepository.js";
import { BlogPost } from "../../domain/entities/BlogPost.js";
import { blogSeed } from "../data/blogSeed.js";

let seq = 1;

/**
 * Adapter: fulfills IBlogPostRepository with a process-memory array,
 * pre-populated from blogSeed. Used automatically when no MongoDB
 * connection is available.
 */
export class InMemoryBlogPostRepository extends IBlogPostRepository {
  constructor() {
    super();
    this.posts = blogSeed.map((p) => ({ id: String(seq++), ...new BlogPost(p) }));
  }

  async list() {
    // Sort by the numeric id (an insertion sequence), not createdAt alone —
    // two posts created within the same millisecond would otherwise tie and
    // silently fall back to array order, breaking "newest first".
    return [...this.posts].sort((a, b) => Number(b.id) - Number(a.id));
  }

  async create(post) {
    const record = { id: String(seq++), ...post };
    this.posts.push(record);
    return record;
  }

  async delete(id) {
    const before = this.posts.length;
    this.posts = this.posts.filter((p) => p.id !== id);
    return this.posts.length < before;
  }
}
