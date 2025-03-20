import PropTypes from 'prop-types';

const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = true,
  labelPosition = 'right',
  animated = true,
  striped = false,
  className = '',
  ...props
}) => {
  // Calculate percentage
  const percentage = Math.round((value / max) * 100);

  // Size classes
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  };

  // Label classes
  const labelClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex items-center">
        {/* Label (left) */}
        {showLabel && labelPosition === 'left' && (
          <span className={`mr-2 ${labelClasses[size]} text-gray-700 dark:text-gray-300`}>
            {percentage}%
          </span>
        )}

        {/* Progress Bar */}
        <div className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <div
            className={`
              ${variantClasses[variant]}
              ${striped ? 'bg-stripes' : ''}
              ${animated ? 'animate-progress' : ''}
              rounded-full
            `}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>

        {/* Label (right) */}
        {showLabel && labelPosition === 'right' && (
          <span className={`ml-2 ${labelClasses[size]} text-gray-700 dark:text-gray-300`}>
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  showLabel: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['left', 'right']),
  animated: PropTypes.bool,
  striped: PropTypes.bool,
  className: PropTypes.string
};

// Circular Progress Component
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = true,
  thickness = 4,
  className = '',
  ...props
}) => {
  // Calculate percentage and circle properties
  const percentage = Math.round((value / max) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  // Variant classes
  const variantClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {/* SVG Circle */}
      <svg className="transform -rotate-90" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={thickness}
          stroke="currentColor"
          fill="none"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress Circle */}
        <circle
          className={`${variantClasses[variant]} transition-all duration-300`}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>

      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};

CircularProgress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  showLabel: PropTypes.bool,
  thickness: PropTypes.number,
  className: PropTypes.string
};

// Steps Progress Component
export const StepsProgress = ({
  steps,
  currentStep,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: {
      step: 'w-6 h-6',
      text: 'text-sm',
      connector: 'h-0.5'
    },
    md: {
      step: 'w-8 h-8',
      text: 'text-base',
      connector: 'h-1'
    },
    lg: {
      step: 'w-10 h-10',
      text: 'text-lg',
      connector: 'h-1'
    }
  };

  // Variant classes
  const variantClasses = {
    primary: {
      active: 'bg-primary-600 text-white',
      completed: 'bg-primary-600 text-white',
      pending: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    },
    secondary: {
      active: 'bg-gray-600 text-white',
      completed: 'bg-gray-600 text-white',
      pending: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  };

  return (
    <div
      className={`flex items-center ${className}`}
      {...props}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          className={`
            flex items-center
            ${index !== steps.length - 1 ? 'flex-1' : ''}
          `}
        >
          {/* Step Circle */}
          <div
            className={`
              flex items-center justify-center rounded-full
              ${sizeClasses[size].step}
              ${
                index < currentStep
                  ? variantClasses[variant].completed
                  : index === currentStep
                  ? variantClasses[variant].active
                  : variantClasses[variant].pending
              }
              transition-colors duration-200
            `}
          >
            {index < currentStep ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span>{index + 1}</span>
            )}
          </div>

          {/* Connector */}
          {index !== steps.length - 1 && (
            <div
              className={`
                flex-1 mx-2
                ${sizeClasses[size].connector}
                ${
                  index < currentStep
                    ? variantClasses[variant].completed
                    : 'bg-gray-200 dark:bg-gray-700'
                }
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
};

StepsProgress.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Progress;