import mongoose from "mongoose";
import { IBlogPostRepository } from "../../domain/repositories/IBlogPostRepository.js";
import { blogSeed } from "../data/blogSeed.js";
import { BlogPost } from "../../domain/entities/BlogPost.js";

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  date: { type: String, required: true },
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

  async delete(id) {
    const res = await BlogPostModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }
}
