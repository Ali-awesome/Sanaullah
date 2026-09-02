import { DomainValidationError } from "../../../domain/entities/ContactMessage.js";

export function makeGalleryController({ listGalleryPhotos, createGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto }) {
  return {
    async index(req, res) {
      const photos = await listGalleryPhotos.execute();
      res.json(photos);
    },
    async create(req, res) {
      try {
        const photo = await createGalleryPhoto.execute(req.body || {});
        res.status(201).json({ success: true, data: photo });
      } catch (err) {
        if (err instanceof DomainValidationError) {
          return res.status(400).json({ success: false, message: err.message });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong." });
      }
    },
    async update(req, res) {
      try {
        const photo = await updateGalleryPhoto.execute(req.params.id, req.body || {});
        if (!photo) return res.status(404).json({ success: false, message: "Photo not found." });
        res.json({ success: true, data: photo });
      } catch (err) {
        if (err instanceof DomainValidationError) {
          return res.status(400).json({ success: false, message: err.message });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong." });
      }
    },
    async remove(req, res) {
      const deleted = await deleteGalleryPhoto.execute(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Photo not found." });
      res.json({ success: true });
    },
  };
}
