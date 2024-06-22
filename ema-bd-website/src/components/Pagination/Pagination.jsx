import { useState } from 'react';
import PropTypes from 'prop-types';
import './Pagination.css'; // Assuming you have some basic CSS for styling

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const [current, setCurrent] = useState(currentPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (page) => {
    setCurrent(page);
    onPageChange(page);
  };

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift('...');
    }
    if (current + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => handleClick(current - 1)}
        disabled={current === 1}
      >
        Previous
      </button>
      {getPaginationNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            className={`pagination-button ${current === page ? 'active' : ''}`}
            onClick={() => handleClick(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="pagination-ellipsis">
            {page}
          </span>
        )
      )}
      <button
        className="pagination-button"
        onClick={() => handleClick(current + 1)}
        disabled={current === totalPages}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  currentPage: 1,
};

export default Pagination;
