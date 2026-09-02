export class ReorderBlogPosts {
  /** @param {import('../../domain/repositories/IBlogPostRepository.js').IBlogPostRepository} blogPostRepository */
  constructor(blogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(orderedIds) {
    return this.blogPostRepository.reorder(orderedIds);
  }
}
