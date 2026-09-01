export class DeleteBlogPost {
  /** @param {import('../../domain/repositories/IBlogPostRepository.js').IBlogPostRepository} blogPostRepository */
  constructor(blogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(id) {
    return this.blogPostRepository.delete(id);
  }
}
