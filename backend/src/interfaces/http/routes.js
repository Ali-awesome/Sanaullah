import { Router } from "express";
import { requireAdmin } from "./middleware/requireAdmin.js";

export function buildRoutes({ profileController, contactController, blogController, galleryController }) {
  const router = Router();

  router.get("/profile", profileController.show);

  router.post("/contact", contactController.create);
  router.get("/contact", requireAdmin, contactController.index);

  router.get("/posts", blogController.index);
  router.post("/posts", requireAdmin, blogController.create);
  router.put("/posts/:id", requireAdmin, blogController.update);
  router.delete("/posts/:id", requireAdmin, blogController.remove);

  router.get("/gallery", galleryController.index);
  router.post("/gallery", requireAdmin, galleryController.create);
  router.put("/gallery/:id", requireAdmin, galleryController.update);
  router.delete("/gallery/:id", requireAdmin, galleryController.remove);

  return router;
}
