import { Fragment } from 'react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Menu = ({
  trigger,
  items,
  align = 'right',
  width = 'w-48',
  className = '',
  ...props
}) => {
  // Alignment classes
  const alignmentClasses = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
    center: 'left-1/2 -translate-x-1/2 origin-top'
  };

  return (
    <HeadlessMenu as="div" className="relative inline-block text-left" {...props}>
      {/* Trigger */}
      <HeadlessMenu.Button as={Fragment}>
        {trigger}
      </HeadlessMenu.Button>

      {/* Dropdown */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items
          className={`
            absolute z-50 mt-2
            ${alignmentClasses[align]}
            ${width}
            rounded-md shadow-lg
            bg-white dark:bg-gray-800
            ring-1 ring-black ring-opacity-5
            divide-y divide-gray-100 dark:divide-gray-700
            focus:outline-none
            ${className}
          `}
        >
          {items.map((section, sectionIndex) => (
            <div key={sectionIndex} className="py-1">
              {section.map((item, itemIndex) => {
                if (item.divider) {
                  return (
                    <div
                      key={itemIndex}
                      className="my-1 border-t border-gray-100 dark:border-gray-700"
                    />
                  );
                }

                const itemContent = (
                  <>
                    <div className="flex items-center">
                      {item.icon && (
                        <span className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </>
                );

                return (
                  <HeadlessMenu.Item key={itemIndex}>
                    {({ active }) => {
                      const className = `
                        group flex flex-col px-4 py-2 text-sm
                        ${active
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-200'
                        }
                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${item.className || ''}
                      `;

                      if (item.href) {
                        return (
                          <Link to={item.href} className={className}>
                            {itemContent}
                          </Link>
                        );
                      }

                      return (
                        <button
                          onClick={item.onClick}
                          disabled={item.disabled}
                          className={className}
                        >
                          {itemContent}
                        </button>
                      );
                    }}
                  </HeadlessMenu.Item>
                );
              })}
            </div>
          ))}
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
};

Menu.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.node,
        description: PropTypes.string,
        href: PropTypes.string,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
        divider: PropTypes.bool,
        className: PropTypes.string
      })
    )
  ).isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']),
  width: PropTypes.string,
  className: PropTypes.string
};

// Context Menu Component
export const ContextMenu = ({
  children,
  items,
  className = '',
  ...props
}) => {
  return (
    <div className="relative inline-block" {...props}>
      <div
        className={`
          inline-block
          ${className}
        `}
        onContextMenu={(e) => {
          e.preventDefault();
          // Show custom context menu
        }}
      >
        {children}
      </div>
      <Menu
        items={items}
        trigger={<div />} // Hidden trigger
        className="absolute"
      />
    </div>
  );
};

ContextMenu.propTypes = {
  children: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.node,
        description: PropTypes.string,
        href: PropTypes.string,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
        divider: PropTypes.bool,
        className: PropTypes.string
      })
    )
  ).isRequired,
  className: PropTypes.string
};

// Navigation Menu Component
export const NavigationMenu = ({
  items,
  vertical = false,
  className = '',
  ...props
}) => {
  return (
    <nav
      className={`
        ${vertical ? 'flex-col' : 'flex-row'}
        flex items-center space-x-4
        ${className}
      `}
      {...props}
    >
      {items.map((item, index) => {
        if (item.children) {
          return (
            <Menu
              key={index}
              trigger={
                <button
                  className={`
                    flex items-center space-x-2
                    px-3 py-2 rounded-md text-sm font-medium
                    ${item.current
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span>{item.label}</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              }
              items={[item.children]}
            />
          );
        }

        return (
          <Link
            key={index}
            to={item.href}
            className={`
              px-3 py-2 rounded-md text-sm font-medium
              ${item.current
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

NavigationMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      current: PropTypes.bool,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string,
          onClick: PropTypes.func
        })
      )
    })
  ).isRequired,
  vertical: PropTypes.bool,
  className: PropTypes.string
};

export default Menu;