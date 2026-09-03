import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";

export class UpdatePortfolioProject {
  /** @param {import('../../domain/repositories/IPortfolioProjectRepository.js').IPortfolioProjectRepository} portfolioProjectRepository */
  constructor(portfolioProjectRepository) {
    this.portfolioProjectRepository = portfolioProjectRepository;
  }

  async execute(id, payload) {
    const project = new PortfolioProject(payload);
    return this.portfolioProjectRepository.update(id, project);
  }
}
