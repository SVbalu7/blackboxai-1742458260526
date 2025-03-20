import PropTypes from 'prop-types';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  // Variant classes
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: '',
    avatar: 'rounded-full',
    button: 'h-10 rounded-md',
    card: 'rounded-lg'
  };

  // Generate skeleton items
  const items = Array(count).fill(null);

  return (
    <div className="space-y-2" {...props}>
      {items.map((_, index) => (
        <div
          key={index}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${className}
          `}
          style={{
            width: width || '100%',
            height: height || (variant === 'avatar' ? '40px' : undefined)
          }}
        />
      ))}
    </div>
  );
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'circular', 'rectangular', 'avatar', 'button', 'card']),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  count: PropTypes.number,
  className: PropTypes.string
};

// Text Skeleton Component
export const TextSkeleton = ({
  lines = 3,
  lastLineWidth = '60%',
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {Array(lines - 1)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} variant="text" />
        ))}
      <Skeleton variant="text" width={lastLineWidth} />
    </div>
  );
};

TextSkeleton.propTypes = {
  lines: PropTypes.number,
  lastLineWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string
};

// Card Skeleton Component
export const CardSkeleton = ({
  hasImage = false,
  imageHeight = 200,
  hasHeader = true,
  hasFooter = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-lg shadow
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {hasImage && (
        <Skeleton
          variant="rectangular"
          height={imageHeight}
          className="w-full"
        />
      )}
      <div className="p-4 space-y-4">
        {hasHeader && (
          <div className="space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        )}
        <div className="space-y-2">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </div>
        {hasFooter && (
          <div className="flex justify-between items-center pt-4">
            <Skeleton variant="text" width={100} />
            <Skeleton variant="button" width={100} />
          </div>
        )}
      </div>
    </div>
  );
};

CardSkeleton.propTypes = {
  hasImage: PropTypes.bool,
  imageHeight: PropTypes.number,
  hasHeader: PropTypes.bool,
  hasFooter: PropTypes.bool,
  className: PropTypes.string
};

// Table Skeleton Component
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {hasHeader && (
        <div className="grid grid-cols-4 gap-4">
          {Array(columns)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} variant="text" className="h-8" />
            ))}
        </div>
      )}
      {Array(rows)
        .fill(null)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4">
            {Array(columns)
              .fill(null)
              .map((_, colIndex) => (
                <Skeleton key={colIndex} variant="text" className="h-6" />
              ))}
          </div>
        ))}
    </div>
  );
};

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  hasHeader: PropTypes.bool,
  className: PropTypes.string
};

// List Skeleton Component
export const ListSkeleton = ({
  items = 5,
  hasAvatar = false,
  hasAction = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {Array(items)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            {hasAvatar && <Skeleton variant="avatar" width={40} height={40} />}
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
            {hasAction && <Skeleton variant="button" width={100} />}
          </div>
        ))}
    </div>
  );
};

ListSkeleton.propTypes = {
  items: PropTypes.number,
  hasAvatar: PropTypes.bool,
  hasAction: PropTypes.bool,
  className: PropTypes.string
};

export default Skeleton;