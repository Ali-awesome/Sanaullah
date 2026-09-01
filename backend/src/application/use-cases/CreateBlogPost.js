import { BlogPost } from "../../domain/entities/BlogPost.js";

export class CreateBlogPost {
  /** @param {import('../../domain/repositories/IBlogPostRepository.js').IBlogPostRepository} blogPostRepository */
  constructor(blogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(payload) {
    const post = new BlogPost(payload);
    return this.blogPostRepository.create(post);
  }
}
