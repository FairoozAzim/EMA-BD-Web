import { useEffect, useRef, useState } from "react";
import { MdOutlineFileUpload, MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import RichTextEditor, { useRichTextEditor } from "./RichTextEditor";
import CoverCropper from "./CoverCropper";

const API = import.meta.env.VITE_API_URL;

/* ---------- Cover image rules ---------- */
// The 16:9 ratio and max output size live in CoverCropper.jsx
const COVER_MIN_WIDTH = 800;
const COVER_MIN_HEIGHT = 450;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ---------- Helpers ---------- */
const warn = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonColor: "#0F2A5F",
  });

/* ---------- Main component ---------- */
const CreateBlog = ({ onClose, onCreated, editBlog = null }) => {
  const isEditing = Boolean(editBlog?._id);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [cropSource, setCropSource] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const coverInputRef = useRef(null);

  const editor = useRichTextEditor({
    placeholder: "Write your blog content here...",
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

                <RichTextEditor editor={editor} />
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