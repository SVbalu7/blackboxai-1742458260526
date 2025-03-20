import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  className = '',
  containerClassName = '',
  size = 'md',
  variant = 'outline',
  fullWidth = false,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'block w-full rounded-md focus:outline-none transition-colors duration-200';

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-2.5 text-lg'
  };

  // Variant classes
  const variantClasses = {
    outline: `
      border border-gray-300 
      focus:border-primary-500 focus:ring-1 focus:ring-primary-500
      disabled:bg-gray-100 disabled:cursor-not-allowed
      dark:border-gray-600 dark:bg-gray-700 dark:text-white
      dark:focus:border-primary-400 dark:focus:ring-primary-400
      dark:disabled:bg-gray-800
    `,
    filled: `
      border-0 bg-gray-100
      focus:bg-white focus:ring-2 focus:ring-primary-500
      disabled:bg-gray-200 disabled:cursor-not-allowed
      dark:bg-gray-700 dark:text-white
      dark:focus:bg-gray-600 dark:focus:ring-primary-400
      dark:disabled:bg-gray-800
    `,
    flushed: `
      border-0 border-b border-gray-300
      rounded-none focus:border-primary-500
      disabled:bg-transparent disabled:cursor-not-allowed
      dark:border-gray-600 dark:text-white
      dark:focus:border-primary-400
      dark:disabled:border-gray-700
    `
  };

  // Error classes
  const errorClasses = error ? `
    border-red-500 
    focus:border-red-500 focus:ring-red-500
    dark:border-red-400 
    dark:focus:border-red-400 dark:focus:ring-red-400
  ` : '';

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Icon container classes
  const iconContainerClasses = `
    absolute inset-y-0 flex items-center
    text-gray-400 dark:text-gray-500
    ${disabled ? 'cursor-not-allowed' : ''}
  `;

  // Combine all input classes
  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${errorClasses}
    ${widthClasses}
    ${startIcon ? 'pl-10' : ''}
    ${endIcon ? 'pr-10' : ''}
    ${className}
  `.trim();

  // Container classes
  const containerClasses = `
    relative
    ${fullWidth ? 'w-full' : ''}
    ${containerClassName}
  `.trim();

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={props.id}
          className={`
            block mb-2 text-sm font-medium
            ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}
            ${disabled ? 'cursor-not-allowed opacity-60' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className={`${iconContainerClasses} left-3`}>
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />

        {endIcon && (
          <div className={`${iconContainerClasses} right-3`}>
            {endIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={`mt-2 text-sm ${
            error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['outline', 'filled', 'flushed']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool
};

// TextArea component
export const TextArea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  size = 'md',
  variant = 'outline',
  fullWidth = false,
  disabled = false,
  required = false,
  rows = 4,
  ...props
}, ref) => {
  // Use the same classes as Input but adjust padding
  const textareaClasses = `
    block w-full rounded-md focus:outline-none transition-colors duration-200
    ${variant === 'outline' ? `
      border border-gray-300 
      focus:border-primary-500 focus:ring-1 focus:ring-primary-500
      disabled:bg-gray-100 disabled:cursor-not-allowed
      dark:border-gray-600 dark:bg-gray-700 dark:text-white
      dark:focus:border-primary-400 dark:focus:ring-primary-400
      dark:disabled:bg-gray-800
    ` : ''}
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label
          htmlFor={props.id}
          className={`
            block mb-2 text-sm font-medium
            ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}
            ${disabled ? 'cursor-not-allowed opacity-60' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        required={required}
        className={textareaClasses}
        {...props}
      />

      {(error || helperText) && (
        <p
          className={`mt-2 text-sm ${
            error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['outline', 'filled', 'flushed']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number
};

export default Input;