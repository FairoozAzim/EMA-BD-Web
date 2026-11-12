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
  MdOutlineFileUpload,
  MdClose,
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

const API = import.meta.env.VITE_API_URL;

/* ---------- Cover image rules ---------- */
const COVER_RATIO = 16 / 9;
const COVER_MAX_WIDTH = 1600; // output is at most 1600x900
const COVER_MIN_WIDTH = 800;
const COVER_MIN_HEIGHT = 450;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  Apply the SAME classes to the element that renders blog HTML on the
  public blog page.
*/
const contentStyles = [
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

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

/* ---------- Cover cropper (fixed 16:9 frame) ---------- */
const CoverCropper = ({ source, onCancel, onApply }) => {
  const { image, width, height } = source;
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  // center = the point of the image (in natural pixels) shown at the frame center.
  // Starts at the image center, so the first crop is an automatic center crop.
  const [center, setCenter] = useState({ x: width / 2, y: height / 2 });

  // Visible area of the image (natural pixels) at the current zoom
  const baseW = width / height >= COVER_RATIO ? height * COVER_RATIO : width;
  const baseH = baseW / COVER_RATIO;
  const visW = baseW / zoom;
  const visH = baseH / zoom;
  const cx = clamp(center.x, visW / 2, width - visW / 2);
  const cy = clamp(center.y, visH / 2, height - visH / 2);

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, cx, cy };
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || !frameRef.current) return;

    const rect = frameRef.current.getBoundingClientRect();
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;

    setCenter({
      x: clamp(
        dragRef.current.cx - (dx / rect.width) * visW,
        visW / 2,
        width - visW / 2,
      ),
      y: clamp(
        dragRef.current.cy - (dy / rect.height) * visH,
        visH / 2,
        height - visH / 2,
      ),
    });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const handleReset = () => {
    setZoom(1);
    setCenter({ x: width / 2, y: height / 2 });
  };

  const handleApply = () => {
    const outW = Math.min(COVER_MAX_WIDTH, Math.round(visW));
    const outH = Math.round(outW / COVER_RATIO);

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; // for transparent PNGs
    ctx.fillRect(0, 0, outW, outH);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      image,
      cx - visW / 2,
      cy - visH / 2,
      visW,
      visH,
      0,
      0,
      outW,
      outH,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          warn(
            "Crop Failed",
            "Could not process this image. Please try another one.",
          );
          return;
        }
        onApply(
          new File([blob], `cover-${Date.now()}.jpg`, { type: "image/jpeg" }),
        );
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Crop cover image"
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-bold text-[#0F2A5F]">Crop cover image</h3>
          <p className="mt-1 text-sm text-slate-500">
            Cover images use a 16:9 format. Drag to reposition and use the
            slider to zoom.
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div
            ref={frameRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="relative aspect-video w-full cursor-grab touch-none select-none overflow-hidden rounded-xl bg-slate-900 active:cursor-grabbing"
          >
            <img
              src={image.src}
              alt="Crop preview"
              draggable={false}
              className="pointer-events-none absolute max-w-none"
              style={{
                width: `${(width / visW) * 100}%`,
                height: `${(height / visH) * 100}%`,
                left: `${-((cx - visW / 2) / visW) * 100}%`,
                top: `${-((cy - visH / 2) / visH) * 100}%`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/40" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Zoom</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              aria-label="Zoom"
              className="h-2 flex-1 cursor-pointer accent-[#0F2A5F]"
            />
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-[#0F2A5F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b7b]"
          >
            Apply crop
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main component ---------- */
const CreateBlog = ({ onClose, onCreated, editBlog = null }) => {
  const isEditing = Boolean(editBlog?._id);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [cropSource, setCropSource] = useState(null);
  const [colorOpen, setColorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const coverInputRef = useRef(null);
  const colorRef = useRef(null);

  const editor = useEditor({
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
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
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

  // Fill / reset form when opening for create or edit
  useEffect(() => {
    if (!editor) return;

    setCoverImage(null);

    if (editBlog) {
      setTitle(editBlog.title || "");
      setAuthor(editBlog.author || "");
      editor.commands.setContent(editBlog.text || "");
    } else {
      setTitle("");
      setAuthor("");
      editor.commands.clearContent();
    }
  }, [editor, editBlog]);

  // Preview URL for the cropped cover image
  useEffect(() => {
    if (!coverImage) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(coverImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverImage]);

  // Release the temporary URL used by the cropper
  useEffect(() => {
    if (!cropSource) return;
    return () => URL.revokeObjectURL(cropSource.url);
  }, [cropSource]);

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

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the same file be selected again
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      warn("Invalid Image", "Please upload a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      warn("Image Too Large", "The cover image must be smaller than 5 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      if (
        img.naturalWidth < COVER_MIN_WIDTH ||
        img.naturalHeight < COVER_MIN_HEIGHT
      ) {
        URL.revokeObjectURL(url);
        warn(
          "Image Too Small",
          `The cover image must be at least ${COVER_MIN_WIDTH}×${COVER_MIN_HEIGHT} px. Your image is ${img.naturalWidth}×${img.naturalHeight} px.`,
        );
        return;
      }

      setCropSource({
        url,
        image: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      warn(
        "Invalid Image",
        "This image could not be read. Please try another file.",
      );
    };

    img.src = url;
  };

  const handleCropApply = (file) => {
    setCoverImage(file);
    setCropSource(null);
  };

  const addLink = async () => {
    if (!editor) return;

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

  const addInlineImage = () => {
    const url = window.prompt("Enter the image URL:");
    if (!url?.trim()) return;

    try {
      const parsedUrl = new URL(url.trim());

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only HTTP and HTTPS image URLs are allowed.");
      }

      editor
        ?.chain()
        .focus()
        .setImage({ src: parsedUrl.href, alt: "Blog image" })
        .run();
    } catch {
      warn(
        "Invalid Image URL",
        "Please enter a valid HTTP or HTTPS image URL.",
      );
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !author.trim()) {
      warn(
        "Missing Information",
        "Please enter both the blog title and author name.",
      );
      return;
    }

    if (!isEditing && !coverImage) {
      warn("Cover Image Required", "Please upload a cover image.");
      return;
    }

    const html = editor?.getHTML() || "";

    if (!editor || editor.isEmpty || !editor.getText().trim()) {
      warn("Content Required", "Please write some blog content.");
      return;
    }

    const formData = new FormData();
    const now = new Date();

    formData.append("title", title.trim());
    formData.append("author", author.trim());
    formData.append("date", now.toDateString());
    formData.append("time", now.toTimeString());
    formData.append("text", html);

    if (coverImage) {
      formData.append("blogImage", coverImage);
    }

    setSubmitting(true);

    try {
      const url = isEditing ? `${API}/blogs/${editBlog._id}` : `${API}/blogs`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to ${isEditing ? "update" : "create"} the blog.`,
        );
      }

      await Swal.fire({
        title: isEditing ? "Blog Updated!" : "Blog Published!",
        text: isEditing
          ? "Your blog has been updated successfully."
          : "Your blog has been published successfully.",
        icon: "success",
        confirmButtonColor: "#0F2A5F",
      });

      onCreated?.(result.data || editBlog);
      onClose();
    } catch (err) {
      Swal.fire({
        title: "Something Went Wrong!",
        text: err.message || "Please try again.",
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!editor) return null;

  const currentColor = editor.getAttributes("textStyle").color || "";
  const currentFont = editor.getAttributes("textStyle").fontFamily || "";
  const customColorValue = /^#[0-9a-f]{6}$/i.test(currentColor)
    ? currentColor
    : "#0F172A";
  const existingCoverUrl =
    isEditing && editBlog?.blogImage
      ? `${API}/uploads/${editBlog.blogImage}`
      : "";
  const coverSrc = preview || existingCoverUrl;

  return (
    <>
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
                {isEditing ? "Edit Blog" : "Create a Blog"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isEditing
                  ? "Update your article details and content."
                  : "Write, format and publish a new article."}
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

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
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

              {/* Cover image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cover image
                </label>

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={chooseImage}
                  className="hidden"
                />

                {coverSrc ? (
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={coverSrc}
                      alt="Blog cover preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-[#0F2A5F] shadow transition hover:bg-white"
                      >
                        Change image
                      </button>
                      {coverImage && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(null)}
                          className="rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-red-600 shadow transition hover:bg-white"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-[#0F2A5F] hover:bg-blue-50/50"
                  >
                    <MdOutlineFileUpload
                      size={32}
                      className="mb-2 text-[#0F2A5F]"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Click to upload a cover image
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      JPG, PNG or WebP · up to 5 MB · at least 800×450 px ·
                      cropped to 16:9
                    </span>
                  </button>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Blog content
                </label>

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
                          style={
                            font.value ? { fontFamily: font.value } : undefined
                          }
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
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                    >
                      <MdFormatItalic size={20} />
                    </ToolButton>

                    <ToolButton
                      title="Underline"
                      active={editor.isActive("underline")}
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
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
                                  currentColor.toLowerCase() ===
                                  color.toLowerCase()
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
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                    >
                      <MdFormatListBulleted size={20} />
                    </ToolButton>

                    <ToolButton
                      title="Numbered list"
                      active={editor.isActive("orderedList")}
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                    >
                      <MdFormatListNumbered size={20} />
                    </ToolButton>

                    <ToolButton
                      title="Quote"
                      active={editor.isActive("blockquote")}
                      onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                      }
                    >
                      <MdFormatQuote size={20} />
                    </ToolButton>

                    <span className="mx-1 h-6 border-l border-slate-200" />

                    <ToolButton
                      title="Align left"
                      active={editor.isActive({ textAlign: "left" })}
                      onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                      }
                    >
                      <MdFormatAlignLeft size={20} />
                    </ToolButton>

                    <ToolButton
                      title="Align center"
                      active={editor.isActive({ textAlign: "center" })}
                      onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                      }
                    >
                      <MdFormatAlignCenter size={20} />
                    </ToolButton>

                    <ToolButton
                      title="Align right"
                      active={editor.isActive({ textAlign: "right" })}
                      onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                      }
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

                    <ToolButton
                      title="Insert image from URL"
                      onClick={addInlineImage}
                    >
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

                <p className="mt-2 text-xs text-slate-500">
                  Select text before applying formatting, color or a link.
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
                {submitting
                  ? isEditing
                    ? "Updating..."
                    : "Publishing..."
                  : isEditing
                    ? "Update Blog"
                    : "Publish Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {cropSource && (
        <CoverCropper
          source={cropSource}
          onCancel={() => setCropSource(null)}
          onApply={handleCropApply}
        />
      )}
    </>
  );
};

export default CreateBlog;
