import { DomainValidationError } from "../../../domain/entities/ContactMessage.js";

export function makeBlogController({ listBlogPosts, createBlogPost, updateBlogPost, reorderBlogPosts, deleteBlogPost }) {
  return {
    async index(req, res) {
      const posts = await listBlogPosts.execute();
      res.json(posts);
    },
    async reorder(req, res) {
      const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
      const posts = await reorderBlogPosts.execute(ids);
      res.json({ success: true, data: posts });
    },
    async create(req, res) {
      try {
        const post = await createBlogPost.execute(req.body || {});
        res.status(201).json({ success: true, data: post });
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
        const post = await updateBlogPost.execute(req.params.id, req.body || {});
        if (!post) return res.status(404).json({ success: false, message: "Post not found." });
        res.json({ success: true, data: post });
      } catch (err) {
        if (err instanceof DomainValidationError) {
          return res.status(400).json({ success: false, message: err.message });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong." });
      }
    },
    async remove(req, res) {
      const deleted = await deleteBlogPost.execute(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Post not found." });
      res.json({ success: true });
    },
  };
}
