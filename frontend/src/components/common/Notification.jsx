import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import Portal from './Portal';

const Notification = ({
  show,
  title,
  message,
  type = 'info',
  position = 'top-right',
  duration = 5000,
  showIcon = true,
  showClose = true,
  onClose,
  action,
  className = '',
  ...props
}) => {
  // Type-based classes and icons
  const typeClasses = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-400 dark:text-blue-300',
      title: 'text-blue-800 dark:text-blue-200',
      message: 'text-blue-700 dark:text-blue-300',
      closeButton: 'text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800'
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800',
      icon: 'text-green-400 dark:text-green-300',
      title: 'text-green-800 dark:text-green-200',
      message: 'text-green-700 dark:text-green-300',
      closeButton: 'text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800'
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-400 dark:text-yellow-300',
      title: 'text-yellow-800 dark:text-yellow-200',
      message: 'text-yellow-700 dark:text-yellow-300',
      closeButton: 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800'
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800',
      icon: 'text-red-400 dark:text-red-300',
      title: 'text-red-800 dark:text-red-200',
      message: 'text-red-700 dark:text-red-300',
      closeButton: 'text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800'
    }
  };

  const icons = {
    info: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  // Position classes
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-0 right-0'
  };

  // Auto-close timer
  if (duration && show) {
    setTimeout(() => {
      onClose && onClose();
    }, duration);
  }

  return (
    <Portal containerId="notification-root">
      <div
        className={`
          fixed z-50 m-4
          ${positionClasses[position]}
          ${className}
        `}
        {...props}
      >
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom={position.includes('bottom') ? 'translate-y-2' : '-translate-y-2'}
          enterTo="translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`
              max-w-sm w-full shadow-lg rounded-lg pointer-events-auto
              border
              ${typeClasses[type].container}
            `}
          >
            <div className="p-4">
              <div className="flex items-start">
                {showIcon && (
                  <div className={`flex-shrink-0 ${typeClasses[type].icon}`}>
                    {icons[type]}
                  </div>
                )}
                <div className={`${showIcon ? 'ml-3' : ''} w-0 flex-1`}>
                  {title && (
                    <p className={`text-sm font-medium ${typeClasses[type].title}`}>
                      {title}
                    </p>
                  )}
                  {message && (
                    <p className={`mt-1 text-sm ${typeClasses[type].message}`}>
                      {message}
                    </p>
                  )}
                  {action && (
                    <div className="mt-3 flex space-x-4">
                      {action}
                    </div>
                  )}
                </div>
                {showClose && (
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className={`
                        rounded-md inline-flex
                        ${typeClasses[type].closeButton}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                      `}
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Portal>
  );
};

Notification.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  position: PropTypes.oneOf([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ]),
  duration: PropTypes.number,
  showIcon: PropTypes.bool,
  showClose: PropTypes.bool,
  onClose: PropTypes.func,
  action: PropTypes.node,
  className: PropTypes.string
};

// Toast Component
export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  className = '',
  ...props
}) => {
  return (
    <Notification
      show={true}
      message={message}
      type={type}
      duration={duration}
      position="bottom-center"
      showIcon={false}
      showClose={false}
      onClose={onClose}
      className={`max-w-xs ${className}`}
      {...props}
    />
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  duration: PropTypes.number,
  onClose: PropTypes.func,
  className: PropTypes.string
};

export default Notification;