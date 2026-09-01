import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "./Contact.jsx";
import { sampleProfile } from "../../test/fixtures.js";
import * as api from "../../api/client.js";

vi.mock("../../api/client.js", () => ({
  submitContact: vi.fn(),
}));

describe("Contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a validation message and does not call the API when fields are empty", async () => {
    render(<Contact profile={sampleProfile} />);
    await userEvent.click(screen.getByText("Send Message"));

    expect(await screen.findByText("Please fill required fields.")).toBeInTheDocument();
    expect(api.submitContact).not.toHaveBeenCalled();
  });

  it("submits the form and shows a success message on valid input", async () => {
    api.submitContact.mockResolvedValueOnce({ success: true });
    render(<Contact profile={sampleProfile} />);

    await userEvent.type(screen.getByPlaceholderText("Name"), "Ada Lovelace");
    await userEvent.type(screen.getByPlaceholderText("Email"), "ada@example.com");
    await userEvent.type(screen.getByPlaceholderText("Message"), "Hello, this is a test.");
    await userEvent.click(screen.getByText("Send Message"));

    expect(await screen.findByText(/message has been received/i)).toBeInTheDocument();
    expect(api.submitContact).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello, this is a test.",
    });
  });

  it("shows the API's error message when submission fails", async () => {
    api.submitContact.mockRejectedValueOnce(new Error("A valid email is required."));
    render(<Contact profile={sampleProfile} />);

    await userEvent.type(screen.getByPlaceholderText("Name"), "Ada");
    await userEvent.type(screen.getByPlaceholderText("Email"), "bad-email");
    await userEvent.type(screen.getByPlaceholderText("Message"), "Hello there testing.");
    await userEvent.click(screen.getByText("Send Message"));

    expect(await screen.findByText("A valid email is required.")).toBeInTheDocument();
  });
});
