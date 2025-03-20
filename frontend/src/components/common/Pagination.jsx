import PropTypes from 'prop-types';
import Button from './Button';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
  variant = 'outline',
  className = '',
  ...props
}) => {
  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // +2 for dots blocks

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [
        ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
        '...',
        totalPages
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [
        1,
        '...',
        ...Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        )
      ];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        1,
        '...',
        ...Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
        '...',
        totalPages
      ];
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  // Button variants
  const buttonVariants = {
    outline: {
      active: 'primary',
      inactive: 'outline'
    },
    solid: {
      active: 'primary',
      inactive: 'secondary'
    }
  };

  return (
    <nav
      className={`flex items-center justify-center space-x-2 ${className}`}
      aria-label="Pagination"
      {...props}
    >
      {/* Previous Button */}
      {showPrevNext && (
        <Button
          variant={variant}
          size={size}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>
      )}

      {/* First Page */}
      {showFirstLast && currentPage > siblingCount + 2 && (
        <>
          <Button
            variant={buttonVariants[variant].inactive}
            size={size}
            onClick={() => onPageChange(1)}
            className={sizeClasses[size]}
          >
            1
          </Button>
          {currentPage > siblingCount + 3 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((pageNumber, index) =>
        pageNumber === '...' ? (
          <span key={`dots-${index}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <Button
            key={pageNumber}
            variant={
              pageNumber === currentPage
                ? buttonVariants[variant].active
                : buttonVariants[variant].inactive
            }
            size={size}
            onClick={() => onPageChange(pageNumber)}
            className={sizeClasses[size]}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
          >
            {pageNumber}
          </Button>
        )
      )}

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages - (siblingCount + 1) && (
        <>
          {currentPage < totalPages - (siblingCount + 2) && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <Button
            variant={buttonVariants[variant].inactive}
            size={size}
            onClick={() => onPageChange(totalPages)}
            className={sizeClasses[size]}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      {showPrevNext && (
        <Button
          variant={variant}
          size={size}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      )}
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['outline', 'solid']),
  className: PropTypes.string
};

// Simple Pagination Component
export const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <nav
      className={`flex items-center justify-between ${className}`}
      aria-label="Pagination"
      {...props}
    >
      <Button
        variant="outline"
        size={size}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size={size}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </nav>
  );
};

SimplePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Pagination;