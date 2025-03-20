import { useState } from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import PropTypes from 'prop-types';

const Switch = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: {
      switch: 'h-5 w-9',
      dot: 'h-3 w-3',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'h-6 w-11',
      dot: 'h-4 w-4',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'h-7 w-12',
      dot: 'h-5 w-5',
      translate: 'translate-x-5'
    }
  };

  // Color classes
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  };

  return (
    <div className={`flex items-center ${className}`} {...props}>
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          relative inline-flex shrink-0
          border-2 border-transparent rounded-full
          cursor-pointer transition-colors ease-in-out duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
          ${sizeClasses[size].switch}
          ${checked ? colorClasses[color] : 'bg-gray-200 dark:bg-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full
            bg-white shadow transform ring-0 transition ease-in-out duration-200
            ${sizeClasses[size].dot}
            ${checked ? sizeClasses[size].translate : 'translate-x-1'}
          `}
        />
      </HeadlessSwitch>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <HeadlessSwitch.Label
              className={`
                font-medium text-gray-900 dark:text-gray-100
                ${disabled ? 'opacity-50' : ''}
              `}
            >
              {label}
            </HeadlessSwitch.Label>
          )}
          {description && (
            <HeadlessSwitch.Description
              className={`
                text-sm text-gray-500 dark:text-gray-400
                ${disabled ? 'opacity-50' : ''}
              `}
            >
              {description}
            </HeadlessSwitch.Description>
          )}
        </div>
      )}
    </div>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  description: PropTypes.node,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  className: PropTypes.string
};

// Toggle Group Component
export const ToggleGroup = ({
  value,
  onChange,
  options,
  disabled = false,
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Color classes
  const colorClasses = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-600 text-white',
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white'
  };

  return (
    <div
      className={`
        inline-flex rounded-md shadow-sm
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      role="group"
      {...props}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && onChange(option.value)}
          className={`
            ${sizeClasses[size]}
            ${
              value === option.value
                ? colorClasses[color]
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }
            border border-gray-300 dark:border-gray-600
            font-medium
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
            first:rounded-l-md last:rounded-r-md
            -ml-px first:ml-0
          `}
          disabled={disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

ToggleGroup.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired
    })
  ).isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  className: PropTypes.string
};

// Toggle Button Component
export const ToggleButton = ({
  checked,
  onChange,
  children,
  disabled = false,
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Color classes
  const colorClasses = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-600 text-white',
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white'
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`
        ${sizeClasses[size]}
        ${
          checked
            ? colorClasses[color]
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }
        border border-gray-300 dark:border-gray-600
        rounded-md
        font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

ToggleButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  className: PropTypes.string
};

export default Switch;