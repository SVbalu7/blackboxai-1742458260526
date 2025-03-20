import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Breadcrumbs = ({
  items,
  separator = '/',
  homeIcon,
  className = '',
  ...props
}) => {
  const location = useLocation();

  // If no items are provided, generate from current path
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname);

  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {/* Home Link */}
        <li>
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {homeIcon ? (
              <span className="sr-only">Home</span>
            ) : (
              'Home'
            )}
            {homeIcon && (
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Link>
        </li>

        {/* Separator after home */}
        {breadcrumbItems.length > 0 && (
          <li className="text-gray-400 dark:text-gray-600">
            {typeof separator === 'string' ? separator : (
              <span aria-hidden="true">{separator}</span>
            )}
          </li>
        )}

        {/* Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => (
          <li key={item.path || index}>
            <div className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400 dark:text-gray-600">
                  {typeof separator === 'string' ? separator : (
                    <span aria-hidden="true">{separator}</span>
                  )}
                </span>
              )}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-700 dark:text-gray-300" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string
    })
  ),
  separator: PropTypes.node,
  homeIcon: PropTypes.bool,
  className: PropTypes.string
};

// Helper function to generate breadcrumbs from path
const generateBreadcrumbs = (path) => {
  const paths = path.split('/').filter(Boolean);
  return paths.map((item, index) => {
    const path = `/${paths.slice(0, index + 1).join('/')}`;
    return {
      label: formatBreadcrumbLabel(item),
      path
    };
  });
};

// Helper function to format breadcrumb labels
const formatBreadcrumbLabel = (path) => {
  return path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Dynamic Breadcrumbs Component
export const DynamicBreadcrumbs = ({
  separator = '/',
  homeIcon = true,
  className = '',
  ...props
}) => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  // Build breadcrumb items with dynamic paths
  const breadcrumbItems = paths.map((path, index) => {
    const url = `/${paths.slice(0, index + 1).join('/')}`;
    return {
      label: formatBreadcrumbLabel(path),
      path: url
    };
  });

  return (
    <Breadcrumbs
      items={breadcrumbItems}
      separator={separator}
      homeIcon={homeIcon}
      className={className}
      {...props}
    />
  );
};

DynamicBreadcrumbs.propTypes = {
  separator: PropTypes.node,
  homeIcon: PropTypes.bool,
  className: PropTypes.string
};

// Custom Separator Component
export const BreadcrumbSeparator = ({ type = 'chevron' }) => {
  const separators = {
    chevron: (
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    slash: '/',
    bullet: '•',
    arrow: '→'
  };

  return (
    <span className="text-gray-400 dark:text-gray-600">
      {separators[type] || separators.chevron}
    </span>
  );
};

BreadcrumbSeparator.propTypes = {
  type: PropTypes.oneOf(['chevron', 'slash', 'bullet', 'arrow'])
};

export default Breadcrumbs;