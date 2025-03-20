import PropTypes from 'prop-types';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  dot = false,
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium';

  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-sm',
    md: 'px-3 py-1 text-sm',
    lg: 'px-3.5 py-1.5 text-base'
  };

  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  // Variant classes
  const variantClasses = {
    primary: `
      bg-primary-100 text-primary-800
      dark:bg-primary-900 dark:text-primary-300
    `,
    secondary: `
      bg-gray-100 text-gray-800
      dark:bg-gray-700 dark:text-gray-300
    `,
    success: `
      bg-green-100 text-green-800
      dark:bg-green-900 dark:text-green-300
    `,
    danger: `
      bg-red-100 text-red-800
      dark:bg-red-900 dark:text-red-300
    `,
    warning: `
      bg-yellow-100 text-yellow-800
      dark:bg-yellow-900 dark:text-yellow-300
    `,
    info: `
      bg-blue-100 text-blue-800
      dark:bg-blue-900 dark:text-blue-300
    `,
    outline: `
      border border-current
      text-gray-600 dark:text-gray-400
    `
  };

  // Dot colors
  const dotColors = {
    primary: 'bg-primary-400 dark:bg-primary-500',
    secondary: 'bg-gray-400 dark:bg-gray-500',
    success: 'bg-green-400 dark:bg-green-500',
    danger: 'bg-red-400 dark:bg-red-500',
    warning: 'bg-yellow-400 dark:bg-yellow-500',
    info: 'bg-blue-400 dark:bg-blue-500'
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`
            inline-block w-2 h-2 rounded-full mr-2
            ${dotColors[variant]}
          `}
        />
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={`
            ml-1.5 -mr-1 h-4 w-4 rounded-full
            inline-flex items-center justify-center
            hover:bg-black hover:bg-opacity-10
            dark:hover:bg-white dark:hover:bg-opacity-10
            focus:outline-none
          `}
        >
          <span className="sr-only">Remove</span>
          <svg
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'outline'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  dot: PropTypes.bool,
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
  className: PropTypes.string
};

// Status Badge Component
export const StatusBadge = ({
  status,
  size = 'sm',
  className = '',
  ...props
}) => {
  const statusConfig = {
    active: {
      variant: 'success',
      label: 'Active',
      dot: true
    },
    inactive: {
      variant: 'secondary',
      label: 'Inactive',
      dot: true
    },
    pending: {
      variant: 'warning',
      label: 'Pending',
      dot: true
    },
    error: {
      variant: 'danger',
      label: 'Error',
      dot: true
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={config.dot}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['active', 'inactive', 'pending', 'error']).isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  className: PropTypes.string
};

// Counter Badge Component
export const CounterBadge = ({
  count,
  max = 99,
  size = 'sm',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge
      variant={variant}
      size={size}
      className={`min-w-[1.5em] text-center ${className}`}
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

CounterBadge.propTypes = {
  count: PropTypes.number.isRequired,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'outline'
  ]),
  className: PropTypes.string
};

export default Badge;