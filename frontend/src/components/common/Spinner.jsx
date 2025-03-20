import PropTypes from 'prop-types';

const Spinner = ({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  showLabel = false,
  centered = false,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };

  // Variant classes
  const variantClasses = {
    primary: 'border-primary-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    black: 'border-black border-t-transparent',
    success: 'border-green-600 border-t-transparent',
    danger: 'border-red-600 border-t-transparent',
    warning: 'border-yellow-600 border-t-transparent',
    info: 'border-blue-600 border-t-transparent'
  };

  // Label size classes
  const labelSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerClasses = `
    inline-block rounded-full animate-spin
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const containerClasses = `
    inline-flex flex-col items-center
    ${centered ? 'fixed inset-0 flex items-center justify-center bg-black/20' : ''}
  `;

  return (
    <div className={containerClasses} role="status" {...props}>
      <div className={spinnerClasses} />
      {showLabel && (
        <span className={`mt-2 ${labelSizeClasses[size]} text-gray-700 dark:text-gray-200`}>
          {label}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'white',
    'black',
    'success',
    'danger',
    'warning',
    'info'
  ]),
  label: PropTypes.string,
  showLabel: PropTypes.bool,
  centered: PropTypes.bool,
  className: PropTypes.string
};

// Dots Spinner Component
export const DotsSpinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-1 w-1',
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    white: 'bg-white',
    black: 'bg-black',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  };

  return (
    <div className={`flex space-x-2 ${className}`} role="status" {...props}>
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className={`
            rounded-full
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            animate-pulse
          `}
          style={{
            animationDelay: `${(dot - 1) * 0.15}s`
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

DotsSpinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'white',
    'black',
    'success',
    'danger',
    'warning',
    'info'
  ]),
  className: PropTypes.string
};

// Pulse Spinner Component
export const PulseSpinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Variant classes
  const variantClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    black: 'text-black',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} ${className}`}
      role="status"
      {...props}
    >
      <div className={`animate-ping absolute inline-flex h-full w-full rounded-full ${variantClasses[variant]} opacity-75`} />
      <div className={`relative inline-flex rounded-full h-3 w-3 ${variantClasses[variant]}`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

PulseSpinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'white',
    'black',
    'success',
    'danger',
    'warning',
    'info'
  ]),
  className: PropTypes.string
};

export default Spinner;