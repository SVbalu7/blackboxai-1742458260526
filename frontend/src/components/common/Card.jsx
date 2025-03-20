import PropTypes from 'prop-types';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  clickable = false,
  bordered = true,
  shadow = true,
  padding = true,
  onClick,
  ...props
}) => {
  // Base classes
  const baseClasses = `
    rounded-lg
    overflow-hidden
    transition-all
    duration-200
    ${bordered ? 'border dark:border-gray-700' : ''}
    ${shadow ? 'shadow-sm' : ''}
    ${padding ? 'p-4 sm:p-6' : ''}
    ${clickable ? 'cursor-pointer' : ''}
    ${hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600' : ''}
  `;

  // Variant classes
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200',
    primary: 'bg-primary-50 dark:bg-primary-900 border-primary-200 dark:border-primary-700',
    success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
    warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
    danger: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  hover: PropTypes.bool,
  clickable: PropTypes.bool,
  bordered: PropTypes.bool,
  shadow: PropTypes.bool,
  padding: PropTypes.bool,
  onClick: PropTypes.func
};

// Card Header Component
export const CardHeader = ({
  children,
  className = '',
  bordered = true,
  ...props
}) => {
  return (
    <div
      className={`
        px-4 py-5 sm:px-6
        ${bordered ? 'border-b dark:border-gray-700' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  bordered: PropTypes.bool
};

// Card Body Component
export const CardBody = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`px-4 py-5 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

// Card Footer Component
export const CardFooter = ({
  children,
  className = '',
  bordered = true,
  ...props
}) => {
  return (
    <div
      className={`
        px-4 py-4 sm:px-6
        ${bordered ? 'border-t dark:border-gray-700' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  bordered: PropTypes.bool
};

// Stat Card Component
export const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType = 'increase',
  className = '',
  ...props
}) => {
  const changeColors = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <Card
      className={`${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${changeColors[changeType]}`}>
            <span className="font-medium">{change}</span>
            <svg
              className={`w-5 h-5 ml-1 ${
                changeType === 'decrease' ? 'transform rotate-180' : ''
              }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
      )}
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(['increase', 'decrease', 'neutral']),
  className: PropTypes.string
};

// Action Card Component
export const ActionCard = ({
  title,
  description,
  action,
  icon,
  className = '',
  ...props
}) => {
  return (
    <Card
      className={`hover:border-primary-300 dark:hover:border-primary-600 ${className}`}
      clickable
      {...props}
    >
      <div className="flex items-center">
        {icon && (
          <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
            {icon}
          </div>
        )}
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className="ml-auto">
          {action}
        </div>
      </div>
    </Card>
  );
};

ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.node,
  icon: PropTypes.node,
  className: PropTypes.string
};

export default Card;