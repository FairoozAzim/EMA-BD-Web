import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../Error/Error";
import { API_URL, formatDate, imageUrl } from "./BlogCard";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0F2A5F] md:text-base";

const BlogDetailsSkeleton = () => (
  <div className="min-h-screen">
    <div className="bg-[#0F2A5F]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="h-4 w-32 animate-pulse rounded bg-blue-900" />
        <div className="mt-6 h-10 w-full max-w-3xl animate-pulse rounded bg-blue-900" />
        <div className="mt-4 h-4 w-48 animate-pulse rounded bg-blue-900" />
      </div>
    </div>
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="aspect-[16/9] animate-pulse rounded-2xl bg-slate-200" />
      <div className="mt-8 max-w-3xl space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-slate-200" />
        ))}
      </div>
    </div>
  </div>
);

const BlogDetails = () => {
  const { blogId } = useParams();

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/blogs/${blogId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch blog");
      }

      const json = await res.json();
      return json.data; // API wraps the blog in { data }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Same key as the Blogs page, so this is usually served from cache
  const { data: allBlogs = [] } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/blogs`);
      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Comments live in local state only (not saved to a database)
  const [newComments, setNewComments] = useState([]);

  if (isLoading) {
    return <BlogDetailsSkeleton />;
  }

  if (error || !blog) {
    return <ErrorPage error={error?.message ?? "Blog not found"} />;
  }

  const comments = [...(blog.comments ?? []), ...newComments];

  const recentPosts = [...allBlogs]
    .filter((b) => b._id !== blog._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setNewComments((prev) => [
      ...prev,
      {
        name: data.get("name"),
        email: data.get("email"),
        comment: data.get("comment"),
      },
    ]);

    form.reset();
  };

  return (
    <div className="min-h-screen">
      {/* Header band */}
      <header className="bg-[#0F2A5F] text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <Link
            to="/blogs"
            className="inline-block text-xs font-semibold text-amber-300 decoration-amber-300 decoration-2 underline-offset-4 hover:underline md:text-sm"
          >
            Back to all posts
          </Link>

          <h1 className="mt-4 max-w-5xl break-words text-xl font-semibold leading-tight tracking-tight md:text-4xl">
            {blog.title}
          </h1>

          <p className="mt-4 text-xs text-blue-200 md:text-sm">
            By <span className="font-semibold text-white">{blog.author}</span>
            {" on "}
            {formatDate(blog.date)}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
        {/* Main column */}
        <div className="min-w-0 lg:col-span-8">
          {/* Banner */}
          <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-slate-200">
            <img
              src={imageUrl(blog.blogImage)}
              alt={blog.title}
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Body: whitespace-pre-line keeps the author's line breaks */}
          <article className="mt-8 whitespace-pre-line break-words text-sm leading-relaxed text-slate-700 md:mt-10 md:text-base md:leading-8">
            {blog.text}
          </article>

          {/* Comment form */}
          <section className="mt-14 border-t border-slate-200 pt-10">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 md:text-3xl">
                Have a question?
              </h2>

              <p className="mt-2 text-xs text-slate-500 md:text-base">
                Leave a comment below. Your email is never shown.
              </p>
            </div>

            <form
              onSubmit={handleCommentSubmit}
              className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 md:text-sm"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 md:text-sm"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 md:text-sm"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={4}
                  required
                  className={`${inputClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#0F2A5F] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:w-auto md:text-sm"
              >
                Post comment
              </button>
            </form>
          </section>

          {/* Comments */}
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-slate-900 md:text-3xl">
              Comments ({comments.length})
            </h2>

            {comments.length === 0 ? (
              <p className="text-xs text-slate-500 md:text-base">
                No comments yet. Be the first to ask a question.
              </p>
            ) : (
              <ul className="space-y-4">
                {comments.map((c, index) => (
                  <li
                    key={index}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5"
                  >
                    <div
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F2A5F] text-sm font-semibold text-white"
                    >
                      {c.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 md:text-base">
                        {c.name}
                      </p>
                      <p className="mt-1 whitespace-pre-line break-words text-sm text-slate-600 md:text-base">
                        {c.comment}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Sidebar */}
        {recentPosts.length > 0 && (
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                More posts
              </h2>

              <ul className="mt-6 space-y-5">
                {recentPosts.map((post) => (
                  <li key={post._id}>
                    <Link
                      to={`/blogs/${post._id}`}
                      className="group flex gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A5F]"
                    >
                      <div className="aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:w-32">
                        <img
                          src={imageUrl(post.blogImage)}
                          alt={post.title}
                          loading="lazy"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="line-clamp-3 text-sm font-bold leading-snug text-[#0F2A5F] decoration-amber-400 decoration-2 underline-offset-4 group-hover:underline md:text-base">
                          {post.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-500">
                          {formatDate(post.date)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;