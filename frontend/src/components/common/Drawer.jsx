import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

const Drawer = ({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  children,
  title,
  showClose = true,
  overlay = true,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full'
  };

  // Position classes
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0 inset-x-0',
    bottom: 'bottom-0 inset-x-0'
  };

  // Transform classes for different positions
  const transformClasses = {
    left: '-translate-x-full',
    right: 'translate-x-full',
    top: '-translate-y-full',
    bottom: 'translate-y-full'
  };

  // Width/Height classes based on position
  const dimensionClasses = {
    left: 'h-full w-full',
    right: 'h-full w-full',
    top: 'w-full h-auto',
    bottom: 'w-full h-auto'
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-50"
        onClose={onClose}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Overlay */}
          {overlay && (
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />
            </Transition.Child>
          )}

          {/* Drawer */}
          <div className={`fixed ${positionClasses[position]} flex`}>
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom={transformClasses[position]}
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo={transformClasses[position]}
            >
              <div
                className={`
                  relative bg-white dark:bg-gray-800
                  ${dimensionClasses[position]}
                  ${sizeClasses[size]}
                  ${className}
                `}
              >
                {/* Header */}
                {(title || showClose) && (
                  <div className="px-4 py-6 sm:px-6 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      {title && (
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          {title}
                        </Dialog.Title>
                      )}
                      {showClose && (
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="relative flex-1 overflow-y-auto">
                  {children}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

Drawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'full']),
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  showClose: PropTypes.bool,
  overlay: PropTypes.bool,
  className: PropTypes.string
};

// Navigation Drawer Component
export const NavigationDrawer = ({
  items,
  footer,
  ...props
}) => {
  return (
    <Drawer position="left" size="md" {...props}>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={item.onClick}
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md
              ${item.current
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }
            `}
          >
            {item.icon && (
              <span className="mr-3 h-6 w-6">{item.icon}</span>
            )}
            {item.label}
          </a>
        ))}
      </nav>
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {footer}
        </div>
      )}
    </Drawer>
  );
};

NavigationDrawer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      current: PropTypes.bool,
      onClick: PropTypes.func
    })
  ).isRequired,
  footer: PropTypes.node
};

// Filter Drawer Component
export const FilterDrawer = ({
  filters,
  onApply,
  onReset,
  ...props
}) => {
  return (
    <Drawer position="right" size="sm" {...props}>
      <div className="px-4 py-6">
        <div className="space-y-6">
          {filters}
        </div>
        <div className="mt-8 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Drawer>
  );
};

FilterDrawer.propTypes = {
  filters: PropTypes.node.isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default Drawer;