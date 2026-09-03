import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";

export class CreatePortfolioProject {
  /** @param {import('../../domain/repositories/IPortfolioProjectRepository.js').IPortfolioProjectRepository} portfolioProjectRepository */
  constructor(portfolioProjectRepository) {
    this.portfolioProjectRepository = portfolioProjectRepository;
  }

  async execute(payload) {
    const project = new PortfolioProject(payload);
    return this.portfolioProjectRepository.create(project);
  }
}
