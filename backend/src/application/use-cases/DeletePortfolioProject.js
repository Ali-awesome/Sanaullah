export class DeletePortfolioProject {
  /** @param {import('../../domain/repositories/IPortfolioProjectRepository.js').IPortfolioProjectRepository} portfolioProjectRepository */
  constructor(portfolioProjectRepository) {
    this.portfolioProjectRepository = portfolioProjectRepository;
  }

  async execute(id) {
    return this.portfolioProjectRepository.delete(id);
  }
}
