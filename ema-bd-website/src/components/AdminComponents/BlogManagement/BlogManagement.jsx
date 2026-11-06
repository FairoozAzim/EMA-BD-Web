import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Pagination from "../../Pagination/Pagination";
import {
  MdAdd,
  MdDeleteOutline,
  MdEdit,
  MdRefresh,
  MdArticle,
  MdPerson,
  MdCalendarToday,
  MdFavorite,
} from "react-icons/md";

import CreateBlog from "./CreateBlog";

const API = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 12;

// Fetch all blogs
const fetchBlogs = async () => {
  const response = await fetch(`${API}/blogs`);

  if (!response.ok) {
    throw new Error("Failed to load blogs.");
  }

  const data = await response.json();

  // Your current GET /blogs endpoint returns an array.
  return Array.isArray(data) ? data : data.data || [];
};

// Convert TipTap HTML into plain text for the card excerpt.
const getPlainText = (html = "") => {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

// Get image URL from the filename saved by Multer.
const getBlogImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API}/uploads/${image}`;
};

// Sort blogs newest first.
const sortBlogsByNewest = (blogs) => {
  const items = [...(blogs || [])];

  const getTimestamp = (blog) => {
    if (blog.createdAt) {
      const timestamp = new Date(blog.createdAt).getTime();

      if (!Number.isNaN(timestamp)) {
        return timestamp;
      }
    }

    // MongoDB ObjectId contains its creation timestamp.
    if (typeof blog._id === "string" && /^[a-f\d]{24}$/i.test(blog._id)) {
      return parseInt(blog._id.slice(0, 8), 16) * 1000;
    }

    return null;
  };

  const hasTimestamps = items.some((blog) => getTimestamp(blog) !== null);

  // If no timestamps exist, assume the API returns oldest first.
  if (!hasTimestamps) {
    return items.reverse();
  }

  return items.sort((a, b) => (getTimestamp(b) || 0) - (getTimestamp(a) || 0));
};

const BlogManagement = () => {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch blogs
  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      Swal.fire({
        title: "Failed to load blogs",
        text: error?.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    }
  }, [isError, error]);

  // Reset pagination when blog count changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [blogs.length]);

  // Sort newest first.
  const sortedBlogs = useMemo(() => {
    return sortBlogsByNewest(blogs);
  }, [blogs]);

  // Paginate blogs.
  const paginatedBlogs = sortedBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Create blog modal.
  const openCreateModal = () => {
    setSelectedBlog(null);
    setShowModal(true);
  };

  // Edit blog modal.
  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  // Close modal.
  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  // Called after CreateBlog successfully creates or updates a blog.
  const handleBlogSaved = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["blogs"],
    });

    setShowModal(false);
    setSelectedBlog(null);
  };

  // Delete blog mutation.
  const deleteMutation = useMutation({
    mutationFn: async (blogId) => {
      const response = await fetch(`${API}/blogs/${blogId}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete blog.");
      }

      if (result.deletedCount === 0 || result.success === false) {
        throw new Error("The blog could not be deleted.");
      }

      return result;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });

      await Swal.fire({
        title: "Deleted!",
        text: "The blog has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#0F2A5F",
      });
    },

    onError: (error) => {
      Swal.fire({
        title: "Delete failed",
        text: error.message || "Could not delete the blog.",
        icon: "error",
        confirmButtonColor: "#0F2A5F",
      });
    },
  });

  // Confirm and delete blog.
  const handleDelete = async (blog) => {
    const result = await Swal.fire({
      title: "Delete this blog?",
      text: `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    deleteMutation.mutate(blog._id);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F2A5F] text-white shadow-sm">
              <MdArticle size={26} />
            </div>

            <h1 className="text-2xl font-bold text-[#0F2A5F] sm:text-3xl">
              Blog Management
            </h1>
          </div>

          <p className="text-sm text-slate-500 sm:text-base">
            Create, edit and manage EMA-BD blog articles.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2A5F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b7b]"
        >
          <MdAdd size={22} />
          Create a Blog
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total blogs</p>

              <p className="mt-2 text-3xl font-bold text-[#0F2A5F]">
                {isLoading ? "—" : blogs.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0F2A5F]">
              <MdArticle size={27} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Blog listings
              </p>

              <p className="mt-2 text-lg font-bold text-slate-800">
                {isLoading
                  ? "Loading..."
                  : blogs.length
                    ? "Available"
                    : "No blogs yet"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh blogs"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-[#0F2A5F] disabled:opacity-50"
            >
              <MdRefresh
                size={23}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Blog list heading */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">All Blogs</h2>

          <p className="mt-1 text-sm text-slate-500">
            Review, edit or remove published blog articles.
          </p>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading blogs...
          </div>
        ) : isError ? (
          /* Error */
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
          >
            <p className="font-semibold text-red-700">Unable to load blogs</p>

            <p className="mt-2 text-sm text-red-600">
              {error?.message || "Please check your connection and try again."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-[#0F2A5F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#173b7b]"
            >
              Try again
            </button>
          </div>
        ) : paginatedBlogs.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <MdArticle className="mx-auto mb-4 text-5xl text-slate-300" />

            <h3 className="text-lg font-semibold text-slate-800">
              No blogs found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first blog to get started.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F2A5F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#173b7b]"
            >
              <MdAdd size={20} />
              Create a Blog
            </button>
          </div>
        ) : (
          /* Blog cards */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedBlogs.map((blog) => {
              const imageUrl = getBlogImageUrl(blog.blogImage);
              const excerpt = getPlainText(blog.text);

              return (
                <article
                  key={blog._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Cover image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={blog.title || "Blog cover"}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <MdArticle size={48} />
                      </div>
                    )}
                  </div>

                  {/* Blog details */}
                  <div className="p-5">
                    <h3 className="line-clamp-2 min-h-14 text-lg font-bold text-slate-800">
                      {blog.title || "Untitled blog"}
                    </h3>

                    <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-500">
                      {excerpt || "No blog content available."}
                    </p>

                    {/* Author and date */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MdPerson size={16} className="text-[#0F2A5F]" />
                        {blog.author || "Unknown author"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <MdCalendarToday size={15} className="text-[#0F2A5F]" />
                        {blog.date || "Date unavailable"}
                      </span>
                    </div>

                    {/* Likes */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <MdFavorite size={16} className="text-red-500" />
                      {blog.likes || 0} likes
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(blog)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-[#0F2A5F] transition hover:bg-blue-100"
                      >
                        <MdEdit size={18} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(blog)}
                        disabled={deleteMutation.isPending}
                        aria-label={`Delete ${blog.title}`}
                        className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Pagination */}
      {sortedBlogs.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={sortedBlogs.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Create / Edit modal */}
      {showModal && (
        <CreateBlog
          editBlog={selectedBlog}
          onClose={closeModal}
          onCreated={handleBlogSaved}
        />
      )}
    </div>
  );
};

export default BlogManagement;
