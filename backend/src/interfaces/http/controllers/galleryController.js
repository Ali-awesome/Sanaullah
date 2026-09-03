import { makeOrderedResourceController } from "./makeOrderedResourceController.js";

export function makeGalleryController({
  listGalleryPhotos,
  createGalleryPhoto,
  updateGalleryPhoto,
  reorderGalleryPhotos,
  deleteGalleryPhoto,
}) {
  return makeOrderedResourceController({
    list: listGalleryPhotos,
    create: createGalleryPhoto,
    update: updateGalleryPhoto,
    reorder: reorderGalleryPhotos,
    remove: deleteGalleryPhoto,
    notFoundMessage: "Photo not found.",
  });
}
