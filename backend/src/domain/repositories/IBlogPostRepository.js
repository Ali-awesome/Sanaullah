/**
 * Port (interface) for storing and reading blog/publication posts.
 */
export class IBlogPostRepository {
  async list() {
    throw new Error("Not implemented");
  }
  /** @param {import('../entities/BlogPost.js').BlogPost} post */
  async create(_post) {
    throw new Error("Not implemented");
  }
  async delete(_id) {
    throw new Error("Not implemented");
  }
}
