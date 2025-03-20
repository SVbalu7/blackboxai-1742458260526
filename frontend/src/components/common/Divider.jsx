import PropTypes from 'prop-types';

const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  size = 'md',
  color = 'gray',
  label,
  labelPosition = 'center',
  spacing = 4,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: {
      line: orientation === 'horizontal' ? 'h-px' : 'w-px',
      text: 'text-xs',
      spacing: 'space-x-2'
    },
    sm: {
      line: orientation === 'horizontal' ? 'h-px' : 'w-px',
      text: 'text-sm',
      spacing: 'space-x-3'
    },
    md: {
      line: orientation === 'horizontal' ? 'h-px' : 'w-px',
      text: 'text-base',
      spacing: 'space-x-4'
    },
    lg: {
      line: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      text: 'text-lg',
      spacing: 'space-x-5'
    }
  };

  // Variant classes
  const variantClasses = {
    solid: '',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  };

  // Color classes
  const colorClasses = {
    gray: 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400',
    primary: 'border-primary-200 dark:border-primary-700 text-primary-500 dark:text-primary-400',
    success: 'border-green-200 dark:border-green-700 text-green-500 dark:text-green-400',
    warning: 'border-yellow-200 dark:border-yellow-700 text-yellow-500 dark:text-yellow-400',
    danger: 'border-red-200 dark:border-red-700 text-red-500 dark:text-red-400',
    info: 'border-blue-200 dark:border-blue-700 text-blue-500 dark:text-blue-400'
  };

  // Label position classes
  const labelPositionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={`
          inline-block h-full
          ${sizeClasses[size].line}
          border-l ${variantClasses[variant]}
          ${colorClasses[color]}
          ${className}
        `}
        style={{ margin: `0 ${spacing}px` }}
        role="separator"
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        className={`
          flex items-center
          ${labelPositionClasses[labelPosition]}
          ${className}
        `}
        role="separator"
        {...props}
      >
        <div
          className={`
            flex-grow border-t
            ${variantClasses[variant]}
            ${colorClasses[color]}
          `}
        />
        <span
          className={`
            px-3
            ${sizeClasses[size].text}
            ${colorClasses[color]}
          `}
        >
          {label}
        </span>
        <div
          className={`
            flex-grow border-t
            ${variantClasses[variant]}
            ${colorClasses[color]}
          `}
        />
      </div>
    );
  }

  return (
    <hr
      className={`
        border-t
        ${variantClasses[variant]}
        ${colorClasses[color]}
        ${className}
      `}
      style={{ margin: `${spacing}px 0` }}
      role="separator"
      {...props}
    />
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['solid', 'dashed', 'dotted']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  color: PropTypes.oneOf(['gray', 'primary', 'success', 'warning', 'danger', 'info']),
  label: PropTypes.node,
  labelPosition: PropTypes.oneOf(['left', 'center', 'right']),
  spacing: PropTypes.number,
  className: PropTypes.string
};

// Section Divider Component
export const SectionDivider = ({
  title,
  subtitle,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        relative
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-start">
        <div className="
          px-4 bg-white dark:bg-gray-800
          flex items-center space-x-3
        ">
          {icon && (
            <span className="text-gray-500 dark:text-gray-400">
              {icon}
            </span>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SectionDivider.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string
};

// List Divider Component
export const ListDivider = ({
  inset = false,
  className = '',
  ...props
}) => {
  return (
    <li
      role="separator"
      className={`
        border-t border-gray-200 dark:border-gray-700
        ${inset ? 'ml-12' : ''}
        ${className}
      `}
      {...props}
    />
  );
};

ListDivider.propTypes = {
  inset: PropTypes.bool,
  className: PropTypes.string
};

export default Divider;