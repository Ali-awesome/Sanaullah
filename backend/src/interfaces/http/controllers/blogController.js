import { makeOrderedResourceController } from "./makeOrderedResourceController.js";

export function makeBlogController({ listBlogPosts, createBlogPost, updateBlogPost, reorderBlogPosts, deleteBlogPost }) {
  return makeOrderedResourceController({
    list: listBlogPosts,
    create: createBlogPost,
    update: updateBlogPost,
    reorder: reorderBlogPosts,
    remove: deleteBlogPost,
    notFoundMessage: "Post not found.",
  });
}
