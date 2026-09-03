export class ReorderPortfolioProjects {
  /** @param {import('../../domain/repositories/IPortfolioProjectRepository.js').IPortfolioProjectRepository} portfolioProjectRepository */
  constructor(portfolioProjectRepository) {
    this.portfolioProjectRepository = portfolioProjectRepository;
  }

  async execute(orderedIds) {
    return this.portfolioProjectRepository.reorder(orderedIds);
  }
}
