import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Cursor from "./Cursor.jsx";

describe("Cursor", () => {
  it("tracks the mouse position on both rings", () => {
    render(<Cursor />);
    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });

    const inner = document.querySelector(".cursor-inner");
    const outer = document.querySelector(".cursor-outer");
    expect(inner.style.transform).toBe("translate(120px, 80px)");
    expect(outer.style.transform).toBe("translate(120px, 80px)");
    expect(inner.style.visibility).toBe("visible");
  });

  it("adds .cursor-hover while over a link and removes it on leaving", () => {
    document.body.innerHTML += '<a id="test-link" href="#">link</a>';
    render(<Cursor />);
    const link = document.getElementById("test-link");
    const inner = document.querySelector(".cursor-inner");
    const outer = document.querySelector(".cursor-outer");

    fireEvent.mouseOver(link);
    expect(inner).toHaveClass("cursor-hover");
    expect(outer).toHaveClass("cursor-hover");

    fireEvent.mouseOut(link);
    expect(inner).not.toHaveClass("cursor-hover");
    expect(outer).not.toHaveClass("cursor-hover");

    link.remove();
  });
});
