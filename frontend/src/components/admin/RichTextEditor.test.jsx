import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RichTextEditor from "./RichTextEditor.jsx";

describe("RichTextEditor", () => {
  it("renders the toolbar and an editable content area seeded with the given value", async () => {
    render(<RichTextEditor value="<p>Hello</p>" onChange={vi.fn()} placeholder="Summary" />);
    expect(await screen.findByText("Hello")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
  });

  it("reports bold-formatted HTML through onChange when the Bold button is used", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} placeholder="Summary" />);

    const editable = await screen.findByText((_, el) => el?.classList?.contains("rich_text_content"));
    await userEvent.click(editable);
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    await userEvent.type(editable, "Strong");

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(expect.stringContaining("<strong>"));
    });
  });

  it("syncs an external value change (e.g. switching which item is being edited) into the editor", async () => {
    const { rerender } = render(<RichTextEditor value="<p>First</p>" onChange={vi.fn()} placeholder="Summary" />);
    expect(await screen.findByText("First")).toBeInTheDocument();

    rerender(<RichTextEditor value="<p>Second</p>" onChange={vi.fn()} placeholder="Summary" />);
    expect(await screen.findByText("Second")).toBeInTheDocument();
    expect(screen.queryByText("First")).not.toBeInTheDocument();
  });
});
