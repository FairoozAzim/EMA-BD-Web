import { Link } from "react-router-dom";

export default function ErrorPage({ error }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl text-red-600">!</span>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Oops!</h1>
        <p className="mb-1 text-sm text-gray-600">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="mb-6 text-sm italic text-gray-500">
          {error || "Unknown error"}
        </p>

        <Link
          to="/"
          className="inline-block rounded-lg bg-[#17396d] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#102d59]"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}