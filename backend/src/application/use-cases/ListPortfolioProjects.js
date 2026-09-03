export class ListPortfolioProjects {
  /** @param {import('../../domain/repositories/IPortfolioProjectRepository.js').IPortfolioProjectRepository} portfolioProjectRepository */
  constructor(portfolioProjectRepository) {
    this.portfolioProjectRepository = portfolioProjectRepository;
  }

  async execute() {
    return this.portfolioProjectRepository.list();
  }
}
