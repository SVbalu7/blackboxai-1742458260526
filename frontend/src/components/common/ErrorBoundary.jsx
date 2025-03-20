import { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const {
      fallback,
      children,
      showReset = true,
      resetButtonText = 'Try Again',
      showError = process.env.NODE_ENV === 'development'
    } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return typeof fallback === 'function'
          ? fallback({ error, errorInfo, reset: this.handleReset })
          : fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              An unexpected error has occurred. Our team has been notified and is working to fix the issue.
            </p>

            {showError && error && (
              <div className="mb-4">
                <details className="text-left bg-red-50 dark:bg-red-900/50 rounded-lg p-4 mb-2">
                  <summary className="text-red-800 dark:text-red-200 cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                    {error.toString()}
                  </pre>
                  {errorInfo && (
                    <pre className="mt-2 text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              {showReset && (
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                >
                  {resetButtonText}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
  showReset: PropTypes.bool,
  resetButtonText: PropTypes.string,
  showError: PropTypes.bool
};

// Component Error Boundary HOC
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundary = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithErrorBoundary;
};

// Async Error Boundary Component
export const AsyncErrorBoundary = ({
  children,
  loading = false,
  error = null,
  onReset,
  ...props
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBoundary
        fallback={
          <div className="text-center p-4">
            <p className="text-red-600 dark:text-red-400 mb-4">{error.message}</p>
            {onReset && (
              <Button variant="primary" onClick={onReset}>
                Try Again
              </Button>
            )}
          </div>
        }
        {...props}
      >
        {children}
      </ErrorBoundary>
    );
  }

  return <ErrorBoundary {...props}>{children}</ErrorBoundary>;
};

AsyncErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  onReset: PropTypes.func
};

export default ErrorBoundary;