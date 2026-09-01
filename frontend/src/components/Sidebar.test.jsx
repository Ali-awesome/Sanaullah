import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./Sidebar.jsx";
import { sampleProfile } from "../test/fixtures.js";

describe("Sidebar", () => {
  it("renders all nav items and calls onNavigate when one is clicked", async () => {
    const onNavigate = vi.fn();
    render(<Sidebar profile={sampleProfile} active="home" onNavigate={onNavigate} />);

    const desktopMenu = document.querySelector(".leftpart .menu");
    await userEvent.click(within(desktopMenu).getByText("Portfolio"));

    expect(onNavigate).toHaveBeenCalledWith("portfolio");
  });

  it("marks the active section in the nav", () => {
    render(<Sidebar profile={sampleProfile} active="about" onNavigate={vi.fn()} />);
    const desktopMenu = document.querySelector(".leftpart .menu");
    const aboutItem = within(desktopMenu).getByText("About").closest("li");
    expect(aboutItem).toHaveClass("active");
  });

  it("opens the mobile menu when the hamburger trigger is clicked", async () => {
    render(<Sidebar profile={sampleProfile} active="home" onNavigate={vi.fn()} />);
    expect(document.querySelector(".tokyo_tm_mobile_menu")).not.toHaveClass("opened");

    await userEvent.click(document.querySelector(".tokyo_tm_topbar .trigger"));
    expect(document.querySelector(".tokyo_tm_mobile_menu")).toHaveClass("opened");
  });
});
