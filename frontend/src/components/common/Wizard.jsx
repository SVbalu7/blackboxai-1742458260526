import { useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Stepper from './Stepper';

// Wizard Context
const WizardContext = createContext({});

const Wizard = ({
  steps,
  initialStep = 0,
  onComplete,
  onCancel,
  validateStep,
  showStepper = true,
  showNavigation = true,
  className = '',
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepStates, setStepStates] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize step states
  useEffect(() => {
    const states = {};
    steps.forEach((_, index) => {
      states[index] = {
        visited: index === initialStep,
        completed: false,
        data: null
      };
    });
    setStepStates(states);
  }, [steps, initialStep]);

  // Navigate to next step
  const next = async (data) => {
    if (currentStep >= steps.length - 1) return;

    // Validate current step if validator provided
    if (validateStep) {
      try {
        await validateStep(currentStep, data);
      } catch (error) {
        return;
      }
    }

    // Update step states
    setStepStates((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        completed: true,
        data
      },
      [currentStep + 1]: {
        ...prev[currentStep + 1],
        visited: true
      }
    }));

    setCurrentStep(currentStep + 1);
  };

  // Navigate to previous step
  const previous = () => {
    if (currentStep <= 0) return;
    setCurrentStep(currentStep - 1);
  };

  // Navigate to specific step
  const goTo = (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    if (!stepStates[stepIndex].visited) return;

    setCurrentStep(stepIndex);
  };

  // Handle completion
  const complete = async (data) => {
    if (!onComplete) return;

    setIsSubmitting(true);
    try {
      // Validate final step if validator provided
      if (validateStep) {
        await validateStep(currentStep, data);
      }

      // Collect all step data
      const formData = {};
      Object.entries(stepStates).forEach(([step, state]) => {
        if (state.data) {
          formData[step] = state.data;
        }
      });
      formData[currentStep] = data;

      await onComplete(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Context value
  const contextValue = {
    currentStep,
    stepStates,
    next,
    previous,
    goTo,
    complete,
    isSubmitting
  };

  return (
    <WizardContext.Provider value={contextValue}>
      <div className={`space-y-8 ${className}`} {...props}>
        {/* Stepper */}
        {showStepper && (
          <Stepper
            steps={steps.map((step) => ({
              title: step.title,
              description: step.description,
              completed: stepStates[steps.indexOf(step)]?.completed
            }))}
            currentStep={currentStep}
            onClick={goTo}
          />
        )}

        {/* Step Content */}
        <div className="relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`
                transition-opacity duration-200
                ${currentStep === index ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}
              `}
            >
              {typeof step.content === 'function'
                ? step.content(contextValue)
                : step.content}
            </div>
          ))}
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={previous}
                disabled={currentStep === 0 || isSubmitting}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (currentStep === steps.length - 1) {
                    complete();
                  } else {
                    next();
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    {currentStep === steps.length - 1 ? 'Submitting' : 'Processing'}
                  </>
                ) : (
                  currentStep === steps.length - 1 ? 'Complete' : 'Next'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </WizardContext.Provider>
  );
};

Wizard.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
    })
  ).isRequired,
  initialStep: PropTypes.number,
  onComplete: PropTypes.func,
  onCancel: PropTypes.func,
  validateStep: PropTypes.func,
  showStepper: PropTypes.bool,
  showNavigation: PropTypes.bool,
  className: PropTypes.string
};

// Hook for accessing wizard context
export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a Wizard component');
  }
  return context;
};

// Form Wizard Component
export const FormWizard = ({
  steps,
  onComplete,
  initialValues = {},
  ...props
}) => {
  const [formData, setFormData] = useState(initialValues);

  const handleStepSubmit = (stepData) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData
    }));
  };

  return (
    <Wizard
      steps={steps.map((step) => ({
        ...step,
        content: () => step.form({
          onSubmit: handleStepSubmit,
          initialValues: formData
        })
      }))}
      onComplete={() => onComplete(formData)}
      {...props}
    />
  );
};

FormWizard.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      form: PropTypes.func.isRequired
    })
  ).isRequired,
  onComplete: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};

export default Wizard;