import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { DynamicBreadcrumbs } from './Breadcrumbs';
import ErrorBoundary from './ErrorBoundary';

const Layout = ({
  children,
  title,
  description,
  showBreadcrumbs = true,
  breadcrumbsProps,
  header,
  footer,
  sidebar,
  className = '',
  ...props
}) => {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <div
      className={`
        min-h-screen bg-gray-50 dark:bg-gray-900
        ${className}
      `}
      {...props}
    >
      {/* Main Content */}
      <div className={`flex ${sidebar ? 'lg:ml-64' : ''}`}>
        {/* Sidebar */}
        {sidebar && (
          <aside className="fixed inset-y-0 left-0 z-20 hidden lg:block w-64">
            {sidebar}
          </aside>
        )}

        {/* Content Area */}
        <div className="flex-1">
          {/* Header */}
          {header && (
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow">
              {header}
            </header>
          )}

          {/* Page Header */}
          {(title || description || showBreadcrumbs) && (
            <div className="bg-white dark:bg-gray-800 shadow">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {showBreadcrumbs && (
                  <DynamicBreadcrumbs
                    className="mb-4"
                    {...breadcrumbsProps}
                  />
                )}
                {title && (
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <ErrorBoundary>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </ErrorBoundary>

          {/* Footer */}
          {footer && (
            <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  showBreadcrumbs: PropTypes.bool,
  breadcrumbsProps: PropTypes.object,
  header: PropTypes.node,
  footer: PropTypes.node,
  sidebar: PropTypes.node,
  className: PropTypes.string
};

// Page Layout Component
export const PageLayout = ({
  children,
  title,
  description,
  actions,
  className = '',
  ...props
}) => {
  return (
    <Layout
      title={title}
      description={description}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        {/* Page Header with Actions */}
        {actions && (
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {title && !props.header && (
                <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                  {title}
                </h2>
              )}
              {description && !props.header && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
            <div className="flex mt-4 sm:mt-0 sm:ml-4">{actions}</div>
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    </Layout>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string
};

// Card Layout Component
export const CardLayout = ({
  children,
  title,
  description,
  actions,
  className = '',
  ...props
}) => {
  return (
    <Layout {...props}>
      <div className={`bg-white dark:bg-gray-800 shadow rounded-lg ${className}`}>
        {/* Card Header */}
        {(title || description || actions) && (
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div>{actions}</div>}
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="px-4 py-5 sm:p-6">{children}</div>
      </div>
    </Layout>
  );
};

CardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string
};

// Grid Layout Component
export const GridLayout = ({
  children,
  cols = 3,
  gap = 6,
  className = '',
  ...props
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  const gapClass = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <Layout {...props}>
      <div
        className={`
          grid ${colsClass[cols]} ${gapClass[gap]}
          ${className}
        `}
      >
        {children}
      </div>
    </Layout>
  );
};

GridLayout.propTypes = {
  children: PropTypes.node.isRequired,
  cols: PropTypes.oneOf([1, 2, 3, 4]),
  gap: PropTypes.oneOf([4, 6, 8]),
  className: PropTypes.string
};

export default Layout;