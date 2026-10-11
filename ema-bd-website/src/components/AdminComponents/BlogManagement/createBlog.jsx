import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  MdOutlineFileUpload,
  MdClose,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdLink,
  MdImage,
  MdUndo,
  MdRedo,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
} from "react-icons/md";

const API = import.meta.env.VITE_API_URL;

const toolbarButton =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 px-2 text-slate-600 transition hover:bg-blue-50 hover:text-[#0F2A5F] disabled:cursor-not-allowed disabled:opacity-40";

const CreateBlog = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
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
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[280px] px-4 py-4 text-sm leading-7 text-slate-700 outline-none sm:min-h-[350px]",
      },
    },
  });

  useEffect(() => {
    if (!coverImage) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(coverImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverImage]);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The cover image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setCoverImage(file);
  };

  const addLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter the link URL:", previousUrl);

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const safeUrl = url.trim();

    if (!/^(https?:\/\/|mailto:)/i.test(safeUrl)) {
      setError("Enter a valid URL starting with https://, http://, or mailto:.");
      return;
    }

    setError("");
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: safeUrl })
      .run();
  };

  const addInlineImage = () => {
    const url = window.prompt("Enter the image URL:");
    if (!url?.trim()) return;

    try {
      const parsedUrl = new URL(url.trim());

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        setError("Please enter a valid HTTP or HTTPS image URL.");
        return;
      }

      setError("");
      editor
        ?.chain()
        .focus()
        .setImage({ src: parsedUrl.href, alt: "Blog image" })
        .run();
    } catch {
      setError("Please enter a valid image URL.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !author.trim()) {
      setError("Please enter both the blog title and author name.");
      return;
    }

    if (!coverImage) {
      setError("Please upload a cover image.");
      return;
    }

    const html = editor?.getHTML() || "";

    if (!editor || editor.isEmpty || !editor.getText().trim()) {
      setError("Please write some blog content.");
      return;
    }

    const formData = new FormData();
    const now = new Date();

    formData.append("title", title.trim());
    formData.append("author", author.trim());
    formData.append("date", now.toDateString());
    formData.append("time", now.toTimeString());
    formData.append("text", html);
    formData.append("blogImage", coverImage);

    setSubmitting(true);

    try {
      const response = await fetch(`${API}/blogs`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to create the blog.");
      }

      if (result.data) {
        onCreated?.(result.data);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!editor) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-blog-title"
        className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <h2
              id="create-blog-title"
              className="text-xl font-bold text-[#0F2A5F]"
            >
              Create a Blog
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Write, format and publish a new article.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40"
          >
            <MdClose size={23} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="blog-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Blog title
                </label>
                <input
                  id="blog-title"
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  maxLength={200}
                  placeholder="Enter an engaging title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="blog-author"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Author name
                </label>
                <input
                  id="blog-author"
                  name="authorName"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  required
                  maxLength={100}
                  placeholder="Enter author name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F2A5F] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Cover image
              </label>

              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={preview}
                    alt="Blog cover preview"
                    className="h-48 w-full object-cover sm:h-56"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute right-3 top-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-red-600 shadow transition hover:bg-white"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-[#0F2A5F] hover:bg-blue-50/50">
                  <MdOutlineFileUpload
                    size={32}
                    className="mb-2 text-[#0F2A5F]"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    Click to upload a cover image
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Image files up to 5 MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={chooseImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Blog content
              </label>

              <div className="overflow-hidden rounded-xl border border-slate-200 focus-within:border-[#0F2A5F]">
                <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
                  <button
                    type="button"
                    title="Bold"
                    aria-label="Bold"
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`${toolbarButton} ${editor.isActive("bold") ? "bg-blue-100 text-[#0F2A5F]" : ""}`}
                  >
                    <MdFormatBold size={20} />
                  </button>

                  <button
                    type="button"
                    title="Italic"
                    aria-label="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`${toolbarButton} ${editor.isActive("italic") ? "bg-blue-100 text-[#0F2A5F]" : ""}`}
                  >
                    <MdFormatItalic size={20} />
                  </button>

                  <button
                    type="button"
                    title="Underline"
                    aria-label="Underline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`${toolbarButton} ${editor.isActive("underline") ? "bg-blue-100 text-[#0F2A5F]" : ""}`}
                  >
                    <MdFormatUnderlined size={20} />
                  </button>

                  <span className="mx-1 h-6 border-l border-slate-200" />

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
                        editor.chain().focus().toggleHeading({ level: 2 }).run();
                      } else if (value === "h3") {
                        editor.chain().focus().toggleHeading({ level: 3 }).run();
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

                  <button
                    type="button"
                    title="Bullet list"
                    aria-label="Bullet list"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`${toolbarButton} ${editor.isActive("bulletList") ? "bg-blue-100 text-[#0F2A5F]" : ""}`}
                  >
                    <MdFormatListBulleted size={20} />
                  </button>

                  <button
                    type="button"
                    title="Numbered list"
                    aria-label="Numbered list"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`${toolbarButton} ${editor.isActive("orderedList") ? "bg-blue-100 text-[#0F2A5F]" : ""}`}
                  >
                    <MdFormatListNumbered size={20} />
                  </button>

                  <button
                    type="button"
                    title="Quote"
                    aria-label="Quote"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`${toolbarButton} ${editor.isActive("blockquote") ? "bg-blue-100 text-[#0F2A5F]" : ""}`}
                  >
                    <MdFormatQuote size={20} />
                  </button>

                  <span className="mx-1 h-6 border-l border-slate-200" />

                  <button
                    type="button"
                    title="Align left"
                    aria-label="Align left"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={toolbarButton}
                  >
                    <MdFormatAlignLeft size={20} />
                  </button>

                  <button
                    type="button"
                    title="Align center"
                    aria-label="Align center"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={toolbarButton}
                  >
                    <MdFormatAlignCenter size={20} />
                  </button>

                  <button
                    type="button"
                    title="Align right"
                    aria-label="Align right"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={toolbarButton}
                  >
                    <MdFormatAlignRight size={20} />
                  </button>

                  <button
                    type="button"
                    title="Add link"
                    aria-label="Add link"
                    onClick={addLink}
                    className={`${toolbarButton} ${editor.isActive("link") ? "bg-blue-100 text-[#0F2A5F]" : ""}`}
                  >
                    <MdLink size={20} />
                  </button>

                  <button
                    type="button"
                    title="Insert image from URL"
                    aria-label="Insert image from URL"
                    onClick={addInlineImage}
                    className={toolbarButton}
                  >
                    <MdImage size={20} />
                  </button>

                  <span className="mx-1 h-6 border-l border-slate-200" />

                  <button
                    type="button"
                    title="Undo"
                    aria-label="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className={toolbarButton}
                  >
                    <MdUndo size={20} />
                  </button>

                  <button
                    type="button"
                    title="Redo"
                    aria-label="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className={toolbarButton}
                  >
                    <MdRedo size={20} />
                  </button>
                </div>

                <EditorContent editor={editor} />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Select text before applying formatting or adding a link.
                Inline images must be available at a public URL.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#0F2A5F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b7b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
