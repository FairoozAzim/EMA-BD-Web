/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatColorText,
  MdLink,
  MdImage,
  MdUndo,
  MdRedo,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
} from "react-icons/md";
import Swal from "sweetalert2";

/* ---------- Editor options ---------- */
const FONT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Sans (Inter)", value: "Inter, system-ui, sans-serif" },
  { label: "Serif (Merriweather)", value: "Merriweather, Georgia, serif" },
  { label: "Monospace", value: "monospace" },
];

const TEXT_COLORS = [
  "#0F172A",
  "#475569",
  "#DC2626",
  "#EA580C",
  "#CA8A04",
  "#16A34A",
  "#0F2A5F",
  "#2563EB",
  "#7C3AED",
  "#DB2777",
];

const toolbarButton =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 px-2 text-slate-600 transition hover:bg-blue-50 hover:text-[#0F2A5F] disabled:cursor-not-allowed disabled:opacity-40";

/*
  Tailwind v4 preflight removes list bullets/numbers, heading sizes and
  paragraph spacing. These classes bring them back inside the editor.
  Apply the SAME classes to the element that renders blog/event HTML on
  the public pages.
*/
export const contentStyles = [
  "[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0F2A5F]",
  "[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0F2A5F]",
  "[&_p]:my-3",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6",
  "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:my-1 [&_li>p]:my-0",
  "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600",
  "[&_a]:text-blue-700 [&_a]:underline",
  "[&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg",
].join(" ");

const placeholderStyles = [
  "[&_p.is-editor-empty:first-child::before]:pointer-events-none",
  "[&_p.is-editor-empty:first-child::before]:float-left",
  "[&_p.is-editor-empty:first-child::before]:h-0",
  "[&_p.is-editor-empty:first-child::before]:text-slate-400",
  "[&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
].join(" ");

/* ---------- Helpers ---------- */
const warn = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonColor: "#0F2A5F",
  });

const ToolButton = ({
  title,
  onClick,
  active = false,
  disabled = false,
  children,
}) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    disabled={disabled}
    className={`${toolbarButton} ${active ? "bg-blue-100 text-[#0F2A5F]" : ""}`}
  >
    {children}
  </button>
);

/* ---------- Hook: creates the TipTap editor ---------- */
/*
  The parent calls this hook and keeps the `editor` object, so it can:
  - editor.commands.setContent(html)   -> fill the editor when editing
  - editor.commands.clearContent()     -> reset the editor
  - editor.getHTML()                   -> read the content on submit
  - editor.isEmpty / editor.getText()  -> validate the content
*/
export const useRichTextEditor = ({
  placeholder = "Write your content here...",
} = {}) =>
  useEditor({
    extensions: [
      // Underline and Link are added separately below, so they are disabled
      // here to avoid "duplicate extension" warnings on newer TipTap versions.
      StarterKit.configure({ underline: false, link: false }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      ImageExtension.configure({
        inline: false,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-blue-700 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: "",
    // Keeps toolbar active/disabled states in sync with the cursor
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: `tiptap-editor min-h-[280px] px-4 py-4 text-sm leading-7 text-slate-700 outline-none sm:min-h-[350px] ${contentStyles} ${placeholderStyles}`,
      },
    },
  });

/* ---------- Component: toolbar + editing area ---------- */
const RichTextEditor = ({
  editor,
  helperText = "Select text before applying formatting, color or a link. Inline images must be available at a public URL.",
}) => {
  const [colorOpen, setColorOpen] = useState(false);
  const colorRef = useRef(null);

  // Close the color popover when clicking outside
  useEffect(() => {
    if (!colorOpen) return;

    const handleClickOutside = (event) => {
      if (colorRef.current && !colorRef.current.contains(event.target)) {
        setColorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorOpen]);

  if (!editor) return null;

  const addLink = async () => {
    const previousUrl = editor.getAttributes("link").href || "";

    const {
      value: url,
      isConfirmed,
      isDenied,
    } = await Swal.fire({
      title: previousUrl ? "Edit Link" : "Insert Link",
      input: "url",
      inputLabel: "Enter the URL",
      inputPlaceholder: "https://example.com",
      inputValue: previousUrl,
      showCancelButton: true,
      showDenyButton: Boolean(previousUrl),
      confirmButtonText: "Save Link",
      denyButtonText: "Remove Link",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0F2A5F",
      denyButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      reverseButtons: true,
      focusConfirm: false,
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Please enter a URL.";
        }

        if (!/^(https?:\/\/|mailto:)/i.test(value.trim())) {
          return "Enter a valid URL starting with https://, http://, or mailto:.";
        }

        return null;
      },
    });

    if (isDenied) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    if (isConfirmed && url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url.trim() })
        .run();
    }
  };

  const addInlineImage = async () => {
    const previousUrl = editor.getAttributes("image").src || "";

    const { value: url, isConfirmed } = await Swal.fire({
      title: previousUrl ? "Edit Image" : "Insert Image",
      input: "url",
      inputLabel: "Enter the image URL",
      inputPlaceholder: "https://example.com/image.jpg",
      inputValue: previousUrl,
      showCancelButton: true,
      confirmButtonText: previousUrl ? "Update Image" : "Insert Image",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0F2A5F",
      cancelButtonColor: "#64748B",
      reverseButtons: true,
      focusConfirm: false,
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Please enter an image URL.";
        }

        try {
          const parsedUrl = new URL(value.trim());

          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return "Only HTTP and HTTPS image URLs are allowed.";
          }

          return null;
        } catch {
          return "Please enter a valid image URL.";
        }
      },
    });

    if (isConfirmed && url) {
      const parsedUrl = new URL(url.trim());

      editor
        .chain()
        .focus()
        .setImage({
          src: parsedUrl.href,
          alt: "Inline image",
        })
        .run();
    }
  };

  const applyColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setColorOpen(false);
  };

  const resetColor = () => {
    editor.chain().focus().unsetColor().run();
    setColorOpen(false);
  };

  const currentColor = editor.getAttributes("textStyle").color || "";
  const currentFont = editor.getAttributes("textStyle").fontFamily || "";
  const customColorValue = /^#[0-9a-f]{6}$/i.test(currentColor)
    ? currentColor
    : "#0F172A";

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 focus-within:border-[#0F2A5F]">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
          <select
            aria-label="Font style"
            value={currentFont}
            onChange={(event) => {
              const value = event.target.value;
              if (value) {
                editor.chain().focus().setFontFamily(value).run();
              } else {
                editor.chain().focus().unsetFontFamily().run();
              }
            }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none"
          >
            {FONT_OPTIONS.map((font) => (
              <option
                key={font.label}
                value={font.value}
                style={font.value ? { fontFamily: font.value } : undefined}
              >
                {font.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Text style"
            value={
              editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                  ? "h3"
                  : "paragraph"
            }
            onChange={(event) => {
              const value = event.target.value;
              if (value === "h2") {
                editor.chain().focus().setHeading({ level: 2 }).run();
              } else if (value === "h3") {
                editor.chain().focus().setHeading({ level: 3 }).run();
              } else {
                editor.chain().focus().setParagraph().run();
              }
            }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <span className="mx-1 h-6 border-l border-slate-200" />

          <ToolButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <MdFormatBold size={20} />
          </ToolButton>

          <ToolButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <MdFormatItalic size={20} />
          </ToolButton>

          <ToolButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <MdFormatUnderlined size={20} />
          </ToolButton>

          {/* Text color */}
          <div className="relative" ref={colorRef}>
            <button
              type="button"
              title="Text color"
              aria-label="Text color"
              aria-expanded={colorOpen}
              onClick={() => setColorOpen((open) => !open)}
              className={toolbarButton}
            >
              <span className="flex flex-col items-center">
                <MdFormatColorText size={18} />
                <span
                  className="mt-0.5 h-1 w-4 rounded"
                  style={{
                    backgroundColor: currentColor || "#0F172A",
                  }}
                />
              </span>
            </button>

            {colorOpen && (
              <div className="absolute left-0 top-11 z-20 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                <div className="grid grid-cols-5 gap-2">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Text color ${color}`}
                      onClick={() => applyColor(color)}
                      style={{ backgroundColor: color }}
                      className={`h-8 w-8 rounded-full ring-1 ring-slate-300 transition hover:scale-110 ${
                        currentColor.toLowerCase() === color.toLowerCase()
                          ? "ring-2 ring-[#0F2A5F] ring-offset-2"
                          : ""
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    Custom
                    <input
                      type="color"
                      value={customColorValue}
                      onChange={(event) =>
                        editor
                          .chain()
                          .focus()
                          .setColor(event.target.value)
                          .run()
                      }
                      className="h-7 w-9 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={resetColor}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <span className="mx-1 h-6 border-l border-slate-200" />

          <ToolButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <MdFormatListBulleted size={20} />
          </ToolButton>

          <ToolButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <MdFormatListNumbered size={20} />
          </ToolButton>

          <ToolButton
            title="Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <MdFormatQuote size={20} />
          </ToolButton>

          <span className="mx-1 h-6 border-l border-slate-200" />

          <ToolButton
            title="Align left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <MdFormatAlignLeft size={20} />
          </ToolButton>

          <ToolButton
            title="Align center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <MdFormatAlignCenter size={20} />
          </ToolButton>

          <ToolButton
            title="Align right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <MdFormatAlignRight size={20} />
          </ToolButton>

          <span className="mx-1 h-6 border-l border-slate-200" />

          <ToolButton
            title="Add link"
            active={editor.isActive("link")}
            onClick={addLink}
          >
            <MdLink size={20} />
          </ToolButton>

          <ToolButton title="Insert image from URL" onClick={addInlineImage}>
            <MdImage size={20} />
          </ToolButton>

          <span className="mx-1 h-6 border-l border-slate-200" />

          <ToolButton
            title="Undo"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <MdUndo size={20} />
          </ToolButton>

          <ToolButton
            title="Redo"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <MdRedo size={20} />
          </ToolButton>
        </div>

        <EditorContent editor={editor} />
      </div>

      {helperText && (
        <p className="mt-2 text-xs text-slate-500">{helperText}</p>
      )}
    </>
  );
};

export default RichTextEditor;
