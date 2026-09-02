import { describe, it, expect } from "vitest";
import { buildCorsOrigin } from "../src/app.js";

describe("buildCorsOrigin", () => {
  it("allows any origin when CLIENT_ORIGIN is unset (dev fallback)", () => {
    expect(buildCorsOrigin(undefined)).toBe("*");
    expect(buildCorsOrigin("")).toBe("*");
  });

  it("returns the single URL as-is when only one origin is configured", () => {
    expect(buildCorsOrigin("https://example.com")).toBe("https://example.com");
  });

  it("strips a trailing slash, since a real browser Origin header never has one", () => {
    expect(buildCorsOrigin("https://example.com/")).toBe("https://example.com");
    expect(buildCorsOrigin("https://a.com/, https://b.com/")).toBeInstanceOf(Function);

    const validate = buildCorsOrigin("https://a.com/, https://b.com/");
    let allowed;
    validate("https://a.com", (err, ok) => (allowed = ok));
    expect(allowed).toBe(true);
  });

  it("returns a validator function for a comma-separated list, allowing only listed origins", () => {
    const validate = buildCorsOrigin("https://a.com, https://b.com");
    expect(typeof validate).toBe("function");

    let allowed;
    validate("https://a.com", (err, ok) => (allowed = ok));
    expect(allowed).toBe(true);

    let rejected;
    validate("https://evil.com", (err) => (rejected = err));
    expect(rejected).toBeInstanceOf(Error);
  });

  it("allows requests with no Origin header (e.g. curl, server-to-server) even with a list configured", () => {
    const validate = buildCorsOrigin("https://a.com,https://b.com");
    let allowed;
    validate(undefined, (err, ok) => (allowed = ok));
    expect(allowed).toBe(true);
  });
});
