import PropTypes from 'prop-types';

const Stepper = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: {
      text: 'text-sm',
      icon: 'h-6 w-6',
      connector: 'h-0.5'
    },
    md: {
      text: 'text-base',
      icon: 'h-8 w-8',
      connector: 'h-0.5'
    },
    lg: {
      text: 'text-lg',
      icon: 'h-10 w-10',
      connector: 'h-1'
    }
  };

  // Variant classes
  const variantClasses = {
    default: {
      active: 'bg-primary-600 text-white',
      completed: 'bg-primary-600 text-white',
      pending: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
      connector: {
        active: 'bg-primary-600',
        pending: 'bg-gray-200 dark:bg-gray-700'
      }
    },
    outlined: {
      active: 'border-2 border-primary-600 text-primary-600',
      completed: 'border-2 border-primary-600 bg-primary-600 text-white',
      pending: 'border-2 border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400',
      connector: {
        active: 'bg-primary-600',
        pending: 'bg-gray-200 dark:bg-gray-700'
      }
    },
    dots: {
      active: 'bg-primary-600',
      completed: 'bg-primary-600',
      pending: 'bg-gray-200 dark:bg-gray-700',
      connector: {
        active: 'bg-primary-600',
        pending: 'bg-gray-200 dark:bg-gray-700'
      }
    }
  };

  const isStepCompleted = (index) => index < currentStep;
  const isStepActive = (index) => index === currentStep;

  return (
    <div
      className={`
        ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
        flex
        ${className}
      `}
      {...props}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          className={`
            flex
            ${orientation === 'vertical' ? 'flex-col' : 'flex-1'}
            ${index !== steps.length - 1 ? 'items-center' : ''}
          `}
        >
          {/* Step */}
          <div className="flex items-center">
            {/* Step Icon/Number */}
            <button
              onClick={() => onStepClick && onStepClick(index)}
              disabled={!onStepClick}
              className={`
                flex items-center justify-center rounded-full
                ${sizeClasses[size].icon}
                ${
                  isStepCompleted(index)
                    ? variantClasses[variant].completed
                    : isStepActive(index)
                    ? variantClasses[variant].active
                    : variantClasses[variant].pending
                }
                ${onStepClick ? 'cursor-pointer' : 'cursor-default'}
                transition-colors duration-200
              `}
            >
              {variant === 'dots' ? (
                <span className="sr-only">{step.label}</span>
              ) : isStepCompleted(index) ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </button>

            {/* Step Label */}
            {variant !== 'dots' && (
              <div className={`ml-3 ${sizeClasses[size].text}`}>
                <div
                  className={`
                    font-medium
                    ${
                      isStepActive(index)
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-gray-500 dark:text-gray-400">
                    {step.description}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Connector */}
          {index !== steps.length - 1 && (
            <div
              className={`
                ${orientation === 'vertical' ? 'w-0.5 h-8 ml-4' : `${sizeClasses[size].connector} w-full mx-4`}
                ${
                  isStepCompleted(index)
                    ? variantClasses[variant].connector.active
                    : variantClasses[variant].connector.pending
                }
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['default', 'outlined', 'dots']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

// Step Content Component
export const StepContent = ({
  step,
  currentStep,
  children,
  className = '',
  ...props
}) => {
  if (step !== currentStep) return null;

  return (
    <div
      className={`mt-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

StepContent.propTypes = {
  step: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

// Step Actions Component
export const StepActions = ({
  onNext,
  onPrev,
  onFinish,
  isFirstStep,
  isLastStep,
  nextLabel = 'Next',
  prevLabel = 'Previous',
  finishLabel = 'Finish',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        mt-8 flex justify-between
        ${className}
      `}
      {...props}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirstStep}
        className={`
          px-4 py-2 text-sm font-medium rounded-md
          ${
            isFirstStep
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          }
          border border-gray-300 dark:border-gray-600
        `}
      >
        {prevLabel}
      </button>
      <button
        type="button"
        onClick={isLastStep ? onFinish : onNext}
        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
      >
        {isLastStep ? finishLabel : nextLabel}
      </button>
    </div>
  );
};

StepActions.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onFinish: PropTypes.func,
  isFirstStep: PropTypes.bool.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  nextLabel: PropTypes.string,
  prevLabel: PropTypes.string,
  finishLabel: PropTypes.string,
  className: PropTypes.string
};

export default Stepper;