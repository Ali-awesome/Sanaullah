import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "./Portfolio.jsx";
import { sampleProfile, samplePortfolio, sampleGallery } from "../../test/fixtures.js";

const profile = { ...sampleProfile, portfolio: samplePortfolio };

describe("Portfolio", () => {
  it("renders the gallery photos and filter categories under the default 'All' tab", () => {
    render(<Portfolio profile={profile} gallery={sampleGallery} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Data Analytics")).toBeInTheDocument();
    expect(screen.getByText("Machine Learning")).toBeInTheDocument();
    expect(document.querySelectorAll(".portfolio_list li")).toHaveLength(2);
    expect(document.querySelector('[data-title="Gallery Photo One"]')).toBeInTheDocument();
  });

  it("filters projects by category, replacing the gallery view", async () => {
    render(<Portfolio profile={profile} gallery={sampleGallery} />);

    // The filter click doesn't swap the grid instantly — it cross-fades over
    // 750ms, matching the original theme's Isotope-driven transition timing
    // (see Portfolio.jsx) — so the new items only appear after that delay.
    await userEvent.click(screen.getByText("Machine Learning"));
    await waitFor(() => {
      expect(document.querySelectorAll(".portfolio_list li")).toHaveLength(1);
    });
    expect(document.querySelector('[data-title="Project B"]')).toBeInTheDocument();
  });

  it("opens a detail modal with the project summary on click", async () => {
    render(<Portfolio profile={profile} gallery={sampleGallery} />);
    await userEvent.click(screen.getByText("Data Analytics"));

    const firstEntry = await waitFor(() => {
      const el = document.querySelector('[data-title="Project A"] a');
      expect(el).toBeInTheDocument();
      return el;
    });
    await userEvent.click(firstEntry);

    expect(screen.getByText("Summary A.")).toBeInTheDocument();
    expect(screen.getByText("Client A")).toBeInTheDocument();
  });

  it("opens a simple lightbox with just the name and image for a gallery photo", async () => {
    render(<Portfolio profile={profile} gallery={sampleGallery} />);

    const firstPhoto = document.querySelector('[data-title="Gallery Photo One"] a');
    await userEvent.click(firstPhoto);

    expect(screen.getAllByText("Gallery Photo One").length).toBeGreaterThan(0);
    // The real photo renders as a CSS background on ".main" (the theme's
    // invisible-sizing-image + overlay pattern) — the <img> itself is just
    // the aspect-ratio placeholder, not the photo.
    expect(document.querySelector(".tokyo_tm_modalbox .top_image .main").style.backgroundImage).toContain(
      "/img/portfolio/1.jpg"
    );
  });
});
