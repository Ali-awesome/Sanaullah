import { describe, it, expect, beforeEach } from "vitest";
import { SubmitContactMessage } from "../src/application/use-cases/SubmitContactMessage.js";
import { ListContactMessages } from "../src/application/use-cases/ListContactMessages.js";
import { CreateBlogPost } from "../src/application/use-cases/CreateBlogPost.js";
import { ListBlogPosts } from "../src/application/use-cases/ListBlogPosts.js";
import { UpdateBlogPost } from "../src/application/use-cases/UpdateBlogPost.js";
import { DeleteBlogPost } from "../src/application/use-cases/DeleteBlogPost.js";
import { CreateGalleryPhoto } from "../src/application/use-cases/CreateGalleryPhoto.js";
import { ListGalleryPhotos } from "../src/application/use-cases/ListGalleryPhotos.js";
import { UpdateGalleryPhoto } from "../src/application/use-cases/UpdateGalleryPhoto.js";
import { DeleteGalleryPhoto } from "../src/application/use-cases/DeleteGalleryPhoto.js";
import { InMemoryContactRepository } from "../src/infrastructure/repositories/InMemoryContactRepository.js";
import { InMemoryBlogPostRepository } from "../src/infrastructure/repositories/InMemoryBlogPostRepository.js";
import { InMemoryGalleryPhotoRepository } from "../src/infrastructure/repositories/InMemoryGalleryPhotoRepository.js";
import { DomainValidationError } from "../src/domain/entities/ContactMessage.js";

describe("SubmitContactMessage / ListContactMessages use cases", () => {
  let repo;
  beforeEach(() => {
    repo = new InMemoryContactRepository();
  });

  it("saves a valid message and it shows up newest-first in the list", async () => {
    const submit = new SubmitContactMessage(repo);
    await submit.execute({ name: "Ada", email: "ada@example.com", message: "First message here." });
    await submit.execute({ name: "Bob", email: "bob@example.com", message: "Second message here." });

    const list = new ListContactMessages(repo);
    const all = await list.execute();
    expect(all).toHaveLength(2);
    expect(all[0].name).toBe("Bob");
  });

  it("rejects an invalid message and does not save it", async () => {
    const submit = new SubmitContactMessage(repo);
    await expect(submit.execute({ name: "", email: "bad", message: "x" })).rejects.toThrow(DomainValidationError);
    expect(repo.messages).toHaveLength(0);
  });
});

describe("Blog post use cases", () => {
  let repo;
  beforeEach(() => {
    repo = new InMemoryBlogPostRepository();
  });

  it("lists the seeded posts", async () => {
    const list = new ListBlogPosts(repo);
    const posts = await list.execute();
    expect(posts.length).toBeGreaterThanOrEqual(3);
  });

  it("creates a new post and it appears in the list", async () => {
    const create = new CreateBlogPost(repo);
    const list = new ListBlogPosts(repo);
    const before = (await list.execute()).length;

    await create.execute({ title: "New Post", source: "Blog", date: "2026", summary: "A new update." });

    const after = await list.execute();
    expect(after.length).toBe(before + 1);
    expect(after[0].title).toBe("New Post");
  });

  it("rejects an invalid post", async () => {
    const create = new CreateBlogPost(repo);
    await expect(create.execute({ title: "" })).rejects.toThrow(DomainValidationError);
  });

  it("deletes a post by id", async () => {
    const create = new CreateBlogPost(repo);
    const del = new DeleteBlogPost(repo);
    const created = await create.execute({ title: "Temp", source: "S", date: "2026", summary: "Temp post." });

    const result = await del.execute(created.id);
    expect(result).toBe(true);
    expect(repo.posts.find((p) => p.id === created.id)).toBeUndefined();
  });

  it("updates a post by id, keeping its id and createdAt", async () => {
    const create = new CreateBlogPost(repo);
    const update = new UpdateBlogPost(repo);
    const created = await create.execute({ title: "Original", source: "S", date: "2026", summary: "Original summary." });

    const updated = await update.execute(created.id, {
      title: "Edited",
      source: "S2",
      date: "2027",
      summary: "Edited summary.",
    });

    expect(updated.id).toBe(created.id);
    expect(updated.title).toBe("Edited");
    expect(updated.createdAt).toEqual(created.createdAt);
  });

  it("rejects an update with invalid data", async () => {
    const create = new CreateBlogPost(repo);
    const update = new UpdateBlogPost(repo);
    const created = await create.execute({ title: "Original", source: "S", date: "2026", summary: "Original summary." });

    await expect(update.execute(created.id, { title: "" })).rejects.toThrow(DomainValidationError);
  });

  it("returns null when updating a non-existent post", async () => {
    const update = new UpdateBlogPost(repo);
    const result = await update.execute("does-not-exist", { title: "T", source: "S", summary: "Summary." });
    expect(result).toBeNull();
  });
});

describe("Gallery photo use cases", () => {
  let repo;
  beforeEach(() => {
    repo = new InMemoryGalleryPhotoRepository();
  });

  it("lists the seeded photos", async () => {
    const list = new ListGalleryPhotos(repo);
    const photos = await list.execute();
    expect(photos.length).toBeGreaterThanOrEqual(4);
  });

  it("creates a new photo and it appears in the list", async () => {
    const create = new CreateGalleryPhoto(repo);
    const list = new ListGalleryPhotos(repo);
    const before = (await list.execute()).length;

    await create.execute({ name: "New Photo", image: "/img/portfolio/3.jpg" });

    const after = await list.execute();
    expect(after.length).toBe(before + 1);
    expect(after[0].name).toBe("New Photo");
  });

  it("rejects an invalid photo", async () => {
    const create = new CreateGalleryPhoto(repo);
    await expect(create.execute({ name: "" })).rejects.toThrow(DomainValidationError);
  });

  it("deletes a photo by id", async () => {
    const create = new CreateGalleryPhoto(repo);
    const del = new DeleteGalleryPhoto(repo);
    const created = await create.execute({ name: "Temp", image: "/img/portfolio/3.jpg" });

    const result = await del.execute(created.id);
    expect(result).toBe(true);
    expect(repo.photos.find((p) => p.id === created.id)).toBeUndefined();
  });

  it("updates a photo by id, keeping its id and createdAt", async () => {
    const create = new CreateGalleryPhoto(repo);
    const update = new UpdateGalleryPhoto(repo);
    const created = await create.execute({ name: "Original", image: "/img/portfolio/3.jpg" });

    const updated = await update.execute(created.id, { name: "Edited", image: "/img/portfolio/4.jpg" });

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe("Edited");
    expect(updated.createdAt).toEqual(created.createdAt);
  });

  it("rejects an update with invalid data", async () => {
    const create = new CreateGalleryPhoto(repo);
    const update = new UpdateGalleryPhoto(repo);
    const created = await create.execute({ name: "Original", image: "/img/portfolio/3.jpg" });

    await expect(update.execute(created.id, { name: "" })).rejects.toThrow(DomainValidationError);
  });

  it("returns null when updating a non-existent photo", async () => {
    const update = new UpdateGalleryPhoto(repo);
    const result = await update.execute("does-not-exist", { name: "N", image: "/img/portfolio/3.jpg" });
    expect(result).toBeNull();
  });
});
