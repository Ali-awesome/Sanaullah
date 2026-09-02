import { Router } from "express";
import { requireAdmin } from "./middleware/requireAdmin.js";

export function buildRoutes({ profileController, contactController, blogController, galleryController }) {
  const router = Router();

  router.get("/profile", profileController.show);

  router.post("/contact", contactController.create);
  router.get("/contact", requireAdmin, contactController.index);

  router.get("/posts", blogController.index);
  router.post("/posts", requireAdmin, blogController.create);
  // Must come before "/posts/:id" — otherwise Express would match
  // "reorder" as the :id param and this route would never be reached.
  router.put("/posts/reorder", requireAdmin, blogController.reorder);
  router.put("/posts/:id", requireAdmin, blogController.update);
  router.delete("/posts/:id", requireAdmin, blogController.remove);

  router.get("/gallery", galleryController.index);
  router.post("/gallery", requireAdmin, galleryController.create);
  // Must come before "/gallery/:id" — same reason as "/posts/reorder" above.
  router.put("/gallery/reorder", requireAdmin, galleryController.reorder);
  router.put("/gallery/:id", requireAdmin, galleryController.update);
  router.delete("/gallery/:id", requireAdmin, galleryController.remove);

  return router;
}
