import { describe, it, expect } from "vitest";
import { ContactMessage, DomainValidationError } from "../src/domain/entities/ContactMessage.js";
import { BlogPost } from "../src/domain/entities/BlogPost.js";
import { GalleryPhoto } from "../src/domain/entities/GalleryPhoto.js";

describe("ContactMessage entity", () => {
  it("accepts a valid message", () => {
    const msg = new ContactMessage({ name: "Ada", email: "ada@example.com", message: "Hello there!" });
    expect(msg.name).toBe("Ada");
    expect(msg.email).toBe("ada@example.com");
    expect(msg.createdAt).toBeInstanceOf(Date);
  });

  it("rejects a missing name", () => {
    expect(() => new ContactMessage({ name: "", email: "a@b.com", message: "hello there" })).toThrow(
      DomainValidationError
    );
  });

  it("rejects an invalid email", () => {
    expect(() => new ContactMessage({ name: "Ada", email: "not-an-email", message: "hello there" })).toThrow(
      DomainValidationError
    );
  });

  it("rejects a too-short message", () => {
    expect(() => new ContactMessage({ name: "Ada", email: "a@b.com", message: "hi" })).toThrow(
      DomainValidationError
    );
  });
});

describe("BlogPost entity", () => {
  const base = { title: "Title", source: "Source", date: "2026", summary: "A short summary." };

  it("accepts a valid post and fills in defaults", () => {
    const post = new BlogPost(base);
    expect(post.title).toBe("Title");
    expect(post.image).toBe("/img/news/1.jpg");
    expect(post.link).toBeNull();
  });

  it("keeps a provided image and link", () => {
    const post = new BlogPost({ ...base, image: "/img/news/2.jpg", link: "https://example.com" });
    expect(post.image).toBe("/img/news/2.jpg");
    expect(post.link).toBe("https://example.com");
  });

  it("rejects a missing title", () => {
    expect(() => new BlogPost({ ...base, title: "" })).toThrow(DomainValidationError);
  });

  it("rejects a missing summary", () => {
    expect(() => new BlogPost({ ...base, summary: "" })).toThrow(DomainValidationError);
  });
});

describe("GalleryPhoto entity", () => {
  it("accepts a valid photo", () => {
    const photo = new GalleryPhoto({ name: "Sunset", image: "/img/portfolio/3.jpg" });
    expect(photo.name).toBe("Sunset");
    expect(photo.image).toBe("/img/portfolio/3.jpg");
    expect(photo.createdAt).toBeInstanceOf(Date);
  });

  it("rejects a missing name", () => {
    expect(() => new GalleryPhoto({ name: "", image: "/img/portfolio/3.jpg" })).toThrow(DomainValidationError);
  });

  it("rejects a missing image", () => {
    expect(() => new GalleryPhoto({ name: "Sunset", image: "" })).toThrow(DomainValidationError);
  });
});
