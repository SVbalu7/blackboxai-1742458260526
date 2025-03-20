import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinner } from '../../contexts/LoadingContext';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  type = 'button',
  className = '',
  onClick,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors duration-200';

  // Size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm leading-4',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-400',
    link: 'text-primary-600 hover:text-primary-700 underline focus:ring-0 disabled:text-primary-400',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:text-gray-400'
  };

  // Dark mode classes
  const darkClasses = {
    primary: 'dark:bg-primary-500 dark:hover:bg-primary-600 dark:disabled:bg-primary-700',
    secondary: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-800',
    outline: 'dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
    danger: 'dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-700',
    success: 'dark:bg-green-500 dark:hover:bg-green-600 dark:disabled:bg-green-700',
    warning: 'dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:disabled:bg-yellow-700',
    link: 'dark:text-primary-400 dark:hover:text-primary-300 dark:disabled:text-primary-600',
    ghost: 'dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:text-gray-600'
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Disabled classes
  const disabledClasses = (disabled || loading) ? 'cursor-not-allowed opacity-75' : '';

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${darkClasses[variant]}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `.trim();

  // Icon size based on button size
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  // Icon spacing based on button size
  const iconSpacing = {
    xs: 'mr-1',
    sm: 'mr-1.5',
    md: 'mr-2',
    lg: 'mr-2',
    xl: 'mr-3'
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner
            size={size === 'xs' ? 'sm' : 'md'}
            color={variant === 'outline' ? 'primary' : 'white'}
          />
          <span className="ml-2">{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={`${iconSizes[size]} ${iconSpacing[size]}`}>
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={`${iconSizes[size]} ml-${iconSpacing[size]}`}>
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'danger',
    'success',
    'warning',
    'link',
    'ghost'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  onClick: PropTypes.func
};

// Button Group Component
export const ButtonGroup = ({
  children,
  variant = 'primary',
  size = 'md',
  vertical = false,
  className = '',
  ...props
}) => {
  const groupClasses = `
    inline-flex
    ${vertical ? 'flex-col' : 'flex-row'}
    ${className}
  `.trim();

  return (
    <div className={groupClasses} role="group" {...props}>
      {children}
    </div>
  );
};

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  vertical: PropTypes.bool,
  className: PropTypes.string
};

// IconButton Component
export const IconButton = ({
  icon,
  'aria-label': ariaLabel,
  ...props
}) => (
  <Button
    {...props}
    aria-label={ariaLabel}
    className={`p-2 ${props.className || ''}`}
  >
    {icon}
  </Button>
);

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  'aria-label': PropTypes.string.isRequired
};

export default Button;