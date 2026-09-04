import { describe, it, expect, vi, beforeEach } from "vitest";

// Simulates the exact failure mode this guards against: a serverless
// deployment where the bundled default-cv.pdf didn't make it into the
// function's file bundle (see vercel.json's includeFiles, and the longer
// explanation in InMemoryCvRepository.js/MongoCvRepository.js) — so
// readFileSync throws ENOENT. Before the fix, that exception propagated
// out of the repository constructor/ensureSeeded during the shared,
// once-per-instance app setup in api/index.js, which crashed *every*
// route (not just CV ones) for the rest of that instance's life.
vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, readFileSync: vi.fn(() => { throw new Error("ENOENT: no such file or directory"); }) };
});

describe("CV repositories degrade gracefully when the bundled default CV can't be read", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("InMemoryCvRepository starts with no CV instead of throwing", async () => {
    const { InMemoryCvRepository } = await import("../src/infrastructure/repositories/InMemoryCvRepository.js");
    const repo = new InMemoryCvRepository();
    await expect(repo.get()).resolves.toBeNull();
  });
});
