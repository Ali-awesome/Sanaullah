import mongoose from "mongoose";
import { IBlogPostRepository } from "../../domain/repositories/IBlogPostRepository.js";
import { blogSeed } from "../data/blogSeed.js";
import { BlogPost } from "../../domain/entities/BlogPost.js";

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  // Optional: some entries (e.g. a course with no fixed completion date)
  // genuinely have nothing meaningful here — see BlogPost.js.
  date: { type: String, default: "" },
  summary: { type: String, required: true },
  image: { type: String, default: "/img/news/1.jpg" },
  link: { type: String, default: null },
  // Manual display order (ascending) — set by the admin panel's drag-to-
  // reorder, not by the user directly. Absent on documents written before
  // this field existed; ensureSeeded() backfills those on boot.
  order: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const BlogPostModel = mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);

function toRecord(doc) {
  const obj = doc.toObject();
  return { ...obj, id: String(obj._id) };
}

/**
 * Adapter: fulfills IBlogPostRepository via MongoDB (Mongoose).
 * Seeds the real publications from blogSeed.js the first time the
 * collection is empty, so the site never starts with no content.
 */
export class MongoBlogPostRepository extends IBlogPostRepository {
  async ensureSeeded() {
    const count = await BlogPostModel.countDocuments();
    if (count === 0) {
      // order = seed array index, so the initial listing matches the order
      // the posts are authored in blogSeed.js.
      await BlogPostModel.insertMany(blogSeed.map((p, i) => ({ ...new BlogPost(p), order: i })));
      return;
    }
    await this.#backfillOrder();
  }

  // Documents written before the `order` field existed have no value for
  // it at all — a plain ascending sort would push all of them to the very
  // front ahead of anything with a real order. Runs once at boot; assigns
  // order by each unordered document's existing createdAt/_id position, so
  // an upgrade doesn't silently reshuffle a deployment's existing posts.
  async #backfillOrder() {
    const unordered = await BlogPostModel.find({ order: { $exists: false } }).sort({ createdAt: 1, _id: 1 });
    if (!unordered.length) return;
    const highest = await BlogPostModel.findOne({ order: { $exists: true } }).sort({ order: -1 });
    let next = typeof highest?.order === "number" ? highest.order + 1 : 0;
    await BlogPostModel.bulkWrite(
      unordered.map((doc) => ({ updateOne: { filter: { _id: doc._id }, update: { order: next++ } } }))
    );
  }

  async list() {
    // createdAt/_id remain as a tiebreaker for any rows that briefly share
    // an order value (e.g. mid-migration).
    const docs = await BlogPostModel.find().sort({ order: 1, createdAt: 1, _id: 1 });
    return docs.map(toRecord);
  }

  async create(post) {
    // New posts are appended to the end of the manual order, not spliced to
    // the front — the admin dragged everything else into place on purpose.
    const highest = await BlogPostModel.findOne().sort({ order: -1 });
    const order = typeof highest?.order === "number" ? highest.order + 1 : 0;
    const doc = await BlogPostModel.create({ ...post, order });
    return toRecord(doc);
  }

  async update(id, post) {
    try {
      const doc = await BlogPostModel.findByIdAndUpdate(
        id,
        { title: post.title, source: post.source, date: post.date, summary: post.summary, image: post.image, link: post.link },
        { new: true, runValidators: true }
      );
      return doc ? toRecord(doc) : null;
    } catch (err) {
      // A malformed id (not a valid ObjectId) throws CastError before ever
      // reaching the database — treat it the same as "not found" rather
      // than a 500, matching what a real invalid id means to the caller.
      if (err.name === "CastError") return null;
      throw err;
    }
  }

  async delete(id) {
    const res = await BlogPostModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  async reorder(orderedIds) {
    const ops = orderedIds
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id, index) => ({ updateOne: { filter: { _id: id }, update: { order: index } } }));
    if (ops.length) await BlogPostModel.bulkWrite(ops);
    return this.list();
  }
}
