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
      await BlogPostModel.insertMany(blogSeed.map((p) => new BlogPost(p)));
    }
  }

  async list() {
    // _id (an ObjectId) is monotonically increasing and breaks ties when two
    // posts share the same createdAt millisecond.
    const docs = await BlogPostModel.find().sort({ createdAt: -1, _id: -1 });
    return docs.map(toRecord);
  }

  async create(post) {
    const doc = await BlogPostModel.create({ ...post });
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
}
