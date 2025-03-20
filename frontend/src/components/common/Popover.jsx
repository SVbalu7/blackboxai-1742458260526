import { Fragment } from 'react';
import { Popover as HeadlessPopover, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

const Popover = ({
  trigger,
  content,
  position = 'bottom',
  align = 'center',
  offset = 8,
  arrow = true,
  width = 'w-64',
  className = '',
  ...props
}) => {
  // Position and alignment classes
  const positionClasses = {
    top: {
      panel: '-top-2 transform -translate-y-full',
      arrow: 'bottom-0 transform translate-y-full',
      arrowRotate: 'rotate-180'
    },
    bottom: {
      panel: '-bottom-2 transform translate-y-full',
      arrow: 'top-0 transform -translate-y-full',
      arrowRotate: ''
    },
    left: {
      panel: '-left-2 transform -translate-x-full',
      arrow: 'right-0 transform translate-x-full',
      arrowRotate: 'rotate-90'
    },
    right: {
      panel: '-right-2 transform translate-x-full',
      arrow: 'left-0 transform -translate-x-full',
      arrowRotate: '-rotate-90'
    }
  };

  const alignmentClasses = {
    start: position === 'left' || position === 'right' ? 'top-0' : 'left-0',
    center: position === 'left' || position === 'right' ? 'top-1/2 -translate-y-1/2' : 'left-1/2 -translate-x-1/2',
    end: position === 'left' || position === 'right' ? 'bottom-0' : 'right-0'
  };

  return (
    <HeadlessPopover className="relative" {...props}>
      {/* Trigger */}
      <HeadlessPopover.Button as={Fragment}>
        {trigger}
      </HeadlessPopover.Button>

      {/* Panel */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <HeadlessPopover.Panel
          className={`
            absolute z-50
            ${positionClasses[position].panel}
            ${alignmentClasses[align]}
            ${width}
            ${className}
          `}
          style={{
            [position]: `${offset}px`
          }}
        >
          {/* Arrow */}
          {arrow && (
            <div
              className={`
                absolute
                ${positionClasses[position].arrow}
                ${align === 'center' ? 'left-1/2 -translate-x-1/2' : ''}
                ${align === 'end' ? 'right-4' : ''}
                ${align === 'start' ? 'left-4' : ''}
              `}
            >
              <div
                className={`
                  transform ${positionClasses[position].arrowRotate}
                  h-2 w-2 rotate-45
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                `}
              />
            </div>
          )}

          {/* Content */}
          <div
            className="
              relative
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-lg shadow-lg
              overflow-hidden
            "
          >
            {typeof content === 'function' ? content() : content}
          </div>
        </HeadlessPopover.Panel>
      </Transition>
    </HeadlessPopover>
  );
};

Popover.propTypes = {
  trigger: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  align: PropTypes.oneOf(['start', 'center', 'end']),
  offset: PropTypes.number,
  arrow: PropTypes.bool,
  width: PropTypes.string,
  className: PropTypes.string
};

// Info Popover Component
export const InfoPopover = ({
  content,
  size = 'sm',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base'
  };

  return (
    <Popover
      trigger={
        <button
          type="button"
          className={`
            inline-flex items-center justify-center
            rounded-full
            text-gray-500 dark:text-gray-400
            bg-gray-100 dark:bg-gray-800
            hover:bg-gray-200 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
            ${sizeClasses[size]}
            ${className}
          `}
        >
          <span className="sr-only">Information</span>
          <i className="fas fa-info" />
        </button>
      }
      content={content}
      {...props}
    />
  );
};

InfoPopover.propTypes = {
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

// Action Popover Component
export const ActionPopover = ({
  trigger,
  actions,
  className = '',
  ...props
}) => {
  return (
    <Popover
      trigger={trigger}
      content={
        <div className="py-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                w-full text-left px-4 py-2 text-sm
                ${action.disabled
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : `text-gray-700 dark:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     ${action.dangerous ? 'text-red-600 dark:text-red-400' : ''}`
                }
                ${action.className || ''}
              `}
              disabled={action.disabled}
            >
              <div className="flex items-center">
                {action.icon && (
                  <span className="mr-2 h-4 w-4">{action.icon}</span>
                )}
                {action.label}
              </div>
            </button>
          ))}
        </div>
      }
      className={className}
      {...props}
    />
  );
};

ActionPopover.propTypes = {
  trigger: PropTypes.node.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.node,
      disabled: PropTypes.bool,
      dangerous: PropTypes.bool,
      className: PropTypes.string
    })
  ).isRequired,
  className: PropTypes.string
};

export default Popover;