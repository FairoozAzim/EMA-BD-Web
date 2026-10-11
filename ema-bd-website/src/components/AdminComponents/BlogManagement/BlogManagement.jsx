
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdAdd, MdArticle, MdRefresh } from "react-icons/md";

import BlogCard from "../../../pages/Blogs/BlogCard";
import CreateBlog from "./CreateBlog";
import AlumniSkeleton from "../../ui/AlumniSkeleton";

const API = import.meta.env.VITE_API_URL;

const fetchBlogs = async () => {
  const response = await fetch(`${API}/blogs`);

  if (!response.ok) {
    throw new Error("Failed to fetch blogs.");
  }

  return response.json();
};

const BlogManagement = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const handleBlogCreated = async () => {
    setIsCreateOpen(false);

    await queryClient.invalidateQueries({
      queryKey: ["blogs"],
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F2A5F] text-white shadow-sm">
              <MdArticle size={25} />
            </div>

            <h1 className="text-2xl font-bold text-[#0F2A5F] sm:text-3xl">
              Blog Management
            </h1>
          </div>

          <p className="text-sm text-slate-500 sm:text-base">
            Create, organize and manage EMA-BD blog posts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2A5F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b7b] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          <MdAdd size={22} />
          Create a new blog
        </button>
      </div>

      {/* Blog statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total blog posts
              </p>

              <p className="mt-2 text-3xl font-bold text-[#0F2A5F]">
                {isLoading ? "—" : blogs.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0F2A5F]">
              <MdArticle size={26} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Latest activity
              </p>

              <p className="mt-2 text-lg font-bold text-slate-800">
                {blogs.length > 0
                  ? "Blogs available"
                  : isLoading
                    ? "Loading..."
                    : "No posts yet"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh blog list"
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

      {/* Recent blogs */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Recent Blogs
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View your published blog posts.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#0F2A5F]">
            {blogs.length} posts
          </span>
        </div>

        {isLoading ? (
          <AlumniSkeleton />
        ) : isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
          >
            <p className="font-semibold text-red-700">
              Unable to load blog posts
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error?.message || "Please check your connection and try again."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-[#0F2A5F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173b7b]"
            >
              Try again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0F2A5F]">
              <MdArticle size={32} />
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              No blog posts yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Create your first blog post to share news, stories and updates
              with the EMA-BD community.
            </p>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F2A5F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#173b7b]"
            >
              <MdAdd size={20} />
              Create your first blog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* Create blog modal */}
      {isCreateOpen && (
        <CreateBlog
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleBlogCreated}
        />
      )}
    </div>
  );
};

export default BlogManagement;
