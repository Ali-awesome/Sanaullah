import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Publications from "./Publications.jsx";
import { samplePosts } from "../../test/fixtures.js";

describe("Publications", () => {
  it("renders each post's title and source", () => {
    render(<Publications posts={samplePosts} />);
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("shows an empty state when there are no posts", () => {
    render(<Publications posts={[]} />);
    expect(screen.getByText("No posts yet.")).toBeInTheDocument();
  });
});
