import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

const Dropdown = ({
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
    right: 'right-0 origin-top-right'
  };

  return (
    <Menu as="div" className="relative inline-block text-left" {...props}>
      {/* Trigger */}
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      {/* Dropdown menu */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`
            absolute z-50 mt-2
            ${width}
            ${alignmentClasses[align]}
            rounded-md bg-white dark:bg-gray-800
            shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none
            ${className}
          `}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Fragment key={index}>
                {item.divider ? (
                  <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                ) : (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`
                          ${active
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-200'
                          }
                          group flex w-full items-center px-4 py-2 text-sm
                          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onClick={item.onClick}
                        disabled={item.disabled}
                      >
                        {item.icon && (
                          <span className="mr-3 h-5 w-5" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </button>
                    )}
                  </Menu.Item>
                )}
              </Fragment>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.node,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
      divider: PropTypes.bool
    })
  ).isRequired,
  align: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.string,
  className: PropTypes.string
};

// Select Dropdown Component
export const Select = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          block w-full rounded-md border-gray-300 dark:border-gray-600
          focus:border-primary-500 focus:ring-primary-500
          dark:bg-gray-700 dark:text-white
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

Select.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

// Multi-select Dropdown Component
export const MultiSelect = ({
  value = [],
  onChange,
  options,
  placeholder = 'Select options',
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(selectedOptions);
  };

  return (
    <div className="relative">
      <select
        multiple
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          block w-full rounded-md border-gray-300 dark:border-gray-600
          focus:border-primary-500 focus:ring-primary-500
          dark:bg-gray-700 dark:text-white
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Hold Ctrl (Windows) or Command (Mac) to select multiple options
      </p>
    </div>
  );
};

MultiSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default Dropdown;