import { DomainValidationError } from "../../../domain/entities/ContactMessage.js";

export function makeCvController({ getCv, uploadCv }) {
  return {
    async showMeta(req, res) {
      const cv = await getCv.execute();
      if (!cv) return res.status(404).json({ success: false, message: "No CV has been uploaded yet." });
      res.json({ filename: cv.filename, uploadedAt: cv.uploadedAt });
    },
    async show(req, res) {
      const cv = await getCv.execute();
      if (!cv) return res.status(404).json({ success: false, message: "No CV has been uploaded yet." });
      res.setHeader("Content-Type", cv.mimetype);
      // The link's HTML `download` attribute only forces a save prompt for
      // same-origin URLs — this endpoint is cross-origin from the deployed
      // frontend (a separate Vercel project), where browsers ignore that
      // attribute entirely. `attachment` here is what actually makes
      // "Download CV" download instead of just navigating to the PDF.
      res.setHeader("Content-Disposition", `attachment; filename="${cv.filename}"`);
      res.send(cv.buffer);
    },
    async upload(req, res) {
      try {
        if (!req.file) return res.status(400).json({ success: false, message: "A CV file is required." });
        const cv = await uploadCv.execute({
          buffer: req.file.buffer,
          mimetype: req.file.mimetype,
          filename: req.file.originalname,
        });
        res.status(201).json({ success: true, data: { filename: cv.filename, uploadedAt: cv.uploadedAt } });
      } catch (err) {
        if (err instanceof DomainValidationError) {
          return res.status(400).json({ success: false, message: err.message });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong." });
      }
    },
  };
}
