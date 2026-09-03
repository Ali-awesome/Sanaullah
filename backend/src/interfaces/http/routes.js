import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "./middleware/requireAdmin.js";

// Memory storage (not disk) — required for serverless: a function instance's
// local disk doesn't persist between invocations, but req.file.buffer is
// available immediately and can go straight into the repository (Mongo or
// in-memory) without ever touching a filesystem.
const upload = multer({ storage: multer.memoryStorage() });

// Wires up the standard list/create/reorder/update/delete routes shared by
// every manually-orderable admin resource. The reorder route is registered
// before the ":id" one — otherwise Express would match "reorder" itself as
// the :id param and the reorder route would never be reached.
function registerOrderedResourceRoutes(router, path, controller) {
  router.get(path, controller.index);
  router.post(path, requireAdmin, controller.create);
  router.put(`${path}/reorder`, requireAdmin, controller.reorder);
  router.put(`${path}/:id`, requireAdmin, controller.update);
  router.delete(`${path}/:id`, requireAdmin, controller.remove);
}

export function buildRoutes({
  profileController,
  contactController,
  blogController,
  galleryController,
  portfolioProjectController,
  cvController,
}) {
  const router = Router();

  router.get("/profile", profileController.show);

  router.post("/contact", contactController.create);
  router.get("/contact", requireAdmin, contactController.index);

  registerOrderedResourceRoutes(router, "/posts", blogController);
  registerOrderedResourceRoutes(router, "/gallery", galleryController);
  registerOrderedResourceRoutes(router, "/portfolio-projects", portfolioProjectController);

  // Public: the CV is meant to be downloadable by anyone, same as it always
  // was as a static file — only *replacing* it is admin-gated. requireAdmin
  // runs before multer parses the multipart body, so an unauthenticated
  // request never gets its (potentially large) file buffered at all.
  router.get("/cv/meta", cvController.showMeta);
  router.get("/cv", cvController.show);
  router.post("/cv", requireAdmin, upload.single("cv"), cvController.upload);

  return router;
}
