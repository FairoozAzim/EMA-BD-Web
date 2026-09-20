import { Link } from "react-router-dom";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

export const imageUrl = (file) => `${API_URL}/uploads/${file}`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const BlogCard = ({ blog }) => {
  return (
    // h-full lets the card stretch to the tallest card in its grid row
    <article className="h-full">
      <Link
        to={`/blogs/${blog._id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2A5F]"
      >
        {/* Image */}
        <div className="aspect-[16/10] shrink-0 overflow-hidden bg-slate-200">
          <img
            src={imageUrl(blog.blogImage)}
            alt={blog.title}
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Body */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <h3 className="line-clamp-2 break-words text-lg font-bold leading-snug text-[#0F2A5F] md:text-xl">
            {blog.title}
          </h3>

          {/* flex-1 pushes the footer to the bottom on every card */}
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600 md:text-base">
            {blog.text}
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3 sm:mt-5 sm:gap-4 sm:pt-4">
            <div className="min-w-0 text-xs md:text-sm">
              <p className="truncate font-semibold text-slate-800">
                {blog.author}
              </p>
              <p className="mt-0.5 text-slate-500">{formatDate(blog.date)}</p>
            </div>

            <span className="shrink-0 text-xs font-semibold text-[#0F2A5F] decoration-amber-400 decoration-2 underline-offset-4 group-hover:underline md:text-sm">
              Read post
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;