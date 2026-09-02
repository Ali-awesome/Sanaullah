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
    // `order` starts out matching blogSeed's own authored order (its array
    // index) — admin drag-reordering is the only thing that ever changes it
    // after that.
    this.posts = blogSeed.map((p, i) => ({ id: String(seq++), ...new BlogPost(p), order: i }));
  }

  async list() {
    return [...this.posts].sort((a, b) => a.order - b.order);
  }

  async create(post) {
    // New posts are appended to the end of the manual order, not spliced to
    // the front — the admin dragged everything else into place on purpose.
    const record = { id: String(seq++), ...post, order: this.posts.length };
    this.posts.push(record);
    return record;
  }

  async update(id, post) {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    // Keep the original id, createdAt, and manual order — editing a post's
    // content shouldn't change its identity or reshuffle its position.
    const record = { ...post, id, createdAt: this.posts[index].createdAt, order: this.posts[index].order };
    this.posts[index] = record;
    return record;
  }

  async delete(id) {
    const before = this.posts.length;
    this.posts = this.posts.filter((p) => p.id !== id);
    return this.posts.length < before;
  }

  async reorder(orderedIds) {
    orderedIds.forEach((id, index) => {
      const post = this.posts.find((p) => p.id === id);
      if (post) post.order = index;
    });
    return this.list();
  }
}
