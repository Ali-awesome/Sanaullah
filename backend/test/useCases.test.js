import { describe, it, expect, beforeEach } from "vitest";
import { SubmitContactMessage } from "../src/application/use-cases/SubmitContactMessage.js";
import { ListContactMessages } from "../src/application/use-cases/ListContactMessages.js";
import { CreateBlogPost } from "../src/application/use-cases/CreateBlogPost.js";
import { ListBlogPosts } from "../src/application/use-cases/ListBlogPosts.js";
import { UpdateBlogPost } from "../src/application/use-cases/UpdateBlogPost.js";
import { ReorderBlogPosts } from "../src/application/use-cases/ReorderBlogPosts.js";
import { DeleteBlogPost } from "../src/application/use-cases/DeleteBlogPost.js";
import { CreateGalleryPhoto } from "../src/application/use-cases/CreateGalleryPhoto.js";
import { ListGalleryPhotos } from "../src/application/use-cases/ListGalleryPhotos.js";
import { UpdateGalleryPhoto } from "../src/application/use-cases/UpdateGalleryPhoto.js";
import { ReorderGalleryPhotos } from "../src/application/use-cases/ReorderGalleryPhotos.js";
import { DeleteGalleryPhoto } from "../src/application/use-cases/DeleteGalleryPhoto.js";
import { InMemoryContactRepository } from "../src/infrastructure/repositories/InMemoryContactRepository.js";
import { InMemoryBlogPostRepository } from "../src/infrastructure/repositories/InMemoryBlogPostRepository.js";
import { InMemoryGalleryPhotoRepository } from "../src/infrastructure/repositories/InMemoryGalleryPhotoRepository.js";
import { CreatePortfolioProject } from "../src/application/use-cases/CreatePortfolioProject.js";
import { ListPortfolioProjects } from "../src/application/use-cases/ListPortfolioProjects.js";
import { UpdatePortfolioProject } from "../src/application/use-cases/UpdatePortfolioProject.js";
import { ReorderPortfolioProjects } from "../src/application/use-cases/ReorderPortfolioProjects.js";
import { DeletePortfolioProject } from "../src/application/use-cases/DeletePortfolioProject.js";
import { InMemoryPortfolioProjectRepository } from "../src/infrastructure/repositories/InMemoryPortfolioProjectRepository.js";
import { GetCv } from "../src/application/use-cases/GetCv.js";
import { UploadCv } from "../src/application/use-cases/UploadCv.js";
import { InMemoryCvRepository } from "../src/infrastructure/repositories/InMemoryCvRepository.js";
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

  it("creates a new post and it appears at the end of the manually-ordered list", async () => {
    const create = new CreateBlogPost(repo);
    const list = new ListBlogPosts(repo);
    const before = (await list.execute()).length;

    await create.execute({ title: "New Post", source: "Blog", date: "2026", summary: "A new update." });

    const after = await list.execute();
    expect(after.length).toBe(before + 1);
    expect(after[after.length - 1].title).toBe("New Post");
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

  it("reorders posts to match the given id order", async () => {
    const list = new ListBlogPosts(repo);
    const reorder = new ReorderBlogPosts(repo);
    const before = await list.execute();
    const reversedIds = [...before].reverse().map((p) => p.id);

    const after = await reorder.execute(reversedIds);
    expect(after.map((p) => p.id)).toEqual(reversedIds);

    // The new order sticks for subsequent listings, not just the response
    // from reorder() itself.
    const relisted = await list.execute();
    expect(relisted.map((p) => p.id)).toEqual(reversedIds);
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

  it("creates a new photo and it appears at the end of the manually-ordered list", async () => {
    const create = new CreateGalleryPhoto(repo);
    const list = new ListGalleryPhotos(repo);
    const before = (await list.execute()).length;

    await create.execute({ name: "New Photo", image: "/img/portfolio/3.jpg" });

    const after = await list.execute();
    expect(after.length).toBe(before + 1);
    expect(after[after.length - 1].name).toBe("New Photo");
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

  it("reorders photos to match the given id order", async () => {
    const list = new ListGalleryPhotos(repo);
    const reorder = new ReorderGalleryPhotos(repo);
    const before = await list.execute();
    const reversedIds = [...before].reverse().map((p) => p.id);

    const after = await reorder.execute(reversedIds);
    expect(after.map((p) => p.id)).toEqual(reversedIds);

    // The new order sticks for subsequent listings, not just the response
    // from reorder() itself.
    const relisted = await list.execute();
    expect(relisted.map((p) => p.id)).toEqual(reversedIds);
  });
});

describe("Portfolio project use cases", () => {
  let repo;
  beforeEach(() => {
    repo = new InMemoryPortfolioProjectRepository();
  });

  it("lists the seeded projects", async () => {
    const list = new ListPortfolioProjects(repo);
    const projects = await list.execute();
    expect(projects.length).toBeGreaterThanOrEqual(4);
  });

  it("creates a new project and it appears at the end of the manually-ordered list", async () => {
    const create = new CreatePortfolioProject(repo);
    const list = new ListPortfolioProjects(repo);
    const before = (await list.execute()).length;

    await create.execute({ title: "New Project", category: "Research", summary: "A new project." });

    const after = await list.execute();
    expect(after.length).toBe(before + 1);
    expect(after[after.length - 1].title).toBe("New Project");
  });

  it("rejects an invalid project", async () => {
    const create = new CreatePortfolioProject(repo);
    await expect(create.execute({ title: "" })).rejects.toThrow(DomainValidationError);
  });

  it("updates a project by id, keeping its id and createdAt", async () => {
    const create = new CreatePortfolioProject(repo);
    const update = new UpdatePortfolioProject(repo);
    const created = await create.execute({ title: "Original", category: "Research", summary: "Original summary." });

    const updated = await update.execute(created.id, { title: "Edited", category: "AI/ML", summary: "Edited summary." });

    expect(updated.id).toBe(created.id);
    expect(updated.title).toBe("Edited");
    expect(updated.createdAt).toEqual(created.createdAt);
  });

  it("deletes a project by id", async () => {
    const create = new CreatePortfolioProject(repo);
    const del = new DeletePortfolioProject(repo);
    const created = await create.execute({ title: "Temp", category: "Research", summary: "Temp project." });

    const result = await del.execute(created.id);
    expect(result).toBe(true);
    expect(repo.projects.find((p) => p.id === created.id)).toBeUndefined();
  });

  it("reorders projects to match the given id order", async () => {
    const list = new ListPortfolioProjects(repo);
    const reorder = new ReorderPortfolioProjects(repo);
    const before = await list.execute();
    const reversedIds = [...before].reverse().map((p) => p.id);

    const after = await reorder.execute(reversedIds);
    expect(after.map((p) => p.id)).toEqual(reversedIds);
  });
});

describe("Cv use cases", () => {
  let repo;
  beforeEach(() => {
    repo = new InMemoryCvRepository();
  });

  it("starts out with the bundled default CV", async () => {
    const get = new GetCv(repo);
    const cv = await get.execute();
    expect(cv).not.toBeNull();
    expect(cv.mimetype).toBe("application/pdf");
  });

  it("replaces the current CV on upload", async () => {
    const upload = new UploadCv(repo);
    const get = new GetCv(repo);

    await upload.execute({ buffer: Buffer.from("%PDF-1.4 new"), mimetype: "application/pdf", filename: "New_CV.pdf" });

    const cv = await get.execute();
    expect(cv.filename).toBe("New_CV.pdf");
    expect(cv.buffer.toString()).toBe("%PDF-1.4 new");
  });

  it("rejects a non-PDF upload, leaving the current CV untouched", async () => {
    const upload = new UploadCv(repo);
    const get = new GetCv(repo);
    const before = await get.execute();

    await expect(
      upload.execute({ buffer: Buffer.from("hi"), mimetype: "image/png", filename: "not-a-cv.png" })
    ).rejects.toThrow(DomainValidationError);

    const after = await get.execute();
    expect(after.filename).toBe(before.filename);
  });
});
