import { describe, it, expect } from "vitest";
import { ContactMessage, DomainValidationError } from "../src/domain/entities/ContactMessage.js";
import { BlogPost } from "../src/domain/entities/BlogPost.js";
import { GalleryPhoto } from "../src/domain/entities/GalleryPhoto.js";
import { PortfolioProject } from "../src/domain/entities/PortfolioProject.js";
import { CvDocument } from "../src/domain/entities/CvDocument.js";

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

  it("defaults description to empty when not provided, and keeps one when given", () => {
    const bare = new GalleryPhoto({ name: "Sunset", image: "/img/portfolio/3.jpg" });
    expect(bare.description).toBe("");

    const described = new GalleryPhoto({ name: "Sunset", image: "/img/portfolio/3.jpg", description: "Golden hour." });
    expect(described.description).toBe("Golden hour.");
  });
});

describe("PortfolioProject entity", () => {
  const base = { title: "Title", category: "Research", summary: "A short summary." };

  it("accepts a valid project and fills in defaults", () => {
    const project = new PortfolioProject(base);
    expect(project.title).toBe("Title");
    expect(project.summary).toBe("A short summary.");
    expect(project.image).toBe("/img/portfolio/3.jpg");
    expect(project.link).toBeNull();
    expect(project.client).toBe("");
    expect(project.date).toBe("");
    expect(project.images).toEqual([]);
  });

  it("keeps provided client/date/link/images", () => {
    const project = new PortfolioProject({
      ...base,
      client: "Acme",
      date: "2026",
      link: "https://example.com",
      images: ["/img/a.jpg", "/img/b.jpg"],
    });
    expect(project.client).toBe("Acme");
    expect(project.date).toBe("2026");
    expect(project.link).toBe("https://example.com");
    expect(project.images).toEqual(["/img/a.jpg", "/img/b.jpg"]);
  });

  it("rejects a missing title", () => {
    expect(() => new PortfolioProject({ ...base, title: "" })).toThrow(DomainValidationError);
  });

  it("rejects a missing category", () => {
    expect(() => new PortfolioProject({ ...base, category: "" })).toThrow(DomainValidationError);
  });

  it("rejects a missing summary", () => {
    expect(() => new PortfolioProject({ ...base, summary: "" })).toThrow(DomainValidationError);
  });
});

describe("CvDocument entity", () => {
  it("accepts a valid PDF buffer", () => {
    const cv = new CvDocument({ buffer: Buffer.from("%PDF-1.4"), mimetype: "application/pdf", filename: "CV.pdf" });
    expect(cv.filename).toBe("CV.pdf");
    expect(cv.uploadedAt).toBeInstanceOf(Date);
  });

  it("rejects an empty buffer", () => {
    expect(() => new CvDocument({ buffer: Buffer.alloc(0), mimetype: "application/pdf" })).toThrow(
      DomainValidationError
    );
  });

  it("rejects a non-PDF file", () => {
    expect(() => new CvDocument({ buffer: Buffer.from("hi"), mimetype: "image/png" })).toThrow(DomainValidationError);
  });

  it("rejects a file over the size limit", () => {
    const tooBig = Buffer.alloc(11 * 1024 * 1024);
    expect(() => new CvDocument({ buffer: tooBig, mimetype: "application/pdf" })).toThrow(DomainValidationError);
  });
});
