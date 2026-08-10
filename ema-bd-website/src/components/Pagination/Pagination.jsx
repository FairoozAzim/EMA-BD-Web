import PropTypes from "prop-types";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPaginationNumbers = () => {
    const pages = [];

    if (currentPage > 2) {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }
    }

    if (currentPage > 1) {
      pages.push(currentPage - 1);
    }

    pages.push(currentPage);

    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
    }

    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-[#0F2A5F] hover:bg-[#0F2A5F] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        &lt;
      </button>

      {getPaginationNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
              currentPage === page
                ? "bg-[#0F2A5F] text-white shadow-md"
                : "border border-slate-300 bg-white text-slate-700 hover:border-[#0F2A5F] hover:bg-[#0F2A5F] hover:text-white"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 text-slate-500">
            ...
          </span>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-[#0F2A5F] hover:bg-[#0F2A5F] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        &gt;
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
