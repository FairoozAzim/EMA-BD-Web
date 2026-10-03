import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import BlogCard from "../../../pages/Blogs/BlogCard";
import { API_URL } from "../../../pages/Blogs/BlogUtils";

const HomeBlogs = () => {
  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
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

  const latestBlogs = useMemo(() => {
    return [...blogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [blogs]);

  if (isError) {
    return null;
  }

  return (
    <section className="bg-slate-50 px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#0F2A5F]" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F2A5F]">
              From Our Blog
            </span>

            <span className="h-px w-10 bg-[#0F2A5F]" />
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Latest Stories
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-xs text-slate-600 md:text-base">
            Explore scholarship guides, community updates, achievements, and
            stories from the Erasmus Mundus Association Bangladesh community.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-full">
                  <div className="aspect-[16/10] animate-pulse rounded-2xl bg-slate-200" />

                  <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />

                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : latestBlogs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500 md:text-base">
                No blog posts available yet.
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        {!isLoading && latestBlogs.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/blogs"
              className="group inline-flex items-center gap-2 rounded-lg bg-[#0F2A5F] px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b214c] hover:shadow-lg md:px-6 md:py-3.5 md:text-sm"
            >
              View All Blogs

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBlogs;