import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../Error/Error";
import BlogCard, { API_URL, formatDate, imageUrl } from "./BlogCard";

const BlogsSkeleton = () => (
  <div className="min-h-screen">
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <div className="mx-auto mt-5 h-10 w-64 animate-pulse rounded bg-slate-200" />
      <div className="mx-auto mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
    </section>
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="aspect-[4/3] animate-pulse sm:aspect-[16/9] lg:aspect-[16/6] rounded-2xl bg-slate-200" />
    </section>
    <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="aspect-[16/10] animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-6 w-full animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </section>
  </div>
);

const Blogs = () => {
  const {
    data: blogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/blogs`);
      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { latest, otherBlogs } = useMemo(() => {
    // copy before sorting so the cached query data isn't mutated
    const sorted = [...blogs].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    return { latest: sorted[0], otherBlogs: sorted.slice(1) };
  }, [blogs]);

  if (isLoading) {
    return <BlogsSkeleton />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="text-center">
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Our Blog
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs text-slate-600 md:text-base">
            Scholarship guides, team news and achievements from the Erasmus
            Mundus Association Bangladesh community.
          </p>
        </div>
      </section>

      {!latest ? (
        <section className="mx-auto max-w-7xl px-6 pb-20 text-center">
          <h2 className="text-xl font-bold text-slate-900 md:text-3xl">
            No posts yet
          </h2>
          <p className="mt-2 text-xs text-slate-500 md:text-base">
            New stories from EMA Bangladesh will show up here.
          </p>
        </section>
      ) : (
        <>
          {/* Latest post */}
          <section className="mx-auto max-w-7xl px-6 pb-12">
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl font-bold text-slate-900 md:text-3xl">
                Latest Post
              </h2>

              <p className="mt-2 text-xs text-slate-500 md:text-base">
                The newest story from EMA Bangladesh.
              </p>
            </div>

            <Link
              to={`/blogs/${latest._id}`}
              className="group grid gap-6 rounded-2xl bg-[#0F2A5F] p-4 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 sm:p-5 lg:grid-cols-12 lg:gap-10 lg:p-6"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-xl bg-blue-900 lg:col-span-7 lg:aspect-[16/10]">
                <img
                  src={imageUrl(latest.blogImage)}
                  alt={latest.title}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center lg:col-span-5 lg:pr-4">
                <h3 className="break-words text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  {latest.title}
                </h3>
                <p className="mt-4 line-clamp-3 text-sm text-blue-100 md:text-base">
                  {latest.text}
                </p>
                <p className="mt-6 text-xs text-blue-200 md:text-sm">
                  <span className="font-semibold text-white">
                    {latest.author}
                  </span>
                  {" on "}
                  {formatDate(latest.date)}
                </p>
                <span className="mt-5 inline-flex w-fit sm:mt-6 items-center rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#0F2A5F] transition group-hover:bg-amber-400 md:text-sm">
                  Read the post
                </span>
              </div>
            </Link>
          </section>

          {/* More posts */}
          {otherBlogs.length > 0 && (
            <section className="mx-auto max-w-7xl px-6 pb-20">
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl font-bold text-slate-900 md:text-3xl">
                  More Posts
                </h2>

                <p className="mt-2 text-xs text-slate-500 md:text-base">
                  Guides, announcements and community updates.
                </p>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                {otherBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Blogs;