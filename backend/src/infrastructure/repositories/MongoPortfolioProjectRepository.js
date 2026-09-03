import mongoose from "mongoose";
import { IPortfolioProjectRepository } from "../../domain/repositories/IPortfolioProjectRepository.js";
import { portfolioSeed } from "../data/portfolioSeed.js";
import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";
import { ensureSeededOrdered, listOrdered, createOrdered, updateOrdered, deleteOrdered, reorderOrdered } from "./orderedMongoOps.js";

const portfolioProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  client: { type: String, default: "" },
  date: { type: String, default: "" },
  image: { type: String, default: "/img/portfolio/3.jpg" },
  summary: { type: String, required: true },
  // A link to the original work (a paper, a live product, a repo).
  link: { type: String, default: null },
  images: { type: [String], default: [] },
  // Manual display order (ascending) — set by the admin panel's drag-to-
  // reorder, not by the user directly. Absent on documents written before
  // this field existed; ensureSeeded() backfills those on boot.
  order: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const PortfolioProjectModel =
  mongoose.models.PortfolioProject || mongoose.model("PortfolioProject", portfolioProjectSchema);

/**
 * Adapter: fulfills IPortfolioProjectRepository via MongoDB (Mongoose).
 * Seeds the real projects from portfolioSeed.js the first time the
 * collection is empty, so the category tabs never start out blank.
 */
export class MongoPortfolioProjectRepository extends IPortfolioProjectRepository {
  async ensureSeeded() {
    return ensureSeededOrdered(PortfolioProjectModel, portfolioSeed, PortfolioProject);
  }

  async list() {
    return listOrdered(PortfolioProjectModel);
  }

  async create(project) {
    return createOrdered(PortfolioProjectModel, project);
  }

  async update(id, project) {
    return updateOrdered(PortfolioProjectModel, id, project);
  }

  async delete(id) {
    return deleteOrdered(PortfolioProjectModel, id);
  }

  async reorder(orderedIds) {
    return reorderOrdered(PortfolioProjectModel, orderedIds);
  }
}
