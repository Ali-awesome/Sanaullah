import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaLink,
  FaUnlink,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

function ToolbarButton({ onClick, active, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded border text-sm transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "border-black bg-black text-white" : "border-[#ddd] bg-white text-black hover:border-black/50"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * A small rich text editor for the admin panel's description/summary
 * fields (BlogPost.summary, GalleryPhoto.description,
 * PortfolioProject.summary) — controlled like a textarea (`value` is an
 * HTML string, `onChange` receives the updated HTML), backed by Tiptap.
 * The public site renders the stored HTML through RichText.jsx, which
 * sanitizes it again on the client as defense in depth; the backend
 * (sanitizeRichText.js) is the actual source of truth for what's safe to
 * store.
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    // Kept in sync with the backend's allow-list (sanitizeRichText.js):
    // only extensions that produce tags the server actually keeps are
    // enabled here, so nothing the admin formats gets silently stripped on
    // save. `placeholder` is fixed per call site, so building this once
    // per mount (useEditor's default empty deps array) is fine.
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: true },
      }),
      Placeholder.configure({ placeholder: placeholder || "" }),
    ],
    content: value || "",
    editorProps: {
      attributes: { class: "rich_text_content min-h-[100px] px-3 py-[10px] focus:outline-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keeps the editor in sync with external resets — switching which item
  // is being edited, or clearing the form back to blank after a save —
  // without fighting the user's own typing: only pushed when the incoming
  // value actually differs from what the editor currently holds.
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return; // cancelled
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="mb-3 rounded-md border border-[#ddd] focus-within:border-black/50">
      <div className="flex flex-wrap gap-1 border-b border-[#ddd] p-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FaBold />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FaItalic />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FaUnderline />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <FaStrikethrough />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FaQuoteRight />
        </ToolbarButton>
        <ToolbarButton label="Add link" active={editor.isActive("link")} onClick={setLink}>
          <FaLink />
        </ToolbarButton>
        <ToolbarButton
          label="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <FaUnlink />
        </ToolbarButton>
        <ToolbarButton
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <FaUndo />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <FaRedo />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
