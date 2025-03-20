import { useState } from 'react';
import PropTypes from 'prop-types';
import { Disclosure, Transition } from '@headlessui/react';

const Accordion = ({
  items,
  variant = 'default',
  allowMultiple = false,
  defaultOpen = [],
  iconPosition = 'right',
  className = '',
  ...props
}) => {
  const [openItems, setOpenItems] = useState(defaultOpen);

  // Variant classes
  const variantClasses = {
    default: {
      container: 'divide-y divide-gray-200 dark:divide-gray-700',
      button: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      icon: 'text-gray-400 dark:text-gray-500'
    },
    bordered: {
      container: 'divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg',
      button: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      icon: 'text-gray-400 dark:text-gray-500'
    },
    minimal: {
      container: 'space-y-2',
      button: 'hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg',
      icon: 'text-gray-400 dark:text-gray-500'
    }
  };

  // Handle item click
  const handleItemClick = (index) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems((prev) =>
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div
      className={`
        ${variantClasses[variant].container}
        ${className}
      `}
      {...props}
    >
      {items.map((item, index) => (
        <Disclosure
          key={index}
          defaultOpen={openItems.includes(index)}
          as="div"
          className={variant === 'minimal' ? 'first:mt-0' : ''}
        >
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`
                  flex items-center justify-between w-full
                  px-4 py-4 text-left
                  text-gray-900 dark:text-white
                  ${variantClasses[variant].button}
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                `}
                onClick={() => handleItemClick(index)}
              >
                <div className="flex items-center">
                  {item.icon && iconPosition === 'left' && (
                    <span className="mr-3 h-5 w-5">{item.icon}</span>
                  )}
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.badge && <span className="ml-2">{item.badge}</span>}
                </div>
                <div className="flex items-center ml-6">
                  {item.icon && iconPosition === 'right' && (
                    <span className="mr-3 h-5 w-5">{item.icon}</span>
                  )}
                  <svg
                    className={`
                      w-5 h-5 transform transition-transform duration-200
                      ${variantClasses[variant].icon}
                      ${open ? 'rotate-180' : ''}
                    `}
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
                </div>
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {item.content}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.node
    })
  ).isRequired,
  variant: PropTypes.oneOf(['default', 'bordered', 'minimal']),
  allowMultiple: PropTypes.bool,
  defaultOpen: PropTypes.arrayOf(PropTypes.number),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string
};

// FAQ Accordion Component
export const FAQAccordion = ({
  faqs,
  className = '',
  ...props
}) => {
  return (
    <Accordion
      items={faqs.map(faq => ({
        title: faq.question,
        content: faq.answer
      }))}
      variant="bordered"
      className={className}
      {...props}
    />
  );
};

FAQAccordion.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.node.isRequired
    })
  ).isRequired,
  className: PropTypes.string
};

// Nested Accordion Component
export const NestedAccordion = ({
  items,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {items.map((item, index) => (
        <Disclosure key={index} as="div">
          {({ open }) => (
            <>
              <Disclosure.Button
                className="
                  flex items-center justify-between w-full
                  px-4 py-2 text-left
                  text-gray-900 dark:text-white
                  bg-gray-50 dark:bg-gray-800
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  rounded-lg
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                "
              >
                <span className="text-sm font-medium">{item.title}</span>
                <svg
                  className={`
                    w-5 h-5 transform transition-transform duration-200
                    text-gray-400 dark:text-gray-500
                    ${open ? 'rotate-180' : ''}
                  `}
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
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 pt-4 pb-2">
                  {item.children && (
                    <NestedAccordion
                      items={item.children}
                      className="ml-4"
                    />
                  )}
                  {item.content && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {item.content}
                    </div>
                  )}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

NestedAccordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node,
      children: PropTypes.array
    })
  ).isRequired,
  className: PropTypes.string
};

export default Accordion;