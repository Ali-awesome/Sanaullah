import { DomainValidationError } from "../../../domain/entities/ContactMessage.js";

/**
 * Builds the index/create/update/reorder/remove HTTP handlers shared by
 * every manually-orderable admin resource (posts, gallery photos, portfolio
 * projects) — the request/response shape and error handling is identical
 * across all three, so it lives here once instead of being copy-pasted per
 * resource. `notFoundMessage` is the only resource-specific text.
 */
export function makeOrderedResourceController({ list, create, update, reorder, remove, notFoundMessage }) {
  return {
    async index(req, res) {
      const items = await list.execute();
      res.json(items);
    },
    async create(req, res) {
      try {
        const item = await create.execute(req.body || {});
        res.status(201).json({ success: true, data: item });
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
        const item = await update.execute(req.params.id, req.body || {});
        if (!item) return res.status(404).json({ success: false, message: notFoundMessage });
        res.json({ success: true, data: item });
      } catch (err) {
        if (err instanceof DomainValidationError) {
          return res.status(400).json({ success: false, message: err.message });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong." });
      }
    },
    async reorder(req, res) {
      const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
      const items = await reorder.execute(ids);
      res.json({ success: true, data: items });
    },
    async remove(req, res) {
      const deleted = await remove.execute(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: notFoundMessage });
      res.json({ success: true });
    },
  };
}
