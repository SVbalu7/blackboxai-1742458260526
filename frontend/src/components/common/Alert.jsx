import { useState } from 'react';
import PropTypes from 'prop-types';

const Alert = ({
  type = 'info',
  title,
  message,
  icon,
  dismissible = true,
  action,
  actionText,
  onAction,
  onClose,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Base classes
  const baseClasses = 'rounded-lg p-4';

  // Type-specific classes and icons
  const typeClasses = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/50',
      icon: 'text-blue-400 dark:text-blue-300',
      title: 'text-blue-800 dark:text-blue-200',
      text: 'text-blue-700 dark:text-blue-200',
      button: 'bg-blue-50 dark:bg-blue-900 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800',
      defaultIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/50',
      icon: 'text-green-400 dark:text-green-300',
      title: 'text-green-800 dark:text-green-200',
      text: 'text-green-700 dark:text-green-200',
      button: 'bg-green-50 dark:bg-green-900 text-green-500 hover:bg-green-100 dark:hover:bg-green-800',
      defaultIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/50',
      icon: 'text-yellow-400 dark:text-yellow-300',
      title: 'text-yellow-800 dark:text-yellow-200',
      text: 'text-yellow-700 dark:text-yellow-200',
      button: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800',
      defaultIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/50',
      icon: 'text-red-400 dark:text-red-300',
      title: 'text-red-800 dark:text-red-200',
      text: 'text-red-700 dark:text-red-200',
      button: 'bg-red-50 dark:bg-red-900 text-red-500 hover:bg-red-100 dark:hover:bg-red-800',
      defaultIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${baseClasses}
        ${typeClasses[type].container}
        ${className}
      `}
      role="alert"
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <span className={typeClasses[type].icon}>
            {icon || typeClasses[type].defaultIcon}
          </span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${typeClasses[type].title}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${typeClasses[type].text} ${title ? 'mt-2' : ''}`}>
            {message}
          </div>
          {action && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  className={`
                    px-2 py-1.5 rounded-md text-sm font-medium
                    ${typeClasses[type].button}
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-offset-${type}-50 focus:ring-${type}-600
                  `}
                  onClick={onAction}
                >
                  {actionText}
                </button>
              </div>
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`
                  inline-flex rounded-md p-1.5
                  ${typeClasses[type].button}
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  focus:ring-offset-${type}-50 focus:ring-${type}-600
                `}
                onClick={handleDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  message: PropTypes.node.isRequired,
  icon: PropTypes.node,
  dismissible: PropTypes.bool,
  action: PropTypes.bool,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string
};

// Toast Alert Component
export const ToastAlert = ({
  type = 'info',
  message,
  duration = 5000,
  onClose,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useState(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <Alert
      type={type}
      message={message}
      dismissible={true}
      onClose={onClose}
      className="max-w-sm w-full shadow-lg"
      {...props}
    />
  );
};

ToastAlert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  message: PropTypes.node.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func
};

export default Alert;