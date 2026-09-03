import { makeOrderedResourceController } from "./makeOrderedResourceController.js";

export function makePortfolioProjectController({
  listPortfolioProjects,
  createPortfolioProject,
  updatePortfolioProject,
  reorderPortfolioProjects,
  deletePortfolioProject,
}) {
  return makeOrderedResourceController({
    list: listPortfolioProjects,
    create: createPortfolioProject,
    update: updatePortfolioProject,
    reorder: reorderPortfolioProjects,
    remove: deletePortfolioProject,
    notFoundMessage: "Project not found.",
  });
}
