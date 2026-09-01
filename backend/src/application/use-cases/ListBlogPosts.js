export class ListBlogPosts {
  /** @param {import('../../domain/repositories/IBlogPostRepository.js').IBlogPostRepository} blogPostRepository */
  constructor(blogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute() {
    return this.blogPostRepository.list();
  }
}
