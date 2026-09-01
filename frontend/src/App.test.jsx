import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import { fullSampleProfile, samplePosts } from "./test/fixtures.js";

vi.mock("./api/client.js", () => ({
  fetchProfile: vi.fn(),
  fetchPosts: vi.fn(),
  fetchGallery: vi.fn(),
}));

import { fetchProfile, fetchPosts, fetchGallery } from "./api/client.js";
fetchProfile.mockResolvedValue(fullSampleProfile);
fetchPosts.mockResolvedValue(samplePosts);
fetchGallery.mockResolvedValue([]);

describe("App section transitions", () => {
  it("does not play the entrance animation on the initial Home section", async () => {
    render(<App />);
    const home = await screen.findByText("Test tagline.");
    const homeSection = home.closest(".tokyo_tm_section");
    expect(homeSection).toHaveClass("active");
    expect(homeSection).not.toHaveClass("fadeInLeft");
  });

  it("plays fadeInLeft on the target section after a nav click, and hides the previous one", async () => {
    render(<App />);
    await screen.findByText("Test tagline.");

    const desktopMenu = document.querySelector(".leftpart .menu");
    await userEvent.click(within(desktopMenu).getByText("About"));

    const aboutSection = document.getElementById("about");
    const homeSection = document.getElementById("home");
    expect(aboutSection).toHaveClass("active");
    expect(aboutSection).toHaveClass("fadeInLeft");
    expect(homeSection).toHaveClass("hidden");
    expect(homeSection).not.toHaveClass("active");
  });
});
