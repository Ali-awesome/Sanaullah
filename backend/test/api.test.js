import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { InMemoryContactRepository } from "../src/infrastructure/repositories/InMemoryContactRepository.js";
import { InMemoryBlogPostRepository } from "../src/infrastructure/repositories/InMemoryBlogPostRepository.js";
import { InMemoryGalleryPhotoRepository } from "../src/infrastructure/repositories/InMemoryGalleryPhotoRepository.js";

const ADMIN_TOKEN = "test-admin-token";
process.env.ADMIN_TOKEN = ADMIN_TOKEN;

function buildApp() {
  return createApp({
    contactRepository: new InMemoryContactRepository(),
    blogPostRepository: new InMemoryBlogPostRepository(),
    galleryPhotoRepository: new InMemoryGalleryPhotoRepository(),
  });
}

describe("GET /health", () => {
  it("reports ok", async () => {
    const res = await request(buildApp()).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/profile", () => {
  it("returns the profile", async () => {
    const res = await request(buildApp()).get("/api/profile");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Mohammad Sanaullah");
  });
});

describe("POST /api/contact", () => {
  it("rejects an invalid submission", async () => {
    const res = await request(buildApp()).post("/api/contact").send({ name: "", email: "bad", message: "x" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("accepts a valid submission", async () => {
    const res = await request(buildApp())
      .post("/api/contact")
      .send({ name: "Ada", email: "ada@example.com", message: "Hello, testing the contact form." });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});

describe("GET /api/contact (admin inbox)", () => {
  it("rejects requests without the admin token", async () => {
    const res = await request(buildApp()).get("/api/contact");
    expect(res.status).toBe(401);
  });

  it("returns messages when the admin token is supplied", async () => {
    const app = buildApp();
    await request(app)
      .post("/api/contact")
      .send({ name: "Ada", email: "ada@example.com", message: "Hello, testing the inbox." });

    const res = await request(app).get("/api/contact").set("x-admin-token", ADMIN_TOKEN);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Ada");
  });
});

describe("GET /api/posts", () => {
  it("returns the seeded posts publicly", async () => {
    const res = await request(buildApp()).get("/api/posts");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});

describe("POST /api/posts (admin only)", () => {
  it("rejects requests without the admin token", async () => {
    const res = await request(buildApp())
      .post("/api/posts")
      .send({ title: "New", source: "S", date: "2026", summary: "Summary." });
    expect(res.status).toBe(401);
  });

  it("creates a post when the admin token is supplied", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/api/posts")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ title: "New Post", source: "Blog", date: "2026", summary: "A new post." });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("New Post");

    const list = await request(app).get("/api/posts");
    expect(list.body.some((p) => p.title === "New Post")).toBe(true);
  });

  it("rejects an invalid post even with a valid admin token", async () => {
    const res = await request(buildApp()).post("/api/posts").set("x-admin-token", ADMIN_TOKEN).send({ title: "" });
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/posts/reorder (admin only)", () => {
  it("rejects requests without the admin token", async () => {
    const res = await request(buildApp()).put("/api/posts/reorder").send({ ids: [] });
    expect(res.status).toBe(401);
  });

  it("persists the new order and reflects it in subsequent GETs", async () => {
    const app = buildApp();
    const before = await request(app).get("/api/posts");
    const reversedIds = [...before.body].reverse().map((p) => p.id);

    const res = await request(app)
      .put("/api/posts/reorder")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ ids: reversedIds });
    expect(res.status).toBe(200);
    expect(res.body.data.map((p) => p.id)).toEqual(reversedIds);

    const after = await request(app).get("/api/posts");
    expect(after.body.map((p) => p.id)).toEqual(reversedIds);
  });
});

describe("PUT /api/posts/:id (admin only)", () => {
  it("rejects requests without the admin token", async () => {
    const app = buildApp();
    const created = await request(app)
      .post("/api/posts")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ title: "Original", source: "S", date: "2026", summary: "Original summary." });

    const res = await request(app)
      .put(`/api/posts/${created.body.data.id}`)
      .send({ title: "Edited", source: "S", date: "2026", summary: "Edited summary." });
    expect(res.status).toBe(401);
  });

  it("updates a post when the admin token is supplied", async () => {
    const app = buildApp();
    const created = await request(app)
      .post("/api/posts")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ title: "Original", source: "S", date: "2026", summary: "Original summary." });

    const res = await request(app)
      .put(`/api/posts/${created.body.data.id}`)
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ title: "Edited", source: "S2", date: "2027", summary: "Edited summary." });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Edited");

    const list = await request(app).get("/api/posts");
    expect(list.body.some((p) => p.title === "Edited")).toBe(true);
    expect(list.body.some((p) => p.title === "Original")).toBe(false);
  });

  it("rejects an invalid update even with a valid admin token", async () => {
    const app = buildApp();
    const created = await request(app)
      .post("/api/posts")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ title: "Original", source: "S", date: "2026", summary: "Original summary." });

    const res = await request(app)
      .put(`/api/posts/${created.body.data.id}`)
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ title: "" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for a non-existent post", async () => {
    const res = await request(buildApp())
      .put("/api/posts/does-not-exist")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ title: "T", source: "S", summary: "Summary." });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/posts/:id (admin only)", () => {
  it("deletes an existing post", async () => {
    const app = buildApp();
    const created = await request(app)
      .post("/api/posts")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ title: "Temp", source: "S", date: "2026", summary: "Temp post." });

    const res = await request(app).delete(`/api/posts/${created.body.data.id}`).set("x-admin-token", ADMIN_TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 404 for a non-existent post", async () => {
    const res = await request(buildApp()).delete("/api/posts/does-not-exist").set("x-admin-token", ADMIN_TOKEN);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/gallery", () => {
  it("returns the seeded photos publicly", async () => {
    const res = await request(buildApp()).get("/api/gallery");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
  });
});

describe("POST /api/gallery (admin only)", () => {
  it("rejects requests without the admin token", async () => {
    const res = await request(buildApp()).post("/api/gallery").send({ name: "New", image: "/img/portfolio/3.jpg" });
    expect(res.status).toBe(401);
  });

  it("creates a photo when the admin token is supplied", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/api/gallery")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ name: "New Photo", image: "/img/portfolio/3.jpg" });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("New Photo");

    const list = await request(app).get("/api/gallery");
    expect(list.body.some((p) => p.name === "New Photo")).toBe(true);
  });

  it("rejects an invalid photo even with a valid admin token", async () => {
    const res = await request(buildApp()).post("/api/gallery").set("x-admin-token", ADMIN_TOKEN).send({ name: "" });
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/gallery/reorder (admin only)", () => {
  it("rejects requests without the admin token", async () => {
    const res = await request(buildApp()).put("/api/gallery/reorder").send({ ids: [] });
    expect(res.status).toBe(401);
  });

  it("persists the new order and reflects it in subsequent GETs", async () => {
    const app = buildApp();
    const before = await request(app).get("/api/gallery");
    const reversedIds = [...before.body].reverse().map((p) => p.id);

    const res = await request(app)
      .put("/api/gallery/reorder")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ ids: reversedIds });
    expect(res.status).toBe(200);
    expect(res.body.data.map((p) => p.id)).toEqual(reversedIds);

    const after = await request(app).get("/api/gallery");
    expect(after.body.map((p) => p.id)).toEqual(reversedIds);
  });
});

describe("PUT /api/gallery/:id (admin only)", () => {
  it("rejects requests without the admin token", async () => {
    const app = buildApp();
    const created = await request(app)
      .post("/api/gallery")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ name: "Original", image: "/img/portfolio/3.jpg" });

    const res = await request(app)
      .put(`/api/gallery/${created.body.data.id}`)
      .send({ name: "Edited", image: "/img/portfolio/4.jpg" });
    expect(res.status).toBe(401);
  });

  it("updates a photo when the admin token is supplied", async () => {
    const app = buildApp();
    const created = await request(app)
      .post("/api/gallery")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ name: "Original", image: "/img/portfolio/3.jpg" });

    const res = await request(app)
      .put(`/api/gallery/${created.body.data.id}`)
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ name: "Edited", image: "/img/portfolio/4.jpg" });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Edited");

    const list = await request(app).get("/api/gallery");
    expect(list.body.some((p) => p.name === "Edited")).toBe(true);
    expect(list.body.some((p) => p.name === "Original")).toBe(false);
  });

  it("rejects an invalid update even with a valid admin token", async () => {
    const app = buildApp();
    const created = await request(app)
      .post("/api/gallery")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ name: "Original", image: "/img/portfolio/3.jpg" });

    const res = await request(app)
      .put(`/api/gallery/${created.body.data.id}`)
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ name: "" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for a non-existent photo", async () => {
    const res = await request(buildApp())
      .put("/api/gallery/does-not-exist")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ name: "N", image: "/img/portfolio/3.jpg" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/gallery/:id (admin only)", () => {
  it("deletes an existing photo", async () => {
    const app = buildApp();
    const created = await request(app)
      .post("/api/gallery")
      .set("x-admin-token", ADMIN_TOKEN)
      .send({ name: "Temp", image: "/img/portfolio/3.jpg" });

    const res = await request(app).delete(`/api/gallery/${created.body.data.id}`).set("x-admin-token", ADMIN_TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 404 for a non-existent photo", async () => {
    const res = await request(buildApp()).delete("/api/gallery/does-not-exist").set("x-admin-token", ADMIN_TOKEN);
    expect(res.status).toBe(404);
  });
});
