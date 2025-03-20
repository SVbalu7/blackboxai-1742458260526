import { useState } from 'react';
import { Tab } from '@headlessui/react';
import PropTypes from 'prop-types';

const Tabs = ({
  tabs,
  defaultIndex = 0,
  variant = 'default',
  fullWidth = false,
  onChange,
  className = '',
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  // Base classes
  const baseClasses = 'focus:outline-none';

  // Variant classes
  const variantClasses = {
    default: {
      list: 'flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800',
      tab: {
        base: 'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
        selected: 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white',
        notSelected: 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
      }
    },
    pills: {
      list: 'flex space-x-2',
      tab: {
        base: 'rounded-full px-4 py-2 text-sm font-medium',
        selected: 'bg-primary-600 text-white',
        notSelected: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }
    },
    underline: {
      list: 'flex space-x-8 border-b border-gray-200 dark:border-gray-700',
      tab: {
        base: 'py-4 px-1 text-sm font-medium border-b-2 -mb-px',
        selected: 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500',
        notSelected: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
      }
    },
    bordered: {
      list: 'flex',
      tab: {
        base: 'py-2 px-4 text-sm font-medium border-t border-b border-r first:border-l first:rounded-l-lg last:rounded-r-lg',
        selected: 'bg-primary-600 text-white border-primary-600',
        notSelected: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
      }
    }
  };

  const handleChange = (index) => {
    setSelectedIndex(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className={className} {...props}>
      <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
        <Tab.List className={`${variantClasses[variant].list} ${fullWidth ? 'w-full' : ''}`}>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) => `
                ${baseClasses}
                ${variantClasses[variant].tab.base}
                ${selected
                  ? variantClasses[variant].tab.selected
                  : variantClasses[variant].tab.notSelected
                }
                ${fullWidth ? 'flex-1' : ''}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={tab.disabled}
            >
              <div className="flex items-center justify-center space-x-2">
                {tab.icon && <span className="h-5 w-5">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`
                    rounded-full px-2 py-0.5 text-xs
                    ${selectedIndex === index
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={index}
              className={`
                rounded-xl focus:outline-none
                ${tab.className || ''}
              `}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
      count: PropTypes.number,
      disabled: PropTypes.bool,
      className: PropTypes.string
    })
  ).isRequired,
  defaultIndex: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'pills', 'underline', 'bordered']),
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string
};

// Vertical Tabs Component
export const VerticalTabs = ({
  tabs,
  defaultIndex = 0,
  onChange,
  className = '',
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const handleChange = (index) => {
    setSelectedIndex(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className={`flex space-x-4 ${className}`} {...props}>
      <Tab.Group vertical selectedIndex={selectedIndex} onChange={handleChange}>
        <Tab.List className="flex flex-col space-y-1 w-48">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) => `
                flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg
                focus:outline-none
                ${selected
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={tab.disabled}
            >
              {tab.icon && <span className="h-5 w-5">{tab.icon}</span>}
              <span>{tab.label}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="flex-1">
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={index}
              className={`
                rounded-xl p-4
                focus:outline-none
                ${tab.className || ''}
              `}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

VerticalTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
      disabled: PropTypes.bool,
      className: PropTypes.string
    })
  ).isRequired,
  defaultIndex: PropTypes.number,
  onChange: PropTypes.func,
  className: PropTypes.string
};

export default Tabs;