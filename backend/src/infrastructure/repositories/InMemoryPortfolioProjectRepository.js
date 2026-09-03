import { IPortfolioProjectRepository } from "../../domain/repositories/IPortfolioProjectRepository.js";
import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";
import { portfolioSeed } from "../data/portfolioSeed.js";
import { seedOrdered, listOrdered, createOrdered, updateOrdered, deleteOrdered, reorderOrdered } from "./orderedInMemoryOps.js";

let seq = 1;
const nextId = () => seq++;

/**
 * Adapter: fulfills IPortfolioProjectRepository with a process-memory array,
 * pre-populated from portfolioSeed. Used automatically when no MongoDB
 * connection is available.
 */
export class InMemoryPortfolioProjectRepository extends IPortfolioProjectRepository {
  constructor() {
    super();
    this.projects = seedOrdered(portfolioSeed, PortfolioProject, nextId);
  }

  async list() {
    return listOrdered(this.projects);
  }

  async create(project) {
    return createOrdered(this.projects, nextId, project);
  }

  async update(id, project) {
    return updateOrdered(this.projects, id, project);
  }

  async delete(id) {
    return deleteOrdered(this.projects, id);
  }

  async reorder(orderedIds) {
    return reorderOrdered(this.projects, orderedIds);
  }
}
