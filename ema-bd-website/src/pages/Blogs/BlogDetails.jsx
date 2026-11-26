import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import ErrorPage from "../Error/Error";
import DOMPurify from "dompurify";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { API_URL, imageUrl, formatDate, isHtmlContent } from "./BlogUtils";

const VISITOR_ID_KEY = "ema-blog-visitor-id";
const VISITOR_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0F2A5F] md:text-base";

const blogContentStyles = [
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

const createVisitorId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto?.getRandomValues !== "function") {
    throw new Error("Secure random IDs are unavailable.");
  }

  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const getVisitorId = () => {
  const storedVisitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (storedVisitorId && VISITOR_ID_PATTERN.test(storedVisitorId)) {
    return storedVisitorId;
  }

  const visitorId = createVisitorId();
  localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
};

const BlogDetails = () => {
  const { blogId } = useParams();
  const queryClient = useQueryClient();
  const [visitorId, setVisitorId] = useState("");
  const [visitorIdError, setVisitorIdError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const commentSubmissionInProgress = useRef(false);

  useEffect(() => {
    try {
      setVisitorId(getVisitorId());
    } catch (error) {
      console.error("Unable to initialize anonymous blog visitor ID:", error);
      setVisitorIdError("Likes are unavailable in this browser.");
    }
  }, []);

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

  const commentsQueryKey = ["blogComments", blogId];
  const commentsQuery = useQuery({
    queryKey: commentsQueryKey,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/blogs/${blogId}/comments`);
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to load comments.");
      }

      return result.comments;
    },
    enabled: Boolean(blog),
  });

  const likesQueryKey = ["blogLikes", blogId, visitorId];
  const likesQuery = useQuery({
    queryKey: likesQueryKey,
    queryFn: async () => {
      const query = new URLSearchParams({ visitorId });
      const response = await fetch(
        `${API_URL}/blogs/${blogId}/likes?${query.toString()}`,
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to load likes.");
      }

      return result;
    },
    enabled: Boolean(blog && visitorId),
  });

  const likeMutation = useMutation({
    mutationFn: async (liked) => {
      const response = await fetch(`${API_URL}/blogs/${blogId}/likes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, liked }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to update likes.");
      }

      return result;
    },
    onMutate: async (liked) => {
      await queryClient.cancelQueries({ queryKey: likesQueryKey });
      const previousLikes = queryClient.getQueryData(likesQueryKey);

      if (previousLikes) {
        queryClient.setQueryData(likesQueryKey, {
          ...previousLikes,
          liked,
          count: Math.max(0, previousLikes.count + (liked ? 1 : -1)),
        });
      }

      return { previousLikes };
    },
    onError: (_error, _liked, context) => {
      if (context?.previousLikes) {
        queryClient.setQueryData(likesQueryKey, context.previousLikes);
      }
    },
    onSuccess: (likes) => {
      queryClient.setQueryData(likesQueryKey, likes);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: likesQueryKey }),
  });

  const commentMutation = useMutation({
    mutationFn: async (comment) => {
      const response = await fetch(`${API_URL}/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "You've submitted comments too frequently. Please try again later.",
          );
        }
        throw new Error(result.message || "Unable to submit comment.");
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.setQueryData(commentsQueryKey, (comments = []) => [
        result.data,
        ...comments,
      ]);
      return queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    },
  });

  if (isLoading) {
    return <BlogDetailsSkeleton />;
  }

  if (error || !blog) {
    return <ErrorPage error={error?.message ?? "Blog not found"} />;
  }
  const isHtml = isHtmlContent(blog.text);
  const safeHtml = isHtml
    ? DOMPurify.sanitize(blog.text, { ADD_ATTR: ["target"] }) // keep target="_blank" on links
    : "";

  const comments = commentsQuery.data || [];

  const recentPosts = [...allBlogs]
    .filter((b) => b._id !== blog._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (commentSubmissionInProgress.current || commentMutation.isPending) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setCommentError("");
    setCommentSuccess("");
    commentSubmissionInProgress.current = true;

    try {
      await commentMutation.mutateAsync({
        name: data.get("name"),
        email: data.get("email"),
        comment: data.get("comment"),
        commentReference: data.get("commentReference"),
      });
      form.reset();
      setCommentSuccess("Comment posted successfully!");
    } catch (error) {
      setCommentError(error.message || "Unable to submit comment.");
    } finally {
      commentSubmissionInProgress.current = false;
    }
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
          {isHtml ? (
            <article
              className={`mt-8 break-words text-sm leading-relaxed text-slate-700 md:mt-10 md:text-base md:leading-8 ${blogContentStyles}`}
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          ) : (
            <article className="mt-8 whitespace-pre-line break-words text-sm leading-relaxed text-slate-700 md:mt-10 md:text-base md:leading-8">
              {blog.text}
            </article>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={() => likeMutation.mutate(!likesQuery.data?.liked)}
              disabled={
                !visitorId ||
                likesQuery.isLoading ||
                Boolean(likesQuery.error) ||
                likeMutation.isPending
              }
              aria-pressed={Boolean(likesQuery.data?.liked)}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                likesQuery.data?.liked
                  ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:text-red-600"
              }`}
            >
              {likesQuery.data?.liked ? (
                <MdFavorite aria-hidden="true" size={18} />
              ) : (
                <MdFavoriteBorder aria-hidden="true" size={18} />
              )}
              {likeMutation.isPending
                ? "Updating..."
                : likesQuery.isLoading
                  ? "Loading likes..."
                  : likesQuery.data?.liked
                    ? "Unlike"
                    : "Like"}
              <span>({likesQuery.data?.count ?? 0})</span>
            </button>
            {(visitorIdError || likesQuery.error || likeMutation.error) && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {visitorIdError ||
                  likesQuery.error?.message ||
                  likeMutation.error?.message}
              </p>
            )}
          </div>

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
              <div
                aria-hidden="true"
                className="absolute -left-[10000px] h-px w-px overflow-hidden"
              >
                <label htmlFor="commentReference">Leave this field empty</label>
                <input
                  id="commentReference"
                  name="commentReference"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

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
                    maxLength={100}
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
                    maxLength={254}
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
                  maxLength={2000}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                disabled={commentMutation.isPending}
                className="w-full rounded-full bg-[#0F2A5F] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto md:text-sm"
              >
                {commentMutation.isPending ? "Submitting..." : "Post comment"}
              </button>
            </form>
            {commentError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {commentError}
              </p>
            )}
            {commentSuccess && (
              <p role="status" className="mt-3 text-sm text-green-700">
                {commentSuccess}
              </p>
            )}
          </section>

          {/* Comments */}
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-slate-900 md:text-3xl">
              Comments ({comments.length})
            </h2>

            {commentsQuery.isLoading ? (
              <p role="status" className="text-xs text-slate-500 md:text-base">
                Loading comments...
              </p>
            ) : commentsQuery.error ? (
              <p role="alert" className="text-xs text-red-600 md:text-base">
                {commentsQuery.error.message}
              </p>
            ) : comments.length === 0 ? (
              <p className="text-xs text-slate-500 md:text-base">
                No approved comments yet. Be the first to ask a question.
              </p>
            ) : (
              <ul className="space-y-4">
                {comments.map((comment, index) => (
                  <li
                    key={`${comment.createdAt}-${index}`}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5"
                  >
                    <div
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F2A5F] text-sm font-semibold text-white"
                    >
                      {comment.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 md:text-base">
                        {comment.name}
                      </p>
                      <p className="mt-1 whitespace-pre-line break-words text-sm text-slate-600 md:text-base">
                        {comment.comment}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(comment.createdAt)}
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
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
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
