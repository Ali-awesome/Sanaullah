import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import Preloader from "./Preloader.jsx";

describe("Preloader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the curtain immediately, closes it at 1300ms, and removes it at 2500ms", () => {
    render(<Preloader />);
    expect(document.getElementById("preloader")).toBeInTheDocument();
    expect(document.getElementById("preloader")).not.toHaveClass("preloaded");

    act(() => vi.advanceTimersByTime(1299));
    expect(document.getElementById("preloader")).not.toHaveClass("preloaded");

    act(() => vi.advanceTimersByTime(1));
    expect(document.getElementById("preloader")).toHaveClass("preloaded");
    expect(document.getElementById("preloader")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1199));
    expect(document.getElementById("preloader")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(document.getElementById("preloader")).not.toBeInTheDocument();
  });

  it("plays the same curtain on mobile user agents instead of skipping it", () => {
    const original = navigator.userAgent;
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
    );

    render(<Preloader />);
    expect(document.getElementById("preloader")).toBeInTheDocument();
    expect(document.getElementById("preloader")).not.toHaveClass("preloaded");

    act(() => vi.advanceTimersByTime(1300));
    expect(document.getElementById("preloader")).toHaveClass("preloaded");

    act(() => vi.advanceTimersByTime(1200));
    expect(document.getElementById("preloader")).not.toBeInTheDocument();

    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(original);
  });
});
