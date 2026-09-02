import { BlogPost } from "../../domain/entities/BlogPost.js";

export class UpdateBlogPost {
  /** @param {import('../../domain/repositories/IBlogPostRepository.js').IBlogPostRepository} blogPostRepository */
  constructor(blogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(id, payload) {
    const post = new BlogPost(payload);
    return this.blogPostRepository.update(id, post);
  }
}
