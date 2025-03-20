import { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { NOTIFICATION_TYPES } from '../utils/constants';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  // Success notification
  const success = useCallback((message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      position: 'top-right',
      icon: '✅',
      ...options,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        ...options.style
      }
    });
  }, []);

  // Error notification
  const error = useCallback((message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      position: 'top-right',
      icon: '❌',
      ...options,
      style: {
        background: '#EF4444',
        color: '#FFFFFF',
        ...options.style
      }
    });
  }, []);

  // Warning notification
  const warning = useCallback((message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      ...options,
      style: {
        background: '#F59E0B',
        color: '#FFFFFF',
        ...options.style
      }
    });
  }, []);

  // Info notification
  const info = useCallback((message, options = {}) => {
    return toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      ...options,
      style: {
        background: '#3B82F6',
        color: '#FFFFFF',
        ...options.style
      }
    });
  }, []);

  // Custom notification
  const custom = useCallback((message, options = {}) => {
    return toast(message, {
      duration: 3000,
      position: 'top-right',
      ...options
    });
  }, []);

  // Promise notification
  const promise = useCallback((promise, messages = {}, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred'
      },
      {
        duration: 3000,
        position: 'top-right',
        ...options
      }
    );
  }, []);

  // Notification with action buttons
  const withAction = useCallback((message, actions = [], options = {}) => {
    return toast(
      (t) => (
        <div className="flex items-center justify-between w-full">
          <span>{message}</span>
          <div className="flex space-x-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  toast.dismiss(t.id);
                }}
                className={`px-2 py-1 text-sm rounded ${action.className || 'bg-white text-gray-800'}`}
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
        ...options
      }
    );
  }, []);

  // Dismiss all notifications
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  // Show notification based on type
  const show = useCallback((type, message, options = {}) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return success(message, options);
      case NOTIFICATION_TYPES.ERROR:
        return error(message, options);
      case NOTIFICATION_TYPES.WARNING:
        return warning(message, options);
      case NOTIFICATION_TYPES.INFO:
        return info(message, options);
      default:
        return custom(message, options);
    }
  }, [success, error, warning, info, custom]);

  const value = {
    success,
    error,
    warning,
    info,
    custom,
    promise,
    withAction,
    dismissAll,
    show
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification components
export const NotificationContainer = () => (
  <div className="fixed inset-0 pointer-events-none flex flex-col items-end justify-start p-4 space-y-4">
    {/* Toast notifications will be rendered here */}
  </div>
);

// Example usage of notifications with different styles
export const NotificationExamples = () => {
  const { success, error, warning, info, withAction, promise } = useNotification();

  const showExamples = () => {
    // Success notification
    success('Operation completed successfully!');

    // Error notification
    error('An error occurred while processing your request.');

    // Warning notification
    warning('Please save your changes before leaving.');

    // Info notification
    info('New updates are available.');

    // Notification with actions
    withAction(
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          className: 'bg-gray-200 hover:bg-gray-300'
        },
        {
          text: 'Delete',
          className: 'bg-red-500 text-white hover:bg-red-600',
          onClick: () => console.log('Delete clicked')
        }
      ]
    );

    // Promise notification
    promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Saving changes...',
        success: 'Changes saved successfully!',
        error: 'Could not save changes.'
      }
    );
  };

  return (
    <button
      onClick={showExamples}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Show Notification Examples
    </button>
  );
};