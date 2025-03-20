import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from './Button';

const NotFound = ({
  title = '404: Page Not Found',
  message = "Sorry, we couldn't find the page you're looking for.",
  image,
  showBackButton = true,
  showHomeButton = true,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`
        min-h-[400px]
        flex items-center justify-center
        py-12 px-4 sm:px-6 lg:px-8
        ${className}
      `}
      {...props}
    >
      <div className="text-center">
        {/* Image */}
        {image ? (
          <div className="mb-8">
            {typeof image === 'string' ? (
              <img
                src={image}
                alt="404 Illustration"
                className="mx-auto h-48 w-auto"
              />
            ) : (
              image
            )}
          </div>
        ) : (
          <div className="mb-8">
            <div className="text-6xl font-bold text-gray-900 dark:text-white">
              404
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              <i className="fas fa-arrow-left mr-2" />
              Go Back
            </Button>
          )}
          {showHomeButton && (
            <Button
              variant="primary"
              as={Link}
              to="/"
              className="w-full sm:w-auto"
            >
              <i className="fas fa-home mr-2" />
              Return Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

NotFound.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  showBackButton: PropTypes.bool,
  showHomeButton: PropTypes.bool,
  className: PropTypes.string
};

// Resource Not Found Component
export const ResourceNotFound = ({
  resource = 'Resource',
  showCreate = false,
  onCreate,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        min-h-[200px]
        flex flex-col items-center justify-center
        py-8 px-4
        text-center
        ${className}
      `}
      {...props}
    >
      <div className="mb-4">
        <i className="fas fa-search text-4xl text-gray-400 dark:text-gray-600" />
      </div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No {resource} Found
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        We couldn't find any {resource.toLowerCase()} matching your criteria.
      </p>
      {showCreate && onCreate && (
        <Button
          variant="primary"
          onClick={onCreate}
        >
          <i className="fas fa-plus mr-2" />
          Create {resource}
        </Button>
      )}
    </div>
  );
};

ResourceNotFound.propTypes = {
  resource: PropTypes.string,
  showCreate: PropTypes.bool,
  onCreate: PropTypes.func,
  className: PropTypes.string
};

// Empty State Component
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        min-h-[200px]
        flex flex-col items-center justify-center
        py-8 px-4
        text-center
        ${className}
      `}
      {...props}
    >
      {icon && (
        <div className="mb-4">
          {typeof icon === 'string' ? (
            <i className={`${icon} text-4xl text-gray-400 dark:text-gray-600`} />
          ) : (
            icon
          )}
        </div>
      )}
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
      )}
      {action && (
        <div>
          {typeof action === 'function' ? action() : action}
        </div>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string
};

export default NotFound;