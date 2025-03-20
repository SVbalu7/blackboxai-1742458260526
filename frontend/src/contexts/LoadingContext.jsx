import { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  // Start loading for a specific key
  const startLoading = useCallback((key = 'global') => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  }, []);

  // Stop loading for a specific key
  const stopLoading = useCallback((key = 'global') => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  // Check if a specific key is loading
  const isLoading = useCallback((key = 'global') => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  // Start global loading
  const startGlobalLoading = useCallback(() => {
    setGlobalLoading(true);
  }, []);

  // Stop global loading
  const stopGlobalLoading = useCallback(() => {
    setGlobalLoading(false);
  }, []);

  // Wrapper for async functions to automatically handle loading state
  const withLoading = useCallback(async (key, asyncFunction) => {
    startLoading(key);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  const value = {
    startLoading,
    stopLoading,
    isLoading,
    startGlobalLoading,
    stopGlobalLoading,
    globalLoading,
    withLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {/* Global Loading Overlay */}
      {globalLoading && <GlobalLoadingOverlay />}
    </LoadingContext.Provider>
  );
};

// Loading overlay component
const GlobalLoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      <p className="mt-4 text-gray-700">Loading...</p>
    </div>
  </div>
);

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
    ></div>
  );
};

// Loading button component
export const LoadingButton = ({
  loading,
  children,
  disabled,
  className = '',
  spinnerColor = 'white',
  ...props
}) => (
  <button
    disabled={loading || disabled}
    className={`relative ${className} ${loading ? 'cursor-not-allowed' : ''}`}
    {...props}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" color={spinnerColor} />
      </div>
    )}
    <span className={loading ? 'invisible' : ''}>{children}</span>
  </button>
);

// Loading skeleton component
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    rectangle: 'w-full',
    button: 'h-10 w-full',
    avatar: 'h-12 w-12 rounded-full'
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}></div>;
};

// Loading card skeleton component
export const CardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

// Loading table skeleton component
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-4 gap-4">
      {Array(columns).fill(null).map((_, i) => (
        <Skeleton key={i} className="h-8" />
      ))}
    </div>
    {Array(rows).fill(null).map((_, i) => (
      <div key={i} className="grid grid-cols-4 gap-4">
        {Array(columns).fill(null).map((_, j) => (
          <Skeleton key={j} className="h-6" />
        ))}
      </div>
    ))}
  </div>
);

// Loading list skeleton component
export const ListSkeleton = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array(items).fill(null).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    ))}
  </div>
);

// Example usage:
/*
const ExampleComponent = () => {
  const { withLoading, isLoading } = useLoading();

  const handleClick = async () => {
    await withLoading('example', async () => {
      // Your async operation here
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
  };

  return (
    <div>
      <LoadingButton
        loading={isLoading('example')}
        onClick={handleClick}
        className="btn-primary"
      >
        Click Me
      </LoadingButton>

      {isLoading('example') ? (
        <CardSkeleton />
      ) : (
        <div>Content</div>
      )}
    </div>
  );
};
*/