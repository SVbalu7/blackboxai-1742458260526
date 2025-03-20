import PropTypes from 'prop-types';
import { format } from 'date-fns';

const Timeline = ({
  items,
  variant = 'default',
  align = 'left',
  showConnector = true,
  className = '',
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: {
      icon: 'bg-gray-400 dark:bg-gray-600',
      connector: 'bg-gray-200 dark:bg-gray-700'
    },
    primary: {
      icon: 'bg-primary-500',
      connector: 'bg-primary-200 dark:bg-primary-900'
    },
    success: {
      icon: 'bg-green-500',
      connector: 'bg-green-200 dark:bg-green-900'
    },
    warning: {
      icon: 'bg-yellow-500',
      connector: 'bg-yellow-200 dark:bg-yellow-900'
    },
    danger: {
      icon: 'bg-red-500',
      connector: 'bg-red-200 dark:bg-red-900'
    },
    info: {
      icon: 'bg-blue-500',
      connector: 'bg-blue-200 dark:bg-blue-900'
    }
  };

  // Alignment classes
  const alignmentClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0'
  };

  return (
    <div
      className={`relative ${className}`}
      {...props}
    >
      {/* Connector Line */}
      {showConnector && (
        <div
          className={`
            absolute top-0 bottom-0 w-0.5
            ${variantClasses[variant].connector}
            ${alignmentClasses[align]}
          `}
        />
      )}

      {/* Timeline Items */}
      <div className="relative space-y-8">
        {items.map((item, index) => (
          <TimelineItem
            key={index}
            item={item}
            variant={item.variant || variant}
            align={align}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

Timeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      icon: PropTypes.node,
      variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
      badge: PropTypes.node
    })
  ).isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  showConnector: PropTypes.bool,
  className: PropTypes.string
};

// Timeline Item Component
const TimelineItem = ({ item, variant, align, isLast }) => {
  const variantClasses = {
    default: {
      icon: 'bg-gray-400 dark:bg-gray-600',
      connector: 'bg-gray-200 dark:bg-gray-700'
    },
    primary: {
      icon: 'bg-primary-500',
      connector: 'bg-primary-200 dark:bg-primary-900'
    },
    success: {
      icon: 'bg-green-500',
      connector: 'bg-green-200 dark:bg-green-900'
    },
    warning: {
      icon: 'bg-yellow-500',
      connector: 'bg-yellow-200 dark:bg-yellow-900'
    },
    danger: {
      icon: 'bg-red-500',
      connector: 'bg-red-200 dark:bg-red-900'
    },
    info: {
      icon: 'bg-blue-500',
      connector: 'bg-blue-200 dark:bg-blue-900'
    }
  };

  return (
    <div className="relative">
      {/* Icon */}
      <div
        className={`
          absolute ${align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'}
          flex items-center justify-center w-8 h-8 rounded-full
          ${variantClasses[variant].icon}
          text-white
        `}
      >
        {item.icon || (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div
        className={`
          relative
          ${align === 'right' ? 'mr-12' : align === 'center' ? 'mx-12' : 'ml-12'}
        `}
      >
        <div className="flex items-center mb-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {item.title}
          </h3>
          {item.badge && (
            <div className="ml-2">
              {item.badge}
            </div>
          )}
        </div>

        {item.date && (
          <time className="block mb-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            {typeof item.date === 'string'
              ? item.date
              : format(item.date, 'PPP')}
          </time>
        )}

        {item.content && (
          <div className="text-base font-normal text-gray-600 dark:text-gray-300">
            {item.content}
          </div>
        )}
      </div>
    </div>
  );
};

TimelineItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.node,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    icon: PropTypes.node,
    badge: PropTypes.node
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  isLast: PropTypes.bool
};

// Simple Timeline Component
export const SimpleTimeline = ({
  items,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`space-y-6 ${className}`}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="flex space-x-4"
        >
          <div className="flex-none">
            <div className="w-2 h-2 mt-2 rounded-full bg-gray-400 dark:bg-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {item.title}
            </p>
            {item.date && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {typeof item.date === 'string'
                  ? item.date
                  : format(item.date, 'PPP')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

SimpleTimeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    })
  ).isRequired,
  className: PropTypes.string
};

export default Timeline;