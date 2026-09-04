import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RichText from "./RichText.jsx";

describe("RichText", () => {
  it("renders safe formatting from the stored HTML", () => {
    render(<RichText html="<p>Built with <strong>React</strong>.</p>" />);
    const strong = screen.getByText("React");
    expect(strong.tagName).toBe("STRONG");
  });

  it("strips scripts and event-handler attributes as defense in depth", () => {
    render(<RichText html='<p>Hi</p><script>window.__pwned = true;</script><img src=x onerror=alert(1)>' />);
    expect(document.querySelector("script")).not.toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
    expect(window.__pwned).toBeUndefined();
  });

  it("renders nothing but doesn't crash for an empty/missing value", () => {
    const { container } = render(<RichText html="" />);
    expect(container.querySelector(".rich_text_content")).toBeEmptyDOMElement();
  });
});
